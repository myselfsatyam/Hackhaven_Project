"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@anthropic-ai/sdk");
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const promises_1 = __importDefault(require("readline/promises"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
}
class MCPClient {
    constructor() {
        this.transport = null;
        this.tools = [];
        this.anthropic = new sdk_1.Anthropic({
            apiKey: ANTHROPIC_API_KEY,
        });
        this.mcp = new index_js_1.Client({ name: "mcp-client-cli", version: "1.0.0" });
    }
    connectToServer(serverScriptPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isJs = serverScriptPath.endsWith(".js");
                const isPy = serverScriptPath.endsWith(".py");
                if (!isJs && !isPy) {
                    throw new Error("Server script must be a .js or .py file");
                }
                const command = isPy
                    ? process.platform === "win32"
                        ? "python"
                        : "python3"
                    : process.execPath;
                this.transport = new stdio_js_1.StdioClientTransport({
                    command,
                    args: [serverScriptPath],
                });
                this.mcp.connect(this.transport);
                const toolsResult = yield this.mcp.listTools();
                this.tools = toolsResult.tools.map((tool) => {
                    return {
                        name: tool.name,
                        description: tool.description,
                        input_schema: tool.inputSchema,
                    };
                });
                console.log("Connected to server with tools:", this.tools.map(({ name }) => name));
            }
            catch (e) {
                console.log("Failed to connect to MCP server: ", e);
                throw e;
            }
        });
    }
    processQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [
                {
                    role: "user",
                    content: query,
                },
            ];
            const response = yield this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1000,
                messages,
                tools: this.tools,
            });
            const finalText = [];
            const toolResults = [];
            for (const content of response.content) {
                if (content.type === "text") {
                    finalText.push(content.text);
                }
                else if (content.type === "tool_use") {
                    const toolName = content.name;
                    const toolArgs = content.input;
                    const result = yield this.mcp.callTool({
                        name: toolName,
                        arguments: toolArgs,
                    });
                    toolResults.push(result);
                    finalText.push(`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`);
                    messages.push({
                        role: "user",
                        content: result.content,
                    });
                    const response = yield this.anthropic.messages.create({
                        model: "claude-3-5-sonnet-20241022",
                        max_tokens: 1000,
                        messages,
                    });
                    finalText.push(response.content[0].type === "text" ? response.content[0].text : "");
                }
            }
            return finalText.join("\n");
        });
    }
    chatLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = promises_1.default.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            try {
                console.log("\nMCP Client Started!");
                console.log("Type your queries or 'quit' to exit.");
                while (true) {
                    const message = yield rl.question("\nQuery: ");
                    if (message.toLowerCase() === "quit") {
                        break;
                    }
                    const response = yield this.processQuery(message);
                    console.log("\n" + response);
                }
            }
            finally {
                rl.close();
            }
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mcp.close();
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.argv.length < 3) {
            console.log("Usage: node index.ts <path_to_server_script>");
            return;
        }
        const mcpClient = new MCPClient();
        try {
            yield mcpClient.connectToServer(process.argv[2]);
            yield mcpClient.chatLoop();
        }
        finally {
            yield mcpClient.cleanup();
            process.exit(0);
        }
    });
}
main();

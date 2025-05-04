import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { aggregateMarketData } from "./server/services/fetchData.js"; // Correct import
import { getTopStockSuggestions } from "./server/services/suggestions.js"; // Your custom logic

import { placeOrder,getHoldings } from "./server/services/trade.js"; // Your custom logic


const server = new McpServer({
  name: "trade",
  version: "1.0.0",
});

// Tool definition for fetching market data
server.tool(
  "show_me_the_data",  // ✅ Valid tool name
  { symbol: z.string() },
  async ({ symbol }) => {
    try {
      const data = await aggregateMarketData(symbol); // Fetch the data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2), // Ensure it's valid JSON
          },
        ],
      };
    } catch (error) {
      console.error('Error in tool: ', error);  // Log the error for better debugging
      return {
        content: [
          {
            type: "text",
            text: `Error fetching data: ${error.message}`, // Return a structured error message
          },
        ],
      };
    }
  }
);
server.tool(
  "suggest_top_stocks",
  { sector: z.string().optional() },
  async ({ sector }) => {
    try {
      const suggestions = await getTopStockSuggestions(sector); // Implement this function based on your logic

      return {
        content: [
          {
            type: "text",
            text: `📈 Top stock suggestions${sector ? ` in the ${sector} sector` : ""}:\n\n` +
              suggestions.map((s, i) => `${i + 1}. ${s.symbol} - ${s.reason}`).join("\n"),
          },
        ],
      };
    } catch (error) {
      console.error("Error suggesting stocks:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to suggest stocks: ${error.message}`,
          },
        ],
      };
    }
  }
);
server.tool("buy_the_stock", { stock: z.string(), qty: z.number() }, async ({ stock, qty }) => {
  try {
    await placeOrder(stock, qty, "BUY");
    return {
      content: [
        {
          type: "text",
          text: `💰 Bought stock: ${stock} having quantity: ${qty}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Failed to buy stock: ${stock}. Error: ${error.message}`,
        },
      ],
    };
  }
});

server.tool("sell_the_stock", { stock: z.string(), qty: z.number() }, async ({ stock, qty }) => {
  try {
    await placeOrder(stock, qty, "SELL");
    return {
      content: [
        {
          type: "text",
          text: `💰 Sold stock: ${stock} having quantity: ${qty}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Failed to sell stock: ${stock}. Error: ${error.message}`,
        },
      ],
    };
  }
});
server.tool("show_portfolio", {}, async () => {
    return {
      content: [
        {
          type: "text",
          text: await getHoldings(),
        },
      ],
    };
  } 
);

// Transport configuration
const transport = new StdioServerTransport();

// Try connecting to the transport
try {
  await server.connect(transport); // Connect the server to the transport
} catch (error) {
  console.error('Error connecting to server transport: ', error);
  throw error;  // Re-throw error if connection fails
}
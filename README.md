# 📈 BackupTradePilot

**BackupTradePilot** is a robust trading application designed to seamlessly integrate with multiple APIs and provide powerful tools for market data analysis, stock recommendations, and automated trading workflows. Whether you're a developer, data analyst, or active trader, BackupTradePilot equips you with a modular client-server system for smarter trading automation and portfolio management.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🛠️ Installation](#-installation)
- [🚀 Usage](#-usage)
- [🔐 Environment Variables](#-environment-variables)
- [📜 Scripts](#-scripts)
- [📄 License](#-license)

---

## ✨ Features

- **📊 Market Data Analysis**  
  Fetches stock price trends, trading volumes, and fundamental metrics using external APIs.

- **📈 Stock Recommendations**  
  Suggests stocks based on momentum strategies and sector analysis.

- **🤖 Automated Trading**  
  Executes buy/sell orders using broker APIs such as Zerodha Kite.

- **📂 Portfolio Management**  
  Retrieves and displays current stock holdings from linked trading accounts.

- **🔌 Client-Server Communication**  
  Uses the Model Context Protocol (MCP) for efficient interaction between frontend and backend.

---

## 📁 Project Structure
backupTradePilot-main/
├── client/
│ ├── src/
│ │ ├── services/
│ │ │ ├── zerodhaClient.js # Zerodha API integration
│ │ │ ├── fetchData.js # Fetches market data
│ │ │ ├── suggestions.js # Provides stock suggestions
│ │ ├── index.ts # Main client entry point
│ │ ├── utils/
│ │ │ ├── logger.js # Logging utility
│ ├── package.json # Client dependencies and scripts
├── dummy/
│ ├── index.js # Example API calls and initialization
├── server/
│ ├── server.js # MCP server implementation
│ ├── services/
│ │ ├── trade.js # Handles order placement and portfolio retrieval
│ │ ├── fetchData.js # Fetches market data from APIs
│ │ ├── suggestions.js # Provides stock suggestions
├── config/
│ ├── settings.js # Configuration for API keys and server URLs
├── package.json # Project dependencies and scripts
├── README.md # Project documentation


---

## 🛠️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/backupTradePilot.git
cd backupTradePilot
Install dependencies:
bash
Copy code
# Install server dependencies
npm install

# Navigate to client folder and install client dependencies
cd client
npm install
🚀 Usage
Configure environment variables (see 🔐 Environment Variables section).

Start the server:

bash
Copy code
npm run start:server
Run the client:
bash
Copy code
cd client
npm start
Test with dummy scripts:
bash
Copy code
node dummy/index.js
🔐 Environment Variables
Create a .env file (or update config/settings.js) with the following keys:

env
Copy code
ZERODHA_API_KEY=your_api_key
ZERODHA_API_SECRET=your_api_secret
SERVER_URL=http://localhost:4000
Ensure these are not committed to version control for security.

📜 Scripts
Root Project
bash
Copy code
npm run start:server     # Starts the backend server
npm run test             # Runs server-side tests (if available)
Client
bash
Copy code
npm start                # Runs the React frontend
npm run build            # Builds the client for production

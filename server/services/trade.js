import { KiteConnect } from "kiteconnect";
const apiKey = "7ejuq1f51uql1ser";
let accessToken="IZNubetLwgtFFQaDqgAWsEu5c6j8bEfB";
const kc = new KiteConnect({ api_key: apiKey });
export async function placeOrder(tradingsymbol, quantity, orderType) {
    kc.setAccessToken(accessToken);
    const orderParams = {
      exchange: "NSE",
      tradingsymbol,
      transaction_type: orderType,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    };
    return kc.placeOrder("regular", orderParams); // returns order_id or throws
  }
export async function getHoldings() {
    const holdings= await kc.getHoldings();
    let allHoldings="";
    holdings.map((holding) => {
        allHoldings+=`Stock: ${holding.tradingsymbol}, qty: ${holding.quantity}, currentPrice: ${holding.last_price}\n`;
    });
    return allHoldings;
  }
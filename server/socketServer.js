import io from "socket.io";
import { getPrices } from './models/yahooFinance';
import Rx from 'rxjs/Rx';

const registeredTickers = {};

function addTicker(ticker, socket){
  if(!registeredTickers[ticker]){
    registeredTickers[ticker] = new Set([socket])
  } else {
    registeredTickers[ticker].add(socket);
  }
}

function removeTicker(ticker, socket){
  if(registeredTickers[ticker]
){
    registeredTickers[ticker].delete(socket);
  }
}

export default function initSocketServer(server) {
  io(server).on("connection", socket => {
    socket.on("addTicker",     ticker  => addTicker(ticker, socket));
    socket.on("addTickers",    tickers => tickers.forEach(t => addTicker(t, socket)));
    socket.on("removeTicker",  ticker  => removeTicker(ticker, socket));
    socket.on("removeTickers", tickers => tickers.forEach(t => removeTicker(t, socket)));
    // todo handle disconnect
  });
}

// Fetch quotes from yahoo every 10 seconds
async function getClientPrices(){
  const symbols = Object.keys(registeredTickers);

  if (symbols.length > 0){
    const prices = await getPrices(symbols);
    prices.forEach(p => registeredTickers[p.symbol].forEach(s => s.emit("newPrice", p)));
  }
}

async function getClientPricesTest(){
  const symbols = Object.keys(registeredTickers);

  if (symbols.length > 0){

    let prices = symbols.map(s => ({
      symbol: s,
      LastTradePriceOnly: Math.random()
    }));

    prices.forEach(p => registeredTickers[p.symbol].forEach(s => s.emit("newPrice", p)));
  }
}

setInterval(getClientPricesTest, 100);

//setInterval(getClientPrices, 10000);
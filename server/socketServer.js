import io from "socket.io";
import { getPrices } from './models/yahooFinance';
import Rx from 'rxjs/Rx';

const registeredTickers = {};

function addTicker(ticker, priceSource){
  if(!registeredTickers[ticker]){
    registeredTickers[ticker] = new Set([priceSource])
  } else {
    registeredTickers[ticker].add(priceSource);
  }
}

function removeTicker(ticker, priceSource){
  if(registeredTickers[ticker]
){
    registeredTickers[ticker].delete(priceSource);
  }
}

export default function initSocketServer(server) {
  io(server).on("connection", socket => {
    const newPriceSource = new Rx.Subject();
    // Batch and send prices to client every 100ms
    newPriceSource.bufferTime(100)
                  .subscribe(prices => prices.length > 0 && socket.emit("newPrices", prices));

    socket.on("addTicker",     ticker  => addTicker(ticker, newPriceSource));
    socket.on("addTickers",    tickers => tickers.forEach(t => addTicker(t, newPriceSource)));
    socket.on("removeTicker",  ticker  => removeTicker(ticker, newPriceSource));
    socket.on("removeTickers", tickers => tickers.forEach(t => removeTicker(t, newPriceSource)));
    // todo handle disconnect
  });
}

// Fetch quotes from yahoo every 10 seconds
async function getClientPrices(){
  const symbols = Object.keys(registeredTickers);

  if (symbols.length > 0){
    const prices = await getPrices(symbols);
    prices.forEach(p => registeredTickers[p.symbol] && registeredTickers[p.symbol].forEach(s => s.next(p)));
  }
}

async function getClientPricesTest(){
  const symbols = Object.keys(registeredTickers);

  if (symbols.length > 0){

    let prices = symbols.map(s => ({
      symbol: s,
      LastTradePriceOnly: Math.random()
    }));

    prices.forEach(p => registeredTickers[p.symbol].forEach(s => s.next(p)));
  }
}

//setInterval(getClientPricesTest, 200);

setInterval(getClientPrices, 5000);
import Swagger from "swagger-client";
import io from "socket.io-client";
import Rx from 'rxjs/Rx';

// ****** RX Sources ****** //
const getPricesSource = new Rx.Subject(),
  registerTickerSource = new Rx.Subject(),
  removeTickerSource = new Rx.Subject(),
  newPriceSource = new Rx.Subject();

getPricesSource.bufferTime(100).subscribe(symbols => {
  if (symbols.length > 0){
    client.default.getPrices(
      {symbols: JSON.stringify(symbols)},
      rs => callbacks.forEach(cb => cb(rs.obj))
    );
  }
});

registerTickerSource
  .bufferTime(100)
  .subscribe(ts => ts.length > 0 && socket.emit("addTickers", ts));

removeTickerSource
  .bufferTime(100)
  .subscribe(ts => ts.length > 0 && socket.emit("removeTickers", ts));

newPriceSource
  .bufferTime(100)
  .subscribe(ps => ps.length > 0 && callbacks.forEach(cb => cb(ps)));

// ****************** //


// Swagger client
export let client;
export const init = cb => {
  client = new Swagger({
    url: '/swagger.json',
    success: cb
  });
};

export function requestPrice(symbol){
  getPricesSource.next(symbol);
}

export function getStocks(exchange){
  return new Promise((resolve, reject) => {
    client.default.getStocks({
      exchange
    }, results => {
      resolve(results.obj);
    });
  });
}

export function getHistoricalPrices(symbol, start, end){
  return new Promise((resolve, reject) => {
    client.default.getHistoricalPrices({
      symbol,
      start: start.toISOString(),
      end: end.toISOString()
    }, results => {
      resolve(results.obj);
    });
  });
}

let socket = io(), callbacks = new Set(), tickersSet = new Set();

socket.on("newPrice", price => newPriceSource.next(price));

socket.on("reconnect", () => {
  const entries = [...tickersSet];
  if(entries){
    socket.emit("addTickers", entries);
  }
});

export function registerNewPriceHandler(cb){
  callbacks.add(cb);
}

export function registerTicker(ticker){
  tickersSet.add(ticker);
  registerTickerSource.next(ticker);
}

export function removeTicker(ticker){
  tickersSet.delete(ticker);
  removeTickerSource.next(ticker);
}
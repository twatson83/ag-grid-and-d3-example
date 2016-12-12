import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from "express";
import http from "http";
import webpackConfig from './webpack.config';
import io from "socket.io";
import rawPrices from './data';

let stockList = [];
rawPrices.prices.forEach(r => {
  var row =  {
    title: r.title,
    ticker: r.ticker,
    exchange: r.exchange,
    currency: r.local_currency_symbol,
    currentPrice: null
  };
  r.columns.forEach(c => {
    row[c.field] = c.value;
  });
  stockList.push(row);
});

let app = express(),
  server = http.createServer(app),
  compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname  + '/public/index.html')
});

app.get('/stockList', (req, res) => {
  res.json(stockList);
});

server.listen("3001");

let socketServer = io(server),
  socket,
  registeredTickers = new Set();

socketServer.on("connection", s => {
  socket = s;

  socket.on("addTicker", ticker => {
    registeredTickers.add(ticker);
  });
  socket.on("removeTicker", ticker => {
    registeredTickers.delete(ticker);
  });
});

setInterval(() => {
  if(socket){
    let prices = {};
    for(let ticker of registeredTickers){
      prices[ticker] = Math.random();
    }
    socket.emit("new-prices", prices);
  }
}, 100);
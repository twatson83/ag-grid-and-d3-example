import {SELECT_TICKER,
        REQUEST_STOCKLIST, RECEIVE_STOCKLIST, RECEIVE_STOCKLIST_ERROR,
        REQUEST_HISTORICAL_PRICES, RECEIVE_HISTORICAL_PRICES, RECEIVE_HISTORICAL_PRICES_ERROR} from './actionTypes';
import { getStocks, getHistoricalPrices } from "./api";

export function selectTicker(symbol, name) {
  return { type: SELECT_TICKER, symbol, name };
}

export function requestStockList(exchange) {
  return function(dispatch){
    dispatch({ type: REQUEST_STOCKLIST, exchange });
    getStocks(exchange)
      .then(stockList => dispatch({ type: RECEIVE_STOCKLIST, stockList}))
      .catch(error => dispatch({ type: RECEIVE_STOCKLIST_ERROR, error}));
  };
}

export function requestHistoricalPrices(symbol, start, end) {
  return function(dispatch){
    dispatch({ type: REQUEST_HISTORICAL_PRICES, symbol, start, end });
    getHistoricalPrices(symbol, start, end)
      .then(prices => dispatch({ type: RECEIVE_HISTORICAL_PRICES, prices}))
      .catch(error => dispatch({ type: RECEIVE_HISTORICAL_PRICES_ERROR, error}));
  };
}

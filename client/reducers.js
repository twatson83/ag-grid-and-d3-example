import {SELECT_TICKER,
  REQUEST_STOCKLIST, RECEIVE_STOCKLIST, RECEIVE_STOCKLIST_ERROR,
  REQUEST_HISTORICAL_PRICES, RECEIVE_HISTORICAL_PRICES, RECEIVE_HISTORICAL_PRICES_ERROR} from './actionTypes';
import initialState from './initialState'

export default function appState (state = initialState, action) {
  switch (action.type) {
    case SELECT_TICKER:
      return {
        ...state,
        selectedStock: {
          name: action.name,
          symbol: action.symbol
        },
        historicalPrices: []
      };
    case REQUEST_STOCKLIST:
      return {
        ...state,
        stockList: [],
        stockListRequestStatus: "requesting"
      };
    case RECEIVE_STOCKLIST:
      return {
        ...state,
        stockList: action.stockList,
        stockListRequestStatus: "complete"
      };
    case RECEIVE_STOCKLIST_ERROR:
      return {
        ...state,
        stockList: [],
        stockListRequestError: action.error,
        stockListRequestStatus: "error"
      };
    case REQUEST_HISTORICAL_PRICES:
      return {
        ...state,
        historicalPrices: [],
        historicalPricesRequestStatus: "requesting"
      };
    case RECEIVE_HISTORICAL_PRICES:
      return {
        ...state,
        historicalPrices: action.prices,
        historicalPricesRequestStatus: "complete"
      };
    case RECEIVE_HISTORICAL_PRICES_ERROR:
      return {
        ...state,
        historicalPrices: [],
        historicalPricesError: action.error,
        historicalPricesRequestStatus: "error"
      };
    default:
      return state;
  }
}
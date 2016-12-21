import moment from 'moment';
export default {
  exchange: "NASDAQ",

  start: moment().subtract(4, "months").toISOString(),
  end: moment().toISOString(),

  selectedStock: {
    name: "American Airlines Group, Inc.",
    symbol: "AAL"
  },

  stockList: [],
  stockListRequestStatus: null,
  stockListRequestError: null,

  historicalPrices: [],
  historicalPricesRequestStatus: null,
  historicalPricesRequestError: null
}
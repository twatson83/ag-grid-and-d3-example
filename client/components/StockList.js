import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-dark.css';
import { registerNewPriceHandler, registerTicker, removeTicker, getStocks, requestPrice } from "../apis/finance";

export default class StockList extends React.Component {
  constructor(props){
    super(props);

    this._updatePrices = this._updatePrices.bind(this);
    this._onGridReady = this._onGridReady.bind(this);
    this._priceChangeRenderer = this._priceChangeRenderer.bind(this);

    registerNewPriceHandler(this._updatePrices);

    this.visibleNodes = {};

    this.state = {
      columnDefs: [
        {headerName: "Title", field: "title", pinned: true, minWidth: 400},
        {headerName: "Ticker", field: "ticker"},
        {headerName: "Exchange", field: "exchange"},
        {headerName: "Currency", field: "currency"},
        {headerName: "MarketCap", field: "MarketCap"},
        {headerName: "PE", field: "PE"},
        {headerName: "DividendYield", field: "DividendYield"},
        {headerName: "CurrentPrice", field: "CurrentPrice", cellRenderer: this._priceChangeRenderer}
      ],
      rows: []
    };

  }

  componentDidMount() {
    getStocks("LON").then(results =>
      this.setState({
        rows: results
      }));
  }

  _updatePrices(results) {
    results = results instanceof Array ? results : [results];
    results.forEach(r => {
      if (this.visibleNodes[r.symbol]){
        this.visibleNodes[r.symbol].setDataValue("CurrentPrice", r.LastTradePriceOnly);
      }
    });
  }

  render() {
    return (
      <div style={{position: "absolute", bottom: "0", top: "320px", right: "0", left: "0"}} className="ag-dark">
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rows}
          enableSorting="true"
          enableFilter="true"
          rowHeight="20"
          onGridReady={this._onGridReady}
        />
      </div>
    )
  }

  _onGridReady(gridOptions){
    gridOptions.api.sizeColumnsToFit();
  }

  _priceChangeRenderer(params){
    if (this.visibleNodes[params.data.ticker] !== params.node) {
      this.visibleNodes[params.data.ticker] = params.node;

      params.addRenderedRowListener('renderedRowRemoved', () => {
        removeTicker(params.data.ticker);
        delete this.visibleNodes[params.data.ticker];
      });

      // Register ticker server side.
      registerTicker(params.data.ticker);

      requestPrice(params.data.ticker);
    }

    return params.value === undefined ? "" : params.value;
  }
}

import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-dark.css';
import { registerNewPriceHandler, registerTicker, removeTicker, requestPrice } from "../api";

export default class StockListTable extends React.Component {
  constructor(props){
    super(props);

    this._updatePrices = this._updatePrices.bind(this);
    this._priceChangeRenderer = this._priceChangeRenderer.bind(this);
    this._nameRenderer = this._nameRenderer.bind(this);

    this.visibleNodes = [];

    this.state = {
      columnDefs: [
        {headerName: "Title", field: "title", pinned: true, minWidth: 400, cellRendererFramework: this._nameRenderer},
        {headerName: "Ticker", field: "ticker"},
        {headerName: "Exchange", field: "exchange"},
        {headerName: "Currency", field: "currency"},
        {headerName: "MarketCap", field: "MarketCap"},
        {headerName: "PE", field: "PE"},
        {headerName: "DividendYield", field: "DividendYield"},
        {headerName: "Price", field: "CurrentPrice", cellRenderer: this._priceChangeRenderer}
      ]
    };

    registerNewPriceHandler(this._updatePrices);
  }

  componentDidMount() {
    this.props.requestStockList(this.props.exchange);
  }

  shouldComponentUpdate(nextProps){
    return nextProps.exchange !== this.props.exchange ||
           nextProps.stockListRequestStatus !== this.props.stockListRequestStatus;
  }

  render() {
    return (
      <div style={{position: "absolute", bottom: "0", top: "380px", right: "0", left: "0"}} className="ag-dark">
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.props.stockList}
          enableSorting="true"
          enableFilter="true"
          rowHeight="20"
          onGridReady={o => o.api.sizeColumnsToFit()}
        />
      </div>
    )
  }

  _updatePrices(results) {
    results = results instanceof Array ? results : [results];
    results.forEach(r => {
      if (this.visibleNodes[r.symbol]){
        this.visibleNodes[r.symbol].setDataValue("CurrentPrice", r.LastTradePriceOnly);
      }
    });
  }

  // Render as raw html.  Much faster than rendering as react component.
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

    let style = "";
    if (params.value < params.data.PrevCurrentPrice){
       style = "color: red";
    } else if (params.value > params.data.PrevCurrentPrice) {
      style = "color: rgb(73,192,67)";
    }

    params.data.PrevCurrentPrice = params.value;

    return params.value === undefined || params.value === null ? "" : `<span style=\"${style}\">${params.value}</span>`;
  }

  _nameRenderer(params) {
    return <a href="#" style={{color: "#6BF"}} onClick={(e) => {
        e.preventDefault();
        this.props.selectTicker(params.data.ticker, params.data.title);
      }} >{params.value}</a>
  }
}

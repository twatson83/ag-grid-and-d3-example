import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import {client} from "./api";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-dark.css';
import io from "socket.io-client";

export default class Table extends React.Component {
  constructor(props){
    super(props);

    this._updatePrices = this._updatePrices.bind(this);
    this._onGridReady = this._onGridReady.bind(this);
    this._priceChangeRenderer = this._priceChangeRenderer.bind(this);

    this.visibleNodes = {};

    this.socket = io();
    this.socket.on("new-prices", this._updatePrices);

    this.state = {
      columnDefs: [
        {headerName: "Title", field: "title", pinned: true, minWidth: 400},
        {headerName: "Ticker", field: "ticker"},
        {headerName: "Exchange", field: "exchange"},
        {headerName: "Currency", field: "currency"},
        {headerName: "MarketCap", field: "MarketCap"},
        {headerName: "PE", field: "PE"},
        {headerName: "DividendYield", field: "DividendYield"},
        {headerName: "CurrentPrice", field: "CurrentPrice",
          cellRenderer: this._priceChangeRenderer}
      ],
      rows: []
    };
  }

  componentDidMount(){
    client.default.getStockList({}, results => {
      this.setState({
        rows: results.obj
      });
    });

  }

  _updatePrices(results){
    Object.keys(results).forEach(k => {
      if (this.visibleNodes[k]){
        this.visibleNodes[k].setDataValue("CurrentPrice", results[k]);
      }
    });
  }

  render() {
    return (
      <div style={{position: "absolute", bottom: "0", top: "0", right: "0", left: "0"}} className="ag-dark">
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
        this.socket.emit("removeTicker", params.data.ticker);
        delete this.visibleNodes[params.data.ticker];
      });

      this.socket.emit("addTicker", params.data.ticker);
    }

    return params.value === undefined ? "" : params.value;
  }
}

import React from 'react';
import Chart from "./Chart";
import Header from "./Header";
import StockList from "./StockList";
import {connect} from "react-redux";

import { selectTicker, requestStockList, requestHistoricalPrices} from "../actions";

class App extends React.PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <Header selectedStock={this.props.selectedStock} />
        <Chart
          selectedStock={this.props.selectedStock}
          start={this.props.start}
          end={this.props.end}
          historicalPrices={this.props.historicalPrices}
          historicalPricesRequestStatus={this.props.historicalPricesRequestStatus}
          requestHistoricalPrices={this.props.requestHistoricalPrices} />
        <StockList
          exchange={this.props.exchange}
          stockList={this.props.stockList}
          stockListRequestStatus={this.props.stockListRequestStatus}
          selectTicker={this.props.selectTicker}
          requestStockList={this.props.requestStockList}/>
      </div>
    )
  }
}


const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    selectTicker: (symbol, name) => dispatch(selectTicker(symbol, name)),
    requestStockList: exchange => dispatch(requestStockList(exchange)),
    requestHistoricalPrices: (symbol, start, end) => dispatch(requestHistoricalPrices(symbol, start, end)),
  }
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;




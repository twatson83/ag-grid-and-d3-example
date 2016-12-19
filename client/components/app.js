import React from 'react';
import Chart from "./Chart";
import StockList from "./StockList";

export default class Table extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <Chart />
        <StockList />
      </div>
    )
  }
}

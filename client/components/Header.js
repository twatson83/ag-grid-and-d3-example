import React from 'react';

export default class Header extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="header">
        <span className="headerTitle">
          {this.props.selectedStock.name + " (" + this.props.selectedStock.symbol + ")"}
        </span>
      </div>
    )
  }
}
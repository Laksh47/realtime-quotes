import React from "react";

class Ticker extends React.Component {
  render() {
    const { stock } = this.props;
    return (
      <div className="index">
        <div className="first-row clearfix">
          <span className="pull-left truncate name">
            <span>{stock.companyName}</span>
          </span>
          <span className="current-price pull-right">
            {stock.price} {stock.currency}
          </span>
        </div>
        <div className="second-row clearfix">
          <span className="ticker pull-left">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.google.com/search?q=" +
                encodeURIComponent(stock.companyName + " share price")
              }
            >
              {stock.exchange}: {stock.ticker}
            </a>
          </span>
          {stock.priceChange >= 0 ? (
            <span className="change bull pull-right">
              +{stock.priceChange} (+{stock.percentChange} %)
            </span>
          ) : (
            <span className="change bear pull-right">
              {stock.priceChange} ({stock.percentChange} %)
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Ticker;

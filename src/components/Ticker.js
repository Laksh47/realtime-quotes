import React from "react";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";
import { ReactComponent as SunIcon } from "../assets/sun.svg";
import { ReactComponent as MoonIcon } from "../assets/moon.svg";

import { isMarketOpen } from "../common/utils";

class Ticker extends React.Component {
  render() {
    const { stock, showDelete, onDelete } = this.props;
    return (
      <div className="index">
        <div className="first-row clearfix">
          <span className="pull-left truncate name">
            {isMarketOpen(stock.marketState) ? (
              <SunIcon className="icon-sun"></SunIcon>
            ) : (
              <MoonIcon className="icon-moon"></MoonIcon>
            )}
            <span>{stock.companyName}</span>
          </span>
          <span className="current-price pull-right">
            {showDelete && (
              <DeleteIcon
                onClick={() => onDelete(stock.ticker)}
                className="delete-btn"
              />
            )}
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
              +{stock.priceChange} (+{stock.percentChange}%)
            </span>
          ) : (
            <span className="change bear pull-right">
              {stock.priceChange} ({stock.percentChange}%)
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Ticker;

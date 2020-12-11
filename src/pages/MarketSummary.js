import React from "react";

import Ticker from "../components/Ticker";
import yahooAPI from "../adapters/yahoo";
import * as utils from "../common/utils";

import { ReactComponent as IconRefresh } from "../assets/icon_refresh.svg";
import { SemipolarLoading } from "react-loadingg";

class MarketSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, stocks: [] };
  }

  async reloadStockPrices() {
    this.setState({ isLoading: true });
    const stocks = await yahooAPI.getMarketSummary();
    this.setState({
      isLoading: false,
      stocks,
    });
  }

  async componentDidMount() {
    this.reloadStockPrices();
  }

  render() {
    let { stocks, isLoading } = this.state;
    return (
      <div className="page">
        <div className="settings clearfix">
          <div className="time">{utils.getTimestamp()}</div>
          <div
            className="reload-btn"
            onClick={this.reloadStockPrices.bind(this)}
          >
            <IconRefresh data-testid="refresh-icon" />
          </div>
        </div>

        <div className="indices">
          {isLoading ? (
            <SemipolarLoading />
          ) : (
            stocks.map((stock, index) => <Ticker stock={stock} key={index} />)
          )}
        </div>
      </div>
    );
  }
}

export default MarketSummary;

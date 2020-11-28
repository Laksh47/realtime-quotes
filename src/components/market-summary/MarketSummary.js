import React from "react";
import Ticker from "../../common/Ticker";
import { ReactComponent as IconRefresh } from "./icon_refresh.svg";
import { SemipolarLoading } from "react-loadingg";
import yahoo from "../../adapters/yahoo";
import WebTMX from "../../adapters/webtmx";

const asyncFunctions = () => {
  return [yahoo.getMarketSummary(), WebTMX.getMarketSummary()];
};

class MarketSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, stocks: [] };
  }

  async reloadStockPrices() {
    this.setState({ isLoading: true });
    const stocks = await Promise.any(asyncFunctions());
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
          <div
            className="reload-btn"
            onClick={this.reloadStockPrices.bind(this)}
          >
            <IconRefresh />
          </div>
        </div>
        {isLoading ? (
          <SemipolarLoading />
        ) : (
          <div className="indices">
            {stocks.map((stock, index) => (
              <Ticker stock={stock} key={index} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default MarketSummary;

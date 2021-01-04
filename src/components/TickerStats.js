import React from "react";
import { ReactComponent as BackBtnIcon } from "../assets/back.svg";

import { SemipolarLoading } from "react-loadingg";

import yahooAPI from "../adapters/yahoo";

class TickerStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      stats: {},
    };
  }

  async componentDidMount() {
    const { ticker } = this.props;
    this.setState({ isLoading: true });

    const stats = await yahooAPI.getStats(ticker);
    console.log(stats);

    this.setState({ isLoading: false, stats });
  }

  render() {
    let { ticker, onClose } = this.props;
    let { stats, isLoading } = this.state;

    // const data = Object.entries(stats);

    return (
      <div>
        <div className="ticker-stats-header">
          <div className="back-btn-wrapper" onClick={() => onClose()}>
            <BackBtnIcon className="back-btn"></BackBtnIcon>
            <span className="back-btn-text">{"Go Back"}</span>
          </div>
          <div className="view-more">
            <a
              href={`https://ca.finance.yahoo.com/quote/${ticker}/key-statistics`}
              target="_blank"
              rel="noreferrer"
            >
              View more
            </a>
          </div>
        </div>
        {isLoading ? (
          <SemipolarLoading />
        ) : (
          <div className="stats-data">
            <h2>Key Statistics</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>Ticker</td>
                    <td>{stats.ticker}</td>
                  </tr>
                  <tr>
                    <td>Company Name</td>
                    <td>{stats.shortName}</td>
                  </tr>
                  <tr>
                    <td>Current Price</td>
                    <td>{stats.price}</td>
                  </tr>
                  <tr>
                    <td>PB Ratio</td>
                    <td>{stats.priceToBook}</td>
                  </tr>
                  <tr>
                    <td>Trailing PE / Forward PE</td>
                    <td>
                      {stats.trailingPE} / {stats.forwardPE}
                    </td>
                  </tr>
                  <tr>
                    <td>52 Week Low / 52 Week High</td>
                    <td>
                      {stats.fiftyTwoWeekLow} / {stats.fiftyTwoWeekHigh}
                    </td>
                  </tr>
                  <tr>
                    <td>Dividend Yield</td>
                    <td>{stats.dividendYield}</td>
                  </tr>
                  <tr>
                    <td>Market Cap</td>
                    <td>{stats.marketCap}</td>
                  </tr>
                  <tr>
                    <td>Volume</td>
                    <td>{stats.volume}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TickerStats;

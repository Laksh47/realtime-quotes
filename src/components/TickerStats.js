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

    const data = Object.entries(stats);

    return (
      <div>
        <div>
          <div onClick={() => onClose()}>
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
                {data.map(([key, value], index) => {
                  return (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TickerStats;

import React from "react";
import { ReactComponent as BackBtnIcon } from "../assets/back_btn.svg";

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
    let { onClose } = this.props;
    let { stats, isLoading } = this.state;
    return (
      <div>
        <div onClick={() => onClose()}>
          <BackBtnIcon className="back-btn"></BackBtnIcon>
          <span className="back-btn-text">{"Go Back"}</span>
        </div>
        {isLoading ? <SemipolarLoading /> : <div>Hello World !</div>}
      </div>
    );
  }
}

export default TickerStats;

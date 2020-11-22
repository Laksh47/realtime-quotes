import React from "react";
import finnHub from "../../adapters/finnhub";

class Watchlist extends React.Component {
  async componentDidMount() {
    const USTickers = await finnHub.getTickers("US");
    console.log(USTickers);
    const canadaTickers = await finnHub.getTickers("TO");
    console.log(canadaTickers);
    // store and index the above lists for searching adding to watchlist
  }

  render() {
    return (
      <div className="watchlist">
        <div className="settings clearfix"></div>
        <div className="watchlist-tickers">Watchlist Tickers go here</div>
      </div>
    );
  }
}

export default Watchlist;

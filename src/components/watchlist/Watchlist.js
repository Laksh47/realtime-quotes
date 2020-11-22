import React from "react";
import finnHub from "../../adapters/finnhub";

const { log } = console;

class Watchlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeDOM: null };
    this.getDOM = this.getDOM.bind(this);
  }

  getDOM() {
    log(this.state);
  }

  async componentDidMount() {
    // store and index the above lists for searching adding to watchlist
    const USTickers = await finnHub.getTickers("US");
    console.log(USTickers);
    const canadaTickers = await finnHub.getTickers("TO");
    console.log(canadaTickers);

    // get DOM
    if (window.chrome.tabs) {
      window.chrome.tabs.executeScript(
        null,
        {
          code: `document.body.innerText`,
          allFrames: false, // set to true if we wanna extract iframes too
        },
        (results) => {
          log(results);
          this.setState({ activeDOM: results[0] });
        }
      );
    }
  }

  render() {
    return (
      <div className="watchlist">
        <div className="settings clearfix"></div>
        <div className="watchlist-tickers">Watchlist Tickers go here</div>
        <div className="watchlist-body">
          <button onClick={this.getDOM}>Abra Kadabra</button>
        </div>
      </div>
    );
  }
}

export default Watchlist;

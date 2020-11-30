import React from "react";
import yahooAPI from "../../adapters/yahoo";
import Ticker from "../../common/Ticker";

const serialize = (obj) => {
  if (obj) return JSON.stringify(obj);
  return null;
};

const deserialize = (obj) => {
  if (obj && obj !== "") return JSON.parse(obj);
  return null;
};

const storageKey = "watchlist";

class Watchlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      symbols: [],
      searchResults: [],
      stocks: [],
    };

    this.search = this.search.bind(this);
    this.addAndReload = this.addAndReload.bind(this);
    this.reloadStocks = this.reloadStocks.bind(this);
  }

  updateStorage() {
    const { symbols } = this.state;
    if (symbols && symbols.length) {
      window.localStorage.setItem(storageKey, serialize(symbols));
    }
  }

  componentWillUnmount() {
    this.updateStorage();
  }

  async componentDidMount() {
    let symbols = [],
      stocks = [];

    symbols = deserialize(window.localStorage.getItem("watchlist"));
    if (symbols && symbols.length) {
      stocks = await yahooAPI.getSummary(symbols);
      this.setState({ symbols, stocks });
    }
  }

  async reloadStocks() {
    const { symbols } = this.state;
    const stocks = await yahooAPI.getSummary(symbols);
    this.setState({ stocks });
    this.updateStorage();
  }

  async search(event) {
    const query = event.target.value;

    if (query.trim() === "") {
      this.setState({ searchResults: [] });
      return;
    }

    console.log(query);

    const queryResults = await yahooAPI.searchStocks(query);
    const symbols = queryResults.map((result) => {
      return result["symbol"];
    });
    console.log(symbols);
    this.setState({ searchResults: symbols });
  }

  async addAndReload(symbol) {
    console.log(symbol);
    let { symbols } = this.state;
    symbols.push(symbol);
    this.setState({ searchResults: [], symbols });
    this.reloadStocks();
  }

  render() {
    let { stocks, searchResults } = this.state;
    return (
      <div className="watchlist">
        <div className="settings clearfix"></div>
        <div className="watchlist-tickers">
          <div className="search">
            <input
              className="search-bar"
              placeholder="search for stocks"
              onChange={(evt) => this.search(evt)}
            ></input>
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div
                  className="search-result"
                  onClick={() => this.addAndReload(result)}
                  key={index}
                >
                  {result}
                </div>
              ))}
            </div>
            <div className="indices">
              {stocks.map((stock, index) => (
                <Ticker stock={stock} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Watchlist;

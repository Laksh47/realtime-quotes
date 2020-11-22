import React from "react";
import "./App.scss";
import Tab from "./common/Tab";
import Tabs from "./common/Tabs";
import MarketSummary from "./components/market-summary/MarketSummary";
import Watchlist from "./components/watchlist/Watchlist";

class App extends React.Component {
  render() {
    return (
      <Tabs>
        <Tab tabName={"Market Summary"}>
          <MarketSummary />
        </Tab>
        <Tab tabName={"Watchlist"}>
          <Watchlist />
        </Tab>
      </Tabs>
    );
  }
}

export default App;

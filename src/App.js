import React from "react";
import "./App.scss";
import Tab from "./components/Tab";
import Tabs from "./components/Tabs";
import MarketSummary from "./pages/MarketSummary";
import Watchlist from "./pages/Watchlist";

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

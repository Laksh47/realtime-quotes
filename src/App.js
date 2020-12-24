import React from "react";
import "./App.scss";
import Tab from "./components/Tab";
import Tabs from "./components/Tabs";
import MarketSummary from "./pages/MarketSummary";
import Watchlist from "./pages/Watchlist";

class App extends React.Component {
  constructor() {
    this.state = {
      defaultActiveTabIndex: this.getDefaultTabPreference()
    };
  }
  
  updateDefaultTabPreference = (defaultActiveTabIndex) => {
    this.setState({ defaultActiveTabIndex });
    console.log("### [TODO] persist tab settings to localStorage...");
  }
  
  getDefaultTabPreference() {
    console.log("### [TODO] fetch tab settings from localStorage...");
    return 0;
  }
  
  render() {
    return (
      <Tabs defaultActiveTabIndex={this.state.defaultActiveTabIndex} handleSetDefaultTab={this.updateDefaultTabPreference}>
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

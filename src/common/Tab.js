import React from "react";
import PropTypes from "prop-types";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event) {
    event.preventDefault();
    this.props.onClick(this.props.tabIndex);
  }

  render() {
    return (
      <div className={`tab ${this.props.isActive ? "active" : ""}`}>
        <span className="tab-link" onClick={this.handleTabClick}>
          {this.props.tabName}
        </span>
      </div>
    );
  }
}

Tab.propTypes = {
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
};

export default Tab;

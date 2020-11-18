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
      <li className="tab">
        <span
          className={`tab-link ${this.props.linkClassName} ${
            this.props.isActive ? "active" : ""
          }`}
          onClick={this.handleTabClick}
        >
          {this.props.tabName}
        </span>
      </li>
    );
  }
}

Tab.propTypes = {
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  isActive: PropTypes.bool,
};

export default Tab;

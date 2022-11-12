import React, { Component } from "react";
import "./orb.css";

class Orb extends Component {
  render() {
    return (
      <div className="OrbContainer" onClick={this.testClick}>
        <div className={this.getType()}></div>
        <div className="OrbEmpty" style={this.getValue()}></div>
      </div>
    );
  }
  getValue = () => {
    return { "--value": this.props.value };
  };
  getType = () => {
    return `OrbFull ${this.props.type}`;
  };
  testClick = () => {
    this.setState({ value: Math.random() });
  };
}

Orb.defaultProps = {
  value: 1,
  type: "Health",
};

export default Orb;

import React, { Component } from "react";
import "./actionBar.css";
import Orb from "./orb.jsx";

class ActionBar extends Component {
  state = {};
  render() {
    return (
      <div className="ActionBarFrame">
        <div className="LeftOrb">
          <Orb type="Health" value={this.props.health}></Orb>
        </div>
        <div className="RightOrb">
          <Orb type="Mana" value={this.props.mana}></Orb>
        </div>
      </div>
    );
  }
}

ActionBar.defaultProps = {
  health: 1,
  mana: 1,
};

export default ActionBar;

// TODO:  Update all css to use BEM naming convention
// https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/
import React, { Component } from "react";
import "./unitFrame.css";
import "./portraits.css";
class UnitFrame extends Component {
  state = { health: 1 };
  get_class_name = () => {
    if (this.props.unit_aggro == "true") return "UnitFrameAggro";
    else return "UnitFrame";
  };

  render() {
    return (
      <div>
        <div className={this.get_class_name()}>
          <div className="UnitName">{this.props.unit_data.name}</div>
          <div className="UnitLevel">{this.props.unit_data.level}</div>
          <div className="HealthBar" style={this.getHealth()}></div>
          <div className={this.getPortraitClassname()}></div>
        </div>
      </div>
    );
  }
  getPortraitClassname = () => {
    console.log("Test protrait stuff");
    console.log(this.props.unit_data.portrait_css);
    console.log(this.props.unit_data);
    return "portrait " + this.props.unit_data.portrait_css;
  };
  getHealth = () => {
    return { "--health": this.props.unit_data.health };
  };
}

UnitFrame.defaultProps = {
  unit_data: { health: 1, name: "unknown", level: 0 },
  unit_aggro: "false",
};

export default UnitFrame;

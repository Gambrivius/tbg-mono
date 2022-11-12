import React, { Component } from "react";
import UnitFrame from "./unitFrame.jsx";
import "./unitsPane.css";

class UnitsPane extends Component {
  state = {};
  get_aggro_state = (unit_data) => {
    console.log(unit_data);
    if (
      unit_data.target &&
      unit_data.attacking &&
      unit_data.target.player_data.name === this.props.player_data.name
    )
      return "true";
    else return "false";
  };
  render() {
    return (
      <div className="UnitsPane">
        <div className="UnitsWrapper">
          <UnitFrame
            unit_data={this.props.player_data}
            unit_aggro="false"
          ></UnitFrame>
          {this.props.player_data.target ? (
            <UnitFrame
              unit_data={this.props.player_data.target.player_data}
              unit_aggro={this.get_aggro_state(
                this.props.player_data.target.player_data
              )}
            ></UnitFrame>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

UnitsPane.defaultProps = {
  player_data: { health: 1 },
};

export default UnitsPane;

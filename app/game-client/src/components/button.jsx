import React, { Component } from "react";
import "./button.css";

class GraphicButton extends Component {
  state = {};
  render() {
    return (
      <button className={this.props.style} onClick={() => this.props.onClick()}>
        {this.props.text}
      </button>
    );
  }
}

export default GraphicButton;

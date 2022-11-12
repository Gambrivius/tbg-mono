import React, { Component } from "react";
import "./simplePopup.css";

class SimplePopup extends Component {
  state = {};
  render() {
    return (
      <div className="SimplePopup">
        <h1>{this.props.title}</h1>
        {this.props.children}
      </div>
    );
  }
}

export default SimplePopup;

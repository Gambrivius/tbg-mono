import React, { Component } from "react";
import SimplePopup from "./simplePopup.jsx";
import "./disconnected.css";

// TODO:  A css loading animation would be cool.

class Disconnected extends Component {
  state = {};
  render() {
    return (
      <div className="Disconnected">
        <SimplePopup title="Disconnected">Attempting to connect...</SimplePopup>
      </div>
    );
  }
}

export default Disconnected;

import React, { Component } from "react";
import OutputWidget from "./outputWidget.jsx";
import "./roomPane.css";

class RoomPane extends Component {
  state = {};
  render() {
    return (
      <div className="RoomPane">
        <OutputWidget scroll="auto">
          <p className="room-name">{this.props.room_data.name} </p>
          <p className="room-desc">{this.props.room_data.description}</p>
          <p className="room-exit room-exit-title">Exits:</p>
          <ul className="room-exit-list">
            {this.props.room_data.exits.length == 0 ? (
              <li className="room-exit">No visible exits.</li>
            ) : (
              this.props.room_data.exits.map((exit) => (
                <li
                  key={exit}
                  className="room-exit"
                  onClick={() => {
                    window.api.serverSend(exit);
                  }}
                >
                  {exit}
                </li>
              ))
            )}
          </ul>
          <p className="room-inhabitants room-inhabitants-title">Also here:</p>
          <ul className="room-inhabitants-list">
            {this.props.room_data.inhabitants.length == 0 ? (
              <div className="room-inhabitants-empty">Nobody is here.</div>
            ) : (
              this.props.room_data.inhabitants.map((inhabitant) => (
                <li
                  key={inhabitant}
                  className="room-inhabitant"
                  onClick={() => {
                    window.api.serverSend("target " + inhabitant);
                  }}
                >
                  {inhabitant}
                </li>
              ))
            )}
          </ul>
        </OutputWidget>
      </div>
    );
  }
}
/*
 */
export default RoomPane;

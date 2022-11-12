import React, { Component } from "react";
import ConsolePane from "./consolePane.jsx";
import TextInput from "./textInput.jsx";
import RoomPane from "./roomPane.jsx";
import handleResponse from "../logic/response.js";
import GraphicButton from "./button.jsx";
import ActionBar from "./actionBar.jsx";
import UnitsPane from "./unitsPane.jsx";
import "./gamePage.css";

class GamePage extends Component {
  state = {
    console_messages: [],
    room_data: {
      room_name: "",
      room_description: "",
      exits: [],
      inhabitants: [],
    },
    player_data: {
      health: 1,
      mana: 1,
    },
    // TODO: Add room data from response.js
  };
  constructor() {
    super();

    window.api.onUpdateGameState((data) => {
      console.log("update game state");
      console.log(data);
      this.setState(handleResponse(this.state, data));
    });
    console.log("Start over");
    window.api.requestGameState();
  }

  render() {
    return (
      <div className="GamePage">
        <div className="row">
          <div className="column left">
            <RoomPane room_data={this.state.room_data} />
          </div>
          <div className="column middle">
            <ConsolePane textContents={this.state.console_messages} />
            <TextInput
              onEnter={this.handleInput}
              autoclear="true"
              width="100%"
            />
          </div>
          <div className="column right">
            <UnitsPane player_data={this.state.player_data}></UnitsPane>
          </div>
        </div>
        <div className="HUD">
          <ActionBar
            health={this.state.player_data.health}
            mana={this.state.player_data.mana}
          ></ActionBar>
        </div>
        <div className="SystemMenu">
          <GraphicButton style="Button2" text="Exit" onClick={window.close} />
        </div>
      </div>
    );
  }
  handleInput = (msg) => {
    window.api.serverSend(msg);
  };
}

export default GamePage;

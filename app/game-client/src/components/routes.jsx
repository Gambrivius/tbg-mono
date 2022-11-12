import React, { Component } from "react";

import TitleScreen from "./titleScreen.jsx";
import GamePage from "./gamePage.jsx";

class Routes extends Component {
  state = { connection_state: "disconnected", MOTD: "" };
  constructor() {
    super();
    window.api.notifyReady();
    window.api.onUpdateMOTD((m) => {
      console.log("TEST");
      console.log(m);
      this.setState({ motd: m });
    });
    window.api.onUpdateConnectionState((conn_state) => {
      this.setState({ connection_state: conn_state });
    });
    window.api.requestConnectionState();
  }
  render() {
    return (
      <div>
        {["disconnected", "connected"].includes(this.state.connection_state) ? (
          <TitleScreen
            gameState={this.state.connection_state}
            motd={this.state.motd}
          ></TitleScreen>
        ) : (
          <GamePage />
        )}
      </div>
    );
  }
}

export default Routes;

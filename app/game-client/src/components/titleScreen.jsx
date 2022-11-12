import React, { Component } from "react";
import GraphicButton from "./button.jsx";
import Disconnected from "./disconnected.jsx";
import Login from "./login.jsx";
import Modal from "./modal.jsx";
import Themesong from "../../static/audio/sfos.mp3";
import "./titleScreen.css";

class TitleScreen extends Component {
  state = { openMOTD: false, openAbout: false };
  componentDidMount() {
    this.audio = new Audio(Themesong);
    this.audio.load();
    this.playAudio();
  }

  playAudio() {
    const audioPromise = this.audio.play();
    if (audioPromise !== undefined) {
      audioPromise
        .then((_) => {
          // autoplay started
        })
        .catch((err) => {
          // catch dom exception
          console.info(err);
        });
    }
  }

  render() {
    return (
      <div className="TitleScreen">
        <div className="Title"></div>
        <Login />

        <div className="SystemMenu">
          <GraphicButton
            style="Button1"
            text="About"
            onClick={() => this.setState({ openAbout: true })}
          />
          <GraphicButton
            style="Button1"
            text="MOTD"
            onClick={() => this.setState({ openMOTD: true })}
          />
          <GraphicButton style="Button1" text="Options" />
          <GraphicButton style="Button2" text="Exit" onClick={window.close} />
        </div>
        <Modal
          title="MOTD"
          open={this.state.openMOTD}
          onClose={() => {
            this.setState({ openMOTD: false });
          }}
        >
          <div style={{ whiteSpace: "pre-wrap" }}>{this.props.motd}</div>
        </Modal>

        <Modal
          title="About"
          open={this.state.openAbout}
          onClose={() => {
            this.setState({ openAbout: false });
          }}
        >
          <h3>DragonCraft Quest Online v0.1</h3>
          <p>
            This is an early alpha version created by Chris Laponsie. There
            isn't much too it yet, but eventually, this will be a world-class
            MMORPG that welcomes text-based MUD players from around the world.
          </p>
          <p>
            The game name is a placeholder. The project doesn't have a name yet.
          </p>
          <p>
            If you are interested in this project, please follow it on YouTube,
            Twitter, and/or Facebook. We also have a Discord channel.
          </p>
        </Modal>
      </div>
    );
  }
}

export default TitleScreen;

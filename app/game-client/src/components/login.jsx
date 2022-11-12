import React, { Component } from "react";
import TextInput from "./textInput.jsx";
import GraphicButton from "./button.jsx";
import Modal from "./modal.jsx";
import "./login.css";

class Login extends Component {
  state = { username: "", password: "", openRegister: false };
  render() {
    return (
      <div className="Login">
        <TextInput
          onChange={(value) => {
            this.setState({ username: value });
          }}
          width="300px"
        />
        <TextInput
          isPassword="true"
          width="300px"
          onChange={(value) => {
            this.setState({ password: value });
          }}
        />
        <GraphicButton
          style="Button0"
          text="Login"
          onClick={() => {
            window.api.serverAuthenticate(this.state);
          }}
        />
        <GraphicButton
          style="Button0"
          text="Register"
          onClick={() => this.setState({ openRegister: true })}
        />
        <Modal
          title="Register"
          open={this.state.openRegister}
          onClose={() => {
            this.setState({ openRegister: false });
          }}
        >
          <h3>Register Account</h3>
        </Modal>
      </div>
    );
  }
}

export default Login;

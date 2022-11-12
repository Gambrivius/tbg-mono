import React, { Component } from "react";
import "./textInput.css";
class TextInput extends Component {
  state = { input_string: "" };
  render() {
    return (
      <div className="InputBox">
        <div className="InputLeft"></div>
        <div className="InputMiddle">
          <input
            className="InputText"
            value={this.state.input_string}
            onChange={(e) => this.handleInput(e.target.value)}
            onKeyDown={this.handleKeyDown}
            type={this.props.isPassword == "true" ? "password" : ""}
          ></input>
        </div>
        <div className="InputRight"></div>
      </div>
    );
  }
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (typeof this.props.onEnter === "function") {
        this.props.onEnter(this.state.input_string);
      }
      if (this.props.autoclear == "true") {
        this.setState({
          input_string: "",
        });
      }
    }
  };
  handleInput = (input) => {
    this.setState({
      input_string: input,
    });
    if (typeof this.props.onChange === "function") {
      this.props.onChange(input);
    }
  };
}

TextInput.defaultProps = {
  onEnter: "",
  onChange: "",
  isPassword: "false",
  autoclear: "false",
};
export default TextInput;

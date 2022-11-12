import React, { Component } from "react";
import "./consolePane.css";
// props include data that is given to the Component
// react does not allow you modify the prop value beyond the input
// state include data that is private tot he component.  completely internal to component
// state is completely invisible to other components, but can get data from props

//thoe component that owns a piece of the state, should be the one modifying it.
// a "controlled component" is entirely controlled by its parent
//   doesn't have its own local states
//   gets all of its data via props
//   raises events when data needs to be changed.

// keep single source of truth on the parent

/*

        */
class ConsolePane extends Component {
  render() {
    return (
      <div className="ConsoleContainer">
        <div className="ConsoleBorder"></div>
        <div className="ConsolePane">
          {this.props.textContents.map((msg) => (
            <p key={msg.id} className={this.getLineClass(msg.style)}>
              {msg.message}
            </p>
          ))}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </div>
      </div>
    );
  }
  getLineClass = (tag) => {
    if (tag === "echo") return "ConsoleLine Echo";
    else return "ConsoleLine";
  };
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
  };
  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentDidMount() {
    this.scrollToBottom();
  }
}

export default ConsolePane;

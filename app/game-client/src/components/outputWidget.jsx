import React, { Component } from "react";
import "./outputWidget.css";

class OutputWidget extends Component {
  render() {
    return (
      <div className="OutputContainer">
        <div className="OutputBorder"></div>
        <div className={this.getClassName()}>
          {this.props.children}
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
  getClassName = () => {
    switch (this.props.scroll) {
      case "no":
        console.log("no");
        return "OutputText OutputNoScroll";
      case "auto":
        return "OutputText OutputAutoScroll";
      case "yes":
        return "OutputText OutputScrollable";
    }
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
OutputWidget.defaultProps = {
  scroll: "no",
};
export default OutputWidget;

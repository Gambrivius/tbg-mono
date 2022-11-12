import React, { Component } from "react";
import "./modal.css";

class Modal extends Component {
  render() {
    if (!this.props.open) return null;
    return (
      <div className="overlay">
        <div className="modalContainer">
          <div className="modalTitle">{this.props.title}</div>
          <div className="modalClose" onClick={this.props.onClose}></div>
          <div className="modalContent">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Modal;

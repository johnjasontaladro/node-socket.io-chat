"use strict";

const io = require("socket.io-client");
const createDOMPurify = require("dompurify");

class MyChat {
  messages = [];
  socket = null;
  field = null;
  sendButton = null;
  content = null;
  name = null;
  config = { ALLOWED_TAGS: [] };

  constructor() {
    window.addEventListener("load", (event) => {
      this.socket = io.connect("http://localhost:3700");
      this.field = document.getElementById("field");
      this.sendButton = document.getElementById("send");
      this.content = document.getElementById("content");
      this.name = document.getElementById("name");

      this.socket.on("message", (data) => {
        this.onMessage(data);
      });

      this.sendButton.addEventListener("click", () => {
        this.onClickSend();
      });

      this.field.addEventListener("keyup", (e) => {
        this.onKeyUpField(e);
      });
    });
  }

  onMessage(data) {
    if (data.message) {
      this.messages.push(data);
      let html = "";
      for (let i = 0; i < this.messages.length; i++) {
        html +=
          "<b>" +
          (this.messages[i].username
            ? createDOMPurify.sanitize(this.messages[i].username, this.config)
            : "Server") +
          ": </b>";
        html +=
          createDOMPurify.sanitize(this.messages[i].message, this.config) +
          "<br />";
      }
      this.content.innerHTML = html;
    } else {
      console.log("There is a problem:", data);
    }
  }

  onClickSend() {
    if (this.name.value === "") {
      alert("Please type your name!");
    } else {
      let text = this.field.value;
      this.socket.emit("send", { message: text, username: this.name.value });
      this.field.value = "";
    }
  }

  onKeyUpField(e) {
    if (e.keyCode === 13) {
      this.sendButton.click();
    }
  }
}

new MyChat();

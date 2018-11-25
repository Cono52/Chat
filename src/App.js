import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const initialState = {
  userName: "",
  userNameInput: "",
  currentMessages: [],
  currentMessage: "",
  onlineCurrently: [],
  typing: false,
  currentTypingUsers: [],
  response: false,
  endpoint: "http://127.0.0.1:8000"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState
    };
  }

  attachSocket() {
    this.socket = socketIOClient(this.state.endpoint);
    this.socket.on("chat message", data =>
      this.setState(prev => {
        return { currentMessages: [data, ...prev.currentMessages] };
      })
    );
    this.socket.on("reject", data => {
      console.log(data);
    });
    this.socket.on("approved", data => {
      this.setState({ userName: this.state.userNameInput });
    });
    this.socket.on("typing", data => {
      this.setState({
        currentTypingUsers: data.filter(name => name !== this.state.userName)
      });
    });
    this.socket.on("idle", data => {
      this.setState({
        currentTypingUsers: data.filter(name => name !== this.state.userName)
      });
    });
    this.socket.on("updateUsers", data => {
      this.setState({
        onlineCurrently: data.filter(name => name !== this.state.userName)
      });
    });
    this.socket.on("disconnect", reason => {
      if (reason === "transport close") {
        console.log("The server was shut down");
      }
      this.socket.close();
      this.socket = undefined;
      this.setState({ ...initialState });

      // else the socket will automatically try to reconnect
    });
  }

  joinChatroom() {
    if (!this.socket) {
      this.attachSocket();
    }
    this.socket.emit("join chatroom", this.state.userNameInput);
  }

  isTyping() {
    if (!this.state.typing) {
      this.setState({ typing: true });
      this.socket.emit("typing");
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout(() => {
      this.setState({ typing: false });
      this.socket.emit("idle");
    }, 1000);
  }

  sendMessage() {
    if (this.state.currentMessage === "") return;
    this.socket.emit("chat message", this.state.currentMessage);
    this.setState({ currentMessage: "" });
  }

  render() {
    return (
      <div className="App">
        {this.state.userName === "" ? (
          <div className="user_name_input_container">
            <form
              onSubmit={e => {
                e.preventDefault();
                this.joinChatroom();
              }}
            >
              <label htmlFor="userName">What will your username be?</label>
              <input
                name="userName"
                onChange={e => this.setState({ userNameInput: e.target.value })}
                value={this.state.userNameInput}
              />
              <button>Submit</button>
            </form>
          </div>
        ) : (
          <>
            online now:
            {this.state.onlineCurrently.map((user, i) => (
              <div key={`${user + i}`}>{user}</div>
            ))}
            <div className="convo_box">
              <div className="typing_status">
                {this.state.currentTypingUsers.map(user => (
                  <p key={`${user}Typing`}>{user} is typing...</p>
                ))}
              </div>
              <div className="message_box">
                {this.state.currentMessages.map((message, i) => (
                  <div
                    key={`${message + i}`}
                    className={`message ${
                      message.indexOf(this.state.userName) !== -1 ? "mine" : ""
                    }`}
                  >
                    {message}
                  </div>
                ))}
              </div>
              <form
                className="chat_form"
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <input
                  className="chat_input"
                  onKeyDown={e => {
                    if (e.keyCode === 13) {
                      this.sendMessage();
                    } else {
                      this.isTyping();
                    }
                  }}
                  onChange={e =>
                    this.setState({ currentMessage: e.target.value })
                  }
                  value={this.state.currentMessage}
                />
                <button
                  className="send_text_button"
                  onClick={() => this.sendMessage()}
                  type="button"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default App;

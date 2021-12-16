<template>
  <div>
    <div class="grid">
      <div class="message-area">
        <div v-if="this.messages.length === 0">
          <Message
            :from="`Hello ${this.name}!`"
            message="No messages have been sent yet..."
            :timestamp="new Date()"
            style="margin-left: 38%"
          ></Message>
        </div>
        <div v-else>
          <div
              v-for="m in messages"
              :key="(m.name+m.message)"
              style="display: flex; flex-direction: column; width: 100%; margin-top: 1em;"
          >
            <Message
                :from="m.name"
                :message="m.message"
                :timestamp="m.timestamp"
                :style="(m.name === name) ? 'margin-left: auto; order: 2' : ''"
            ></Message>
          </div>
        </div>
      </div>
      <div class="online-users">
        <h2>Online Users</h2>
        <hr>
        <ul>
          <li v-for="e in online" :key="e">&#128994;{{e}}</li>
        </ul>
      </div>
      <div class="message-bar">
        <b-input type="text" v-model="msg" placeholder="Type a nice message..." @keyup.native="checkEnter"/>
        <b-button variant="outline-success" @click="sendMessage">Send</b-button>
      </div>
    </div>

    <b-overlay no-wrap :show="!registered">
      <template #overlay>
        <div class="login">
          <h1>Hello! Please enter a name to chat.</h1>
          <b-input type="text" placeholder="FunnySoldier89" v-model="name"></b-input>

          <b-overlay :show="connecting"><b-button variant="primary" @click="connect">Connect</b-button></b-overlay>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import Message from "@/Message";

//@Todo: Get message history from server endpoint

export default {
  name: 'App',
  components: {Message},
  data: () => {
    return {
      msg: "",
      name: "",
      messages: [],
      ws: null,
      connected: false,
      registered : false,
      online: [], //contains all online users' names
      connecting: false
    }
  },
  methods: {
    sendMessage() {
      if (this.connected) {
        if (this.msg.startsWith('!')) {
          if (this.msg.startsWith('!exit')) {
            this.ws.disconnect();
            this.connected = false;
            this.msg = "";
            this.messages = [];
            this.registered = false;
            this.online = [];
          }
        } else if (this.msg) {
          this.ws.send(JSON.stringify({name: this.name, message: this.msg}));
          this.msg = "";
        }
      } else {
        alert("Not connected yet");
      }
    },
    checkEnter(event) { //@Todo (optional) add send message delay
      if (event.key === "Enter") {
        this.sendMessage();
      }
    },
    connect() {
      this.connecting = true;
      if (this.name) {
        if(this.connected) {
          this.ws.send(JSON.stringify({init: true, name: this.name}));
        } else {
          alert('Not connected to message server yet.')
          this.connecting = false;
        }
      } else {
        alert("Please input a valid name");
        this.connecting = false;
      }
    }
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:8000');

    this.ws.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      console.log(msg);
      if (msg.accept) {
        this.registered = true;
        this.connecting = false;
      } else if (msg.err) {
        alert(msg.err);
        this.connecting = false;
      } else {
        msg.timestamp = new Date(msg.timestamp);
        this.messages.push(msg)
      }
    }

    this.ws.onopen = () => {
        this.connected = true;
        fetch('http://localhost:8000/').then(res => {
          if (res.status === 200) {
            console.log(res.data);
          }
        })
    }
  }
}
</script>

<style>

.login {
  width: 100%;
}

.login > * {
  margin-top: 1em;
}

.login > button {
  float: right;
}

.grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(10, 1fr);
  height: 100vh;
}

.online-users {
  grid-row: 1 / 11;
  grid-column: 2 / 2;
}

.message-area {
  grid-column: 1 / 1;
  grid-row: 1 / 10;
  overflow-y: scroll;
  padding: 2em;
}

.message-bar {
  grid-column: 1 / 1;
  grid-row: 10 / 10;
}

.message-bar {
  padding: 2em;
}

.message-bar > input {
  width: 89%;
  display: inline-block;
}

.message-bar > button {
  float: right;
  width: 10%;
}
</style>

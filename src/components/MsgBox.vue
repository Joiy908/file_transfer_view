<template>
  <div>
    <h1>Message Box</h1>
    <span>messages:</span>
    <button @click="getMsgs()">refresh</button>
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
    <label>new message:</label><br/>
    <textarea id="msgInput" ref="msgInput" rows="4" cols="50"></textarea><br/>
    <button @click="putMsg">submit</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MsgBox",
  data() {
    return {
      messages: [],
      textarea: ''
    }
  },
  methods: {
    getMsgs() {
      axios.get('messages').then(
        res => {
          console.log('get massages ok!', res.data);
          this.messages = res.data.messages;
          console.log('@@@', this.messages);
        },
        err => {
          console.log('get massages err', err.message);
        }
      );
    },
    putMsg() {
      let inputMsg = this.$refs.msgInput.value;
      const data = {'msg': inputMsg};
      axios.post('messages', data).then(
          res => {
            console.log('post message ok!', res.data);
            this.getMsgs();
          },
          err => {
            console.log('post message err', err.message);
          }
      );
    }
  },
  mounted() {
    this.getMsgs();
  }
}
</script>
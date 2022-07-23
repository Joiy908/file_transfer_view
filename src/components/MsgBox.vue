<template>
  <div>
    <h1>Message Box</h1>
    <span>message:</span>
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
          response => {
            console.log('request successfully', response.data);
            this.messages = response.data.messages;
            console.log('@@@', this.messages);
          },
          error => {
            console.log('err', error.message);
          }
      );
    },
    putMsg() {
      let inputMsg = this.$refs.msgInput.value;
      const data = {'msg': inputMsg};
      axios.post('messages', data).then(
          response => {
            console.log('request successfully', response.data);
            this.getMsgs();
          },
          error => {
            console.log('err', error.message);
          }
      );
    }
  },
  mounted() {
    this.getMsgs();
  }
}
</script>
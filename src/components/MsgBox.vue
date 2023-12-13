<template>
  <div>
    <h1>Message Box</h1>
    <span>messages:</span>
    <ul id="messages">
      <li v-for="msg in msgs" :key="msg">
        <div v-html="msg"></div>
      </li>
    </ul>
    <label>new message: </label><br />
    <textarea id="msgInput" ref="msgInput" rows="4" cols="50"></textarea><br />
    <button @click="putMsg">submit</button>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'MsgBox',
  computed:{
      ...mapState(['msgs']),
  },
  data() {
    return {
      textarea: '',
    };
  },
  methods: {
    ...mapActions(['getMsgs']),
    async putMsg() {
      /* call putMsg, clear and foucs the msgInput, scroll to bottom of page*/
      if (await this.$store.dispatch('putMsg', this.$refs.msgInput.value)) {
        this.$refs.msgInput.value = '';
        this.$refs.msgInput.focus();
        window.scrollTo(0, document.body.scrollHeight);
      }
    },
  },
  mounted() {
    this.getMsgs();
  },
};
</script>

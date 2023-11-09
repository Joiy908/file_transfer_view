<template>
  <div>
    <h1>Message Box</h1>
    <span>messages:</span>
    <button @click="getMsgs()">refresh</button>
    <ul id="messages">
      <li v-for="msg in messages" :key="msg">
        <div v-html="msg"></div>
      </li>
    </ul>
    <label>new message: </label><br/>
    <textarea id="msgInput" ref="msgInput" rows="4" cols="50"></textarea><br/>
    <button @click="putMsg">submit</button>
  </div>
</template>

<script>
export default {
  name: "MsgBox",
  data() {
    return {
      messages: ["test message"],
      textarea: ''
    }
  },
  methods: {
    async getMsgs() {
      /**get messages and replace '\n' to '<br>' */
      const messages = await this.$store.dispatch('getMsgs');
      if (messages !== null)
        this.messages = messages.map((s) => s.replace(/\n/g, '<br>'));
    },
    async putMsg() {
      if(await this.$store.dispatch('putMsg', this.$refs.msgInput.value)){
        await this.getMsgs();
        this.$refs.msgInput.value = '';
        this.$refs.msgInput.focus();
        window.scrollTo(0, document.body.scrollHeight);
      }
    },
  },
  mounted() {
    this.getMsgs();
  }
}
</script>

<style scoped>
  #messages { list-style-type: none; margin: 0; padding: 0; }
  #messages > li { padding: 0.5rem 1rem; }
  #messages > li:nth-child(odd) { background: #efefef; }
</style>
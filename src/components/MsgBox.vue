<template>
  <div>
    <h1>Message Box</h1>
    <span>messages:</span>
    <button @click="getMsgs()">refresh</button>
    <ul>
      <li v-for="msg in messages" :key="msg">
        <button @click="copy2clipBoard(msg)">
          copy</button>&nbsp; {{ msg }}
      </li>
    </ul>
    <label>new message: </label><button @click="pasteFromClipboard()">
      paste from clipboard</button><br/>
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
      const messages = await this.$store.dispatch('getMsgs');
      if (messages !== null)
        this.messages = messages;
    },
    async putMsg() {
      if(await this.$store.dispatch('putMsg', this.$refs.msgInput.value))
        this.getMsgs();
    },
    // limitStrLen(str) {
    //   let N = 30;
    //   if (str.length > N)
    //     return str.substring(0, N) + '...(copy to see more)';
    //   else
    //     return str;
    // },
    async copy2clipBoard(str) {
      try {
        const result = await navigator.permissions.query({name: "clipboard-write"});
        if (result.state === "granted" || result.state === "prompt") {
          navigator.clipboard.writeText(str);
          console.log('text copied!');
        }
        else throw "permissions deny"
      } catch (e) {
        console.log('fail to copy @@@', e);
        alert('fail to copy @@@ '+ e);
      }
    },
    async pasteFromClipboard() {
      try{
        const text = await navigator.clipboard.readText()
        this.$refs.msgInput.value = text;
        console.log('Text pasted.');
      } catch(e) {
        console.log('Failed to read clipboard. Using execCommand instead.');
        this.$refs.msgInput.focus();
        const result = document.execCommand('paste')
        console.log('document.execCommand result: ', result);
      }
    }
  },
  mounted() {
    this.getMsgs();
  }
}
</script>
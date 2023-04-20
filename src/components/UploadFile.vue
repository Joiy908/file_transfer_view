<template>
  <div>
    <h1>Upload File</h1>
    <form ref="myForm">
      <input
        ref="file"
        type="file"
        multiple="multiple"
        @change="onChange"
      /><br />
    </form>
    <button type="button" @click="uploadAll()">Upload</button>
    <div v-for="f in uploadList" :key="f.uid">
      file name: {{ f.name }}, status: {{ f.status }}, progress:
      {{ f.percentage }}, res: {{ f.res }}
      <button @click="remove(f)">delete</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "UploadFile",
  data() {
    return {
      uploadList: [],
      tempIndex: 1,
    }
  },
  computed: {
    uploadDir() {
      return this.$store.state.pathTreeObj.currentDirName; 
    },
    uploadUrl() {
      // pass path as url parameter
      // return "upload?dirPath=./files"
      return "upload?dirPath=" + this.uploadDir;
    },
  },
  methods: {
    onChange() {
      let files = this.$refs.file.files
      for (let i = 0; i < files.length; i++) {
        this.handleStart(files[i])
        // console.log(files[i]);
      }
      this.$refs.myForm.reset()
    },
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
        status: "ready",
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
      };
      this.uploadList.push(file);
    },
    uploadAll() {
      let files = this.uploadList;
      // console.log("uploadAll is called");

      for (let i = 0; i < files.length; i++) {
        if (files[i].status == "ready") this.post(files[i])
      }
    },
    post(file) {
      this.$store.dispatch('uploadFile',
        {uploadUrl: this.uploadUrl, file});
    },
    remove(file) {
      // console.log("remove is called")
      // console.log(file.uid);
      file.signal.cancel('Request canceled by user.');
      let fileList = this.uploadList;
      fileList.splice(fileList.indexOf(file), 1)
    },
  },
}
</script>

<style scoped></style>

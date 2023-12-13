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
      /** push selected files to the uploadList, and clear the form*/
      let files = this.$refs.file.files
      for (let i = 0; i < files.length; i++) {
        this.init_and_push(files[i])
      }
      this.$refs.myForm.reset()
    },
    init_and_push(rawFile) {
      /** generate metainfo of file, then push it to uploadList
       * file status: ready, uploading, success, fail
      */
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
      /** upload all 'ready' files*/
      let files = this.uploadList;

      for (let i = 0; i < files.length; i++) {
        if (files[i].status == "ready") this.post(files[i])
      }
    },
    post(file) {
     /* Post: update file,
        constantly refresh status and upload-progress of file */
      this.$store.dispatch('uploadFile',
        {uploadUrl: this.uploadUrl, file});
    },
    remove(file) {
      if (file.status === 'uploading')
        file.signal.cancel('Request canceled by user.');
      let fileList = this.uploadList;
      fileList.splice(fileList.indexOf(file), 1)
    },
  },
}
</script>

<style scoped></style>

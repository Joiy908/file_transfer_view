<template>
  <div>
    <h1>Upload File</h1>
    <input ref="file" type="file"/><br/>
    <button type="button" @click="upload()">Upload</button>
    <br/>
    <div v-if="uploadStatus.isUploading">
      Progress:{{ uploadStatus.uploadProgress }}%<br/>
      Result: {{ uploadStatus.result }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadFile",
  props: ['uploadDir'],
  data() {
    return {
      uploadStatus: {
        isUploading: false,
        uploadProgress: 0,
        result: ''
      }
    }
  },
  computed: {
    uploadUrl() {
      // pass path as url parameter
      return 'upload?dirPath=' + this.uploadDir;
    }
  },
  methods: {
    upload() {
      // 1. prepare data
      let fileToUpload = this.$refs.file.files[0];
      if (fileToUpload === undefined) {
        alert('please select file to upload.')
        return;
      }
      const data = new FormData();
      data.append('file', fileToUpload);

      // 2. write onUploadProgress listener
      const config = {
        onUploadProgress: (progressEvent) => {
          // use arrowFuc to share the 'this' of Vue
          let totalLength = progressEvent.lengthComputable ? progressEvent.total :
              progressEvent.target.getResponseHeader('content-length') ||
              progressEvent.target.getResponseHeader('x-decompressed-content-length');
          // console.log("onUploadProgress", totalLength);
          if (totalLength !== null) {
            this.updateProgress(Math.round((progressEvent.loaded * 100) / totalLength));
          }
        }
      };

      // 3. make request
      this.uploadStatus.isUploading = true;

      axios.post(this.uploadUrl, data, config).then(
          res => { // use of arrow function
            // will make arrowFun share the same this with parentFun
            this.uploadStatus.result = res.data;
            console.log(res);
            // tell DownloadTable to refresh by change the date of pleaseRefresh in vm
            this.$emit('doRefresh');
          },
          err => {
            this.uploadStatus.result = err.data;
            console.log(err);
          });
    },
    updateProgress(progress) {
      this.uploadStatus.isUploading = true;
      this.uploadStatus.uploadProgress = progress;
    }
  }
}
</script>

<style scoped>

</style>
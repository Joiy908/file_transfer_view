<template>
  <div>
    <h1>Upload File</h1>
    <form ref="myForm">
      <input ref="file" type="file"/><br/>
    </form>
    <button type="button" @click="upload()">Upload</button>
    <br/>
    <div v-if="uploadStatus.isUploading">
      <el-progress :percentage="uploadStatus.uploadProgress" :status='uploadStatus.barStatus'></el-progress>
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
        result: '',
        barStatus: ''
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
      if (this.uploadStatus.isUploading) {
        alert('some file is uploading, please try again later.')
        return;
      }
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
            // mark progress bar status
            this.updateProgress.barStatus = "success";
          },
          err => {
            this.uploadStatus.result = err.data;
            console.log(err);
            // mark progress bar status
            this.updateProgress.barStatus = "warning";
          });
    },
    updateProgress(progress) {
      if (progress == 100) {
        if (!this.uploadStatus.isUploading) {
          return;
        }
        this.uploadStatus.isUploading =  false;
        alert("uploaded √!");
        this.$refs.myForm.reset();
        return;
      }
      this.uploadStatus.isUploading =  true;
      this.uploadStatus.uploadProgress = progress;
    }
  }
}
</script>

<style scoped>

</style>
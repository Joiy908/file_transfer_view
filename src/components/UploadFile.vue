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
import axios from "axios"

export default {
  name: "UploadFile",
  props: ["uploadDir"],
  data() {
    return {
      uploadList: [],
      tempIndex: 1,
    }
  },
  computed: {
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
      // 1. prepare data
      if (!file) {
        return
      }
      const data = new FormData()
      data.append("file", file.raw)

      // 2. write onUploadProgress listener
      const config = {
        onUploadProgress: (progressEvent) => {
          // use arrowFuc to share the 'this' of Vue
          let totalLength = progressEvent.lengthComputable
            ? progressEvent.total
            : progressEvent.target.getResponseHeader("content-length") ||
              progressEvent.target.getResponseHeader(
                "x-decompressed-content-length"
              )
          // console.log("onUploadProgress", totalLength);
          if (totalLength !== null) {
            file.percentage = Math.round(
              (progressEvent.loaded * 100) / totalLength
            )
            file.status = "uploading"
          }
        },
      }

      // 3. make request
      axios.post(this.uploadUrl, data, config).then(
      // axios
      //   .post("http://192.168.0.104:8080/upload?dirPath=./files", data, config)
      //   .then(
          (res) => {
            // use of arrow function
            // will make arrowFun share the same this with parentFun
            // console.log(res);
            file.res = res.data;
            // tell DownloadTable to refresh by change the date of pleaseRefresh in vm
            this.$emit("doRefresh");
            // mark progress bar status
            file.status = "success";
          },
          (err) => {
            console.log(err);
            // mark progress bar status
            file.status = "fail";
            file.res = err;
          }
        )
    },
    remove(file) {
      // console.log("remove is called")
      // console.log(file.uid);
      let fileList = this.uploadList;
      fileList.splice(fileList.indexOf(file), 1)
    },
  },
}
</script>

<style scoped></style>

<template>
  <div id="app">
    <!-- Part I: download file -->
    <DownloadTable v-on:changeDir="onChangeDir" :pleaseRefresh="pleaseRefresh"/>
    <!-- Part II: upload file -->
    <UploadFile :uploadDir="currDirPath" v-on:doRefresh="onDoRefresh"/>
    <!-- Part III: dynamic message box -->
    <MsgBox></MsgBox>
  </div>
</template>

<script>
import DownloadTable from "@/components/DownloadTable";
import UploadFile from "@/components/UploadFile";
import MsgBox from "@/components/MsgBox";

export default {
  name: 'App',
  components: {
    DownloadTable, UploadFile, MsgBox
  },
  data() {
    return {
      currDirPath: '',
      // use new Date() as a refresh signal pass from UploadFile to DownLoadTable
      pleaseRefresh: '',
    }
  },
  methods: {
    onChangeDir(val) {
      this.currDirPath = val;
    },
    onDoRefresh() {
      this.pleaseRefresh = new Date();
    }
  },
}
</script>
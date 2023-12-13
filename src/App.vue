<template>
  <div id="app">
    <!-- Part I: download file -->
    <DownloadTable/>
    <!-- Part II: upload file -->
    <UploadFile/>
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
}
</script>
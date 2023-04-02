<template>
  <div>
    <h1>File to download</h1>
    Current dir: {{ pathTreeObj.currentDirName }}
    <button @click="refresh()" class="u-right-margin-small">refresh</button>
    <button @click="backToParentDir()">back to parent dir</button>
    <br>
    <table>
      <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Operation</th>
      </tr>
      <template v-if="pathTreeObj.subFolderList">
        <tr v-for="dirName in pathTreeObj.subFolderList" :key="dirName">
          <td>Dir</td>
          <td>{{ dirName }}</td>
          <td @click="openDir(dirName)">
            <button>open</button>
          </td>
        </tr>
      </template>
      <tr v-for="fileName in pathTreeObj.subFileList" :key="fileName">
        <td>File</td>
        <td>{{ fileName }}</td>
        <td><a :href="getDownloadUrl(fileName)">
          <button>download</button>
        </a></td>
      </tr>
    </table>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "DownloadTable",
  data() {
    return {
      pathTreeObj: {
        currentDirName: './Test',
        subFileList: ['demo.png'],
        subFolderList: ['testDir']
      },
      ROOT_PATH: './files',
    }
  },
  props: ['pleaseRefresh'],
  watch: {
    "pathTreeObj.currentDirName": {
      handler(newValue) {
        this.$emit('changeDir', newValue);
      }
    },
    'pleaseRefresh': {
      handler() {
        // if pleaseRefresh is updated, do refresh
        this.refresh();
      }
    }
  },
  methods: {
    getPathTreeObj(path) {
      axios.post('path', {data:{'dirPath': path}})
      .then(
          res => {
            console.log('get path ok!:', res.data);
            this.pathTreeObj = res.data;
          },
          err => {
            console.log('get path err', err.message);
          }
      );
    },
    backToParentDir() {
      if (this.pathTreeObj.currentDirName === this.ROOT_PATH) {
        return;
      }
      // get parent dir path
      const pathArray = this.pathTreeObj.currentDirName.split("/");
      pathArray.pop();
      let parentPath = pathArray.join('/')
      // jump to
      this.getPathTreeObj(parentPath);
    },
    openDir(dirName) {
      let path = this.pathTreeObj.currentDirName + '/' + dirName;
      this.getPathTreeObj(path);
    },
    getDownloadUrl(fileName) {
      let filePath = this.pathTreeObj.currentDirName + '/' + fileName;
      return 'download?filePath=' + filePath;
    },
    refresh() {
      this.getPathTreeObj(this.pathTreeObj.currentDirName);
    }
  },
  mounted() {
    this.getPathTreeObj(this.ROOT_PATH);
  }
}
</script>

<style>
.u-right-margin-small {
  margin-right: 1rem;
}
</style>
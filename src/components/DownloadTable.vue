<template>
  <div>
    <h1>File to download</h1>
    Current dir: {{ pathTreeObj.currentDirName }}
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
        <button @click="deleteFile(fileName)">delete</button>
      </tr>
    </table>
  </div>

</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: "DownloadTable",
  computed:{
      ...mapState(['pathTreeObj', 'ROOT_PATH']),
  },
  methods: {
    ...mapActions(['updatePathTreeObj', 'refresh', 'deleteFile']),

    backToParentDir() {
      if (this.pathTreeObj.currentDirName === this.ROOT_PATH) {
        return;
      }
      // get parent dir path
      const pathArray = this.pathTreeObj.currentDirName.split("/");
      pathArray.pop();
      let parentPath = pathArray.join('/')
      // jump to
      this.updatePathTreeObj(parentPath);
    },

    openDir(dirName) {
      let path = this.pathTreeObj.currentDirName + '/' + dirName;
      this.updatePathTreeObj(path);
    },

    getDownloadUrl(fileName) {
      let filePath = this.pathTreeObj.currentDirName + '/' + fileName;
      return 'download?filePath=' + filePath;
    },
  },
  mounted() {
    this.updatePathTreeObj(this.ROOT_PATH);
  }
}
</script>

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

const actions = {
  getPathTreeObj(context, path) {
    axios.get('path', {
      params:{'dirPath': path}
    })
    .then(
        res => {
          console.log('get path ok!:', res.data);
          context.commit('SETPATHOBJ', res.data);
        },
        err => {
          console.log('get path err:@@@', err.response.data);
        }
    );
  },
  refresh(context) {
    context.dispatch('getPathTreeObj', context.state.pathTreeObj.currentDirName)
  },
  deleteFile(context, fileName) {
    let filePath = context.state.pathTreeObj.currentDirName + '/' + fileName;
    axios.post('delete', null, {
      params: {'filePath': filePath}
    })
    .then(
    res => {
        console.log('delete file ok! ', res.data);
        context.dispatch('refresh');
    },
    err => {
        console.log('delete file err:@@@', err.response.data);
    }
    );
  },
  uploadFile(context, {uploadUrl, file}) {
    file.signal = axios.CancelToken.source();

    // 1. prepare data
    if (!file) {
      return
    }
    const data = new FormData()
    data.append("file", file.raw)

    // 2. write onUploadProgress listener
    const config = {
      cancelToken: file.signal.token,
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
    axios.post(uploadUrl, data, config)
    .then(
      (res) => {
        // use of arrow function
        // will make arrowFun share the same this with parentFun
        console.log('upload file ok! ', res.data);
        // tell DownloadTable to refresh by change the date of pleaseRefresh in vm
        context.dispatch('refresh');
        // mark progress bar status
        file.status = "success";
      },
      (err) => {
        if (axios.isCancel(err)) {
          console.log('upload ' + file.name + ' canceled.');
        } else {
          console.log('upload file err! @@@', err.response.data);
          // mark progress bar status
          file.status = "fail";
          file.res = err;
        }
      }
    )
  },
  async getMsgs() {
    try {
      const res = await axios.get('/messages')
      console.log('get massages ok!', res.data);
      return res.data.messages;
    } catch (err) {
      console.log('get massages err', err.message);
      return null;
    }
  },
  async putMsg(context, inputMsg) {
    const data = {'msg': inputMsg};
    try {
      let res = await axios.post('/messages', data);
      console.log('post message ok! @@@', res.data);
      return true;
    } catch (err) {
      console.log('post message err @@@', err.response.data);
      return false;
    }
  },
};
const mutations = {
  SETPATHOBJ(state, pathObj) {
    state.pathTreeObj = pathObj;
  }
};
const state = {
  pathTreeObj: {
    currentDirName: './Test',
    subFileList: ['demo.png'],
    subFolderList: ['testDir']
  },
  ROOT_PATH: './files',
};


export default new Vuex.Store({ actions, mutations, state });

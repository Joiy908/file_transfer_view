import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);


const mutations = {
  SET_PATHOBJ(state, pathObj) {
    state.pathTreeObj = pathObj;
  },
  SET_MSGS(state, msgs) {
    state.msgs = msgs;
  }
};


const state = {
  pathTreeObj: {
    currentDirName: './Test',
    subFileList: ['demo.png'],
    subFolderList: ['testDir']
  },
  ROOT_PATH: './files',
  msgs: ['test message']
};


const actions = {
  updatePathTreeObj(context, path) {
  /* Post: request pathTree and call the SET_PATHOBJ mutation
   * if err: log the err
  */
    axios.get('path', {
      params:{'dirPath': path}
    })
    .then(
      res => {
        console.log('get path ok!:', res.data);
        context.commit('SET_PATHOBJ', res.data);
      },
      err => {
        console.log('get path err:@@@', err.response.data);
      }
    );
  },

  refresh(context) {
    context.dispatch('updatePathTreeObj', context.state.pathTreeObj.currentDirName)
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
      console.log(err.response)
      if (err.response.status === 403)
        alert('Permission denied.')
    }
    );
  },

  uploadFile(context, {uploadUrl, file}) {
    /**
     * Post: update file,
     * constantly refresh status and upload-progress of file 
     */
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

  async getMsgs(context) {
    try {
      const res = await axios.get('/messages')
      console.log('get massages ok!', res.data);

      /**get messages and replace '\n' to '<br>' */
      let msgs = res.data.messages;
      if (msgs !== null) {
        msgs = msgs.map((s) => s.replace(/\n/g, '<br>'));
        context.commit('SET_MSGS', msgs);
      }
    } catch (err) {
      console.log('get massages err', err.message);
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


export default new Vuex.Store({ actions, mutations, state });

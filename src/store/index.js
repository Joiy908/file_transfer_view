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

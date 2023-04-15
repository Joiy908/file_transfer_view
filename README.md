

# upload

## El-upload

> BUG: 移动端不能用 el-upload!!!。
>
> 只支持电脑端。

有多种上传方式。

参考:

> [element-ui源码分析: 清楚el-upload实现原理，帮你更好地使用和二次封装组件 - 掘金 (juejin.cn)](https://juejin.cn/post/7049297020539895838)
>
> [element-ui upload组件的http-request自定义上传文件 - 不忘初心dbsdxq - 博客园 (cnblogs.com)](https://www.cnblogs.com/mggahui/p/13728773.html)

1 默认: 传入 `action` uploadURL, 然后会自动调用 ajax 一个一个 file 发送。

缺点: 不能自定义 request.Body, 传参需要在 url 中传。

就直接 把 action 定义一下即可。原理见上面。

```java
<template>
  <div>
    <h1>El-Upload</h1>
    <el-upload
      class="upload-demo"
      action="http://localhost:8080/upload?dirPath=./files"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">hello, world</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: "EleUpoad",
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  },
}
</script>
```



2 用自定义方式上传 : axios

key: 添加`:http-request="uploadFile"`

然后调用 options 中的 3 钩子func，就能正常使用：

```js
// methods中定义的一个post方法
post(rawFile) {
    const { uid } = rawFile;
    const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
            this.onProgress(e, rawFile);
        },
        onSuccess: res => {
            this.onSuccess(res, rawFile);
            delete this.reqs[uid];
        },
        onError: err => {
            this.onError(err, rawFile);
            delete this.reqs[uid];
        }
    };
    const req = this.httpRequest(options);
    this.reqs[uid] = req;
    if (req && req.then) {
        req.then(options.onSuccess, options.onError);
    }
}

```



```vue
<template>
  <div>
    <h1>El-Upload</h1>
    <el-upload
      class="upload-demo"
      action=""
      :http-request="uploadFile"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">hello, world</div>
    </el-upload>
  </div>
</template>
<script>
import axios from "axios"
export default {
  name: "EleUpoad",
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadFile(options) {
      const data = new FormData()
      data.append("file", options.file)
      const config = {
        onUploadProgress: options.onProgress,
      }

      // 3. make request
      axios
          .post("http://localhost:8080/upload?dirPath=./files", data, config)
          .then(
          (res) => {
              console.log(res);
              options.onSuccess()
          },
          (err) => {
              console.log(err)
              options.onError()
          }
      )
    },
  },
}
</script>
```

## my-upload

nb，还是自己造的香！

```vue
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
      axios.post(this.uploadUrl, data, config)
      .then(
          (res) => {
            // use of arrow function
            // will make arrowFun share the same this with parentFun
            console.log('upload file ok! ', res.data);
            // tell DownloadTable to refresh by change the date of pleaseRefresh in vm
            this.$emit("doRefresh");
            // mark progress bar status
            file.status = "success";
          },
          (err) => {
            if (axios.isCancel(err)) {
              console.log('Request canceled:');
            } else {
              console.log('upload file err! @@@', err.response.data);
              // mark progress bar status
              file.status = "fail";
              file.res = err;
            }
          }
        )
    },
    remove(file) {
      // console.log("remove is called")
      // console.log(file.uid);
      file.signal.cancel('Request canceled by user.');
      let fileList = this.uploadList;
      fileList.splice(fileList.indexOf(file), 1)
    },
  },
}
</script>

<style scoped></style>
```



值得学习的点:

- uid 的生成: 用一个 Data.new() + count++

还是异步的！



todo: delete 之后还是 在上传。阻止一下。

2023-04-14: √，在 file 上加个 signal ，当 rm 时调用。



# API

| url       | method | query param                      | data param(json body)  | body                                                         |
| --------- | ------ | -------------------------------- | ---------------------- | ------------------------------------------------------------ |
| /         | GET    |                                  |                        |                                                              |
| /path     | GET    | `dirPath`: with prefix `./files` |                        | a json like`currentDirName: './files', subFileList: Array(8), subFolderList: Array(2)}` |
| /download | GET    | `filePath`:with prefix `./files` |                        | file                                                         |
| /delete   | POST   | `filePath`:with prefix `./files` |                        |                                                              |
| /upload   | POST   | `dirPath`: with prefix `./files` | `Formdata`: files.file |                                                              |
| /messages | GET    |                                  |                        | a json like `{'messages': list(messages)}`                   |
| /messages | POST   |                                  | `msg`, a string        |                                                              |

> /delete  不用 RESTful api，delete 不如 get/post 兼容性强，事多！


# messages

## copy and read to/from ClipBoard

```js
async copy2clipBoard(str) {
  try {
    const result = await navigator.permissions.query({name: "clipboard-write"});
    if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(str);
        console.log('text copied!');
      }
    else throw "permissions deny"
  } catch (e) {
    console.log('fail to copy @@@', e);
  }
},

async function paste() {
  try {
     const text = await navigator.clipboard.readText()
     document.querySelector('textarea').value += text;
     console.log('Text pasted.');
   } catch (error) {
     console.log('Failed to read clipboard. Using execCommand instead.');
     document.querySelector('textarea').focus();
     const result = document.execCommand('paste')
     console.log('document.execCommand result: ', result);
   }
}
```

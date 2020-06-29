<template lang="html">
  <el-dialog title="附件上传" :visible="visible" :close-on-click-modal="false" @close="close" width="440px">
    <el-row v-if="visible">
    <el-col :span="16">
      <el-card shadow="never"  style="height: 100px;width:250px;">
        <el-upload ref="upload" :action="action" :headers="headers" :data="data" :auto-upload="false" :multiple="false" :limit="2" :on-change="handleChange" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :file-list="uploadlist">
          <el-button size="mini" type="primary">选择文件</el-button>
        </el-upload>
      </el-card>
    </el-col>
    <el-col :span="8" style="text-align:center">
      <el-button :disabled="uploadlist.length == 0" @click="save" type="success" style="margin:20px">上传</el-button>
    </el-col>
  </el-row>
  </el-dialog>
</template>

<script>
import {isArrOrObj,requestCounterAdd,requestCounterMinus} from '../utils/tools.js'

var baseURL
if(window.apiDict && window.apiDict.basic) baseURL = `${apiDict['basic']}Attachment`
var instance = axios.create({
  headers: {
    'cool-token': window.token
  },
  baseURL: baseURL
})
// instance.interceptors.response.use(commonSuccess, commonError)

instance.interceptors.response.use(function (response) {
  // 在发送请求之前做些什么
  console.log(response)
  if(response){
    if(!isArrOrObj(response)){
      if(response.hasOwnProperty('data')){
        if(response.data.hasOwnProperty('state')){
        if(response.data.state == 'success'){
          if(response.data.hasOwnProperty('total')){
            return response.data;
          }else{
            return response.data.rows;
          }
        }else{
         Message({
                type: response.data.state,
                message: response.data.message,
                duration: 3000
            });
          return
        }
      }
      }
  }else{
    return response
  }
  }
}, function (error) {
  // alert(error)
    Vue.prototype.$notify.error({
              type: 'error',
              message: error,
              duration: 3000
          });
  // 对请求错误做些什么
  return Promise.reject(error);
})

const component = {
  name: 'upload',
  props: {
    visible: Boolean,
    // action: String,
    // headers: Object,
    // data: Object,
    parentId: String,
    parentType: String,
    directory: String
    // type:String
  },
  data() {
    return {
      uploadlist: [],
      action: baseURL,
      data: {},
      headers: {
        'cool-token': window.token
      }
    }
  },
  install: (Vue, options) =>
    Vue.component(
      (options ? options.prefix : '') + component.name,
      component,
    ),
  methods: {
    getNewItem() {
      instance.get('NewItem')
        .then(data => {
          this.data = Object.assign(data, {
            parentType: decodeURIComponent(this.parentType),
            parentID: decodeURIComponent(this.parentId),
            // type:decodeURIComponent(this.type),
          })
        })
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) fileList.splice(0, 1)
      this.uploadlist = fileList
    },
    handleRemove(file, fileList) {
      this.uploadlist = fileList
    },
    handleSuccess(response) {
      requestCounterMinus()
      console.log(response);
      if (response.state !== 'success') {
        this.$refs.upload.clearFiles()
        Vue.prototype.$notify.error({
          title: response.message,
          message: '详情请看控制台',
          // duration: 0,
        })
      } else {
        var attachmentId = response.rows[0].id
        this.$emit('upload-success', response.rows, attachmentId)
        this.$emit('update:visible', !this.visible)
      }
    },
    handleError(err, file, fileList) {
      requestCounterMinus()
      this.$refs.upload.clearFiles()
      Vue.prototype.$notify.error({
        title: err,
        message: '详情请看控制台',
        // duration: 0,
      })
      console.log(err);
    },
    save() {
      requestCounterAdd()
      this.$refs.upload.submit()
    },
    close() {
      this.$emit('update:visible', !this.visible)
    }
  },
  mounted() {
    console.log('==GENERATE-UPLOAD-TOOL==');
    if (this.parentType == undefined || this.parentId == undefined) {
      Vue.prototype.$alert(`未检测到有效的parentType与parentId`, `非法请求`, {
        showClose: false
      }).then(() => this.$emit('update:visible', !this.visible))
    } else this.getNewItem()
    this.data.directory = this.directory
  }
}
export default component
</script>

<style lang="css" scoped>
</style>

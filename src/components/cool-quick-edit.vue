<template>
  <el-dialog
        ref="quickEdit"
        :top.sync="top"
        :visible.sync="visible"
        :fullscreen.sync="fullscreen"
        :width="width"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :show-close="false"
        @close="closedialog"
        append-to-body
        :before-close="beforeClose"
    >
        <div slot="title">
            {{title}}
           <cool-close-button
                ref="closeButton"
                @update-collapsed="collapsedClicked"
                @update-fullscreen="maxmizeClicked"
                @back-event="backEvent"
                :btnStyle="btnStyle"
                :btnSize="btnSize"
                :closeBtnType="closeBtnType"
            />
        </div>
        <el-collapse-transition>
            <div v-show="!collapsed">
              <div  :style="borderStyle">
                <cool-form-view ref="quickFormView" :form-items="formItems" :size="size" :inline="inline" :label-width="labelWidth" :label-position="labelPosition" :label-suffix="labelSuffix" :hide-required-asterisk="hideRequiredAsterisk" :show-message="showMessage" :inline-message="inlineMessage" :status-icon="statusIcon" :validate-on-rule-change="validateOnRuleChange" :disabled="disabled" @keyup-enter="keyEnter" @tab-event="tabEvent" @update-form='updateForm'></cool-form-view>
              </div>
            </div>
        </el-collapse-transition>
        <div slot="footer">
            <transition name="el-fade-in-linear">
                <div v-show="!collapsed">  
                    <cool-save-button
                        v-if="showSaveButton"
                        ref="saveButton"
                        :backBtnIcon="backBtnIcon"
                        :saveBtnIcon="saveBtnIcon"
                        :BtnSize="BtnSize"
                        :backBtnText="backBtnText"
                        :saveBtnText="saveBtnText"
                        :backBtnType="backBtnType"
                        :saveBtnType="saveBtnType"
                        :saveBtnDisabled="saveBtnDisabled"
                        @back-event="backEvent"
                        @save-event="saveEvent"
                        @key-down-event="keyDownEvent"
                        @key-up-event="keyUpEvent"
                    />
                </div>
            </transition>
        </div>
    </el-dialog>
</template>

<script>
import saveButtonMixin from '../mixins/saveButtonMixin.js'
import coolFormMixin from '../mixins/coolFormMixin.js'
import formPropsMixin from '../mixins/formPropsMixin.js'
import closeButtonMixin from '../mixins/closeButtonMixin.js'
import Vue from 'vue'
const component = {
    name: 'quick-edit',
    mixins: [saveButtonMixin,coolFormMixin,formPropsMixin,closeButtonMixin],
    props: {
      // form
      inline: {
            type: Boolean,
            default: true,
        },
      // 
      borderStyle:{
        type:String,
        default:'border:1px solid #DCDFE6'
      },
      
      visible: Boolean,
      width: String,
      title: {
        type:String,
        default:'编辑框'
      },
      saveBtnText:{
        type:String,
        default:"确认"
      },
      top: String,
      showSaveButton: {
            type: Boolean,
            default: true,
        },
        // 
      isQuickMethods:{
        type:Object,
        default:function(){
          return {}
        }
      },
      allData:{
        type:Array,
        default:function(){
          return []
        }
      },
      currentEditData:{
        type:[Object,Array],
        default:function(){
          return {}
        }
      }
    },
    data() {
        return {
            currentIndex:0,
            lastData:false
        }
    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
    beforeUpdate(){
      // 进来弹窗 焦点在第一个可编辑的输入框
      this.currentIndex = this.allData.indexOf(this.currentEditData)
      Vue.nextTick(()=>{
           this.autoFocus()
        })
    },
    methods: {
           autoFocus(){
              let domArr = this.$refs.quickFormView.$children[0].$el.getElementsByClassName('el-input__inner')
              domArr[Array.from(domArr).findIndex(item=>{return !item.disabled})].focus()
           },
            // 当数据编辑到最后一条 弹出提示框
           comfirmEditData() {
               this.$confirm('数据已经编辑到最后一条了!', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.closeClicked()
                }).catch(() => {
                  this.currentIndex = this.allData.length - 1
                }).finally(()=>{
                  setTimeout(()=>{this.lastData = false},800)
                });
            },
         updateForm(val,arg,label){
            if(val){
              for(let i in val){
              this.allData[this.currentIndex][i] = val[i]
              }
            }
         },
         keyEnter(e) {
          if(!this.lastData) {
              this.changeEditData()
              this.$emit('quick-save-event')
            }
          },
          keyUpEvent(e){
            // 保存按钮
            if(e.code == "Enter"  && e.target.id == "JUSTSAVE" || e.code == "NumpadEnter" && e.target.id == "JUSTSAVE")this.changeEditData()
            // 返回按钮
            if(e.code == "Enter" && e.target.id == "JUSTBACK" || e.code == "NumpadEnter" && e.target.id == "JUSTBACK")this.backEvent()
          },
          changeEditData(){
            if(this.$refs.quickFormView.validateForm()){
              if(this.isQuickMethods.changeEditData){
                    this.$emit('change-edit-data',this.allData[this.currentIndex])
                }
              else{
                this.commonChange()
              }    
            }
          },
          commonChange(){
            this.currentIndex++
                if(this.currentIndex >= this.allData.length){
                  this.lastData = true
                  if(this.currentIndex == this.allData.length)this.comfirmEditData()
                }else{
                    this.$refs.quickFormView.clearForm()
                    this.$refs.quickFormView.resetForm()
                    this.formItems.form.forEach(p=>{
                      for(let i in this.allData[this.currentIndex]){
                        if(i == p.name)p.value = this.allData[this.currentIndex][i]
                        }
                    })
                    this.autoFocus()
                }
          },
          tabEvent(e){
            this.$refs.quickFormView.updateForm()
          },
        closeClicked: function() {
            this.$emit('update:visible', !this.visible) //emit for sync
        },
        closedialog() {
            this.collapsed = false
            this.fullscreen = false
            this.$emit('closedialog')
            // this.$emit('update:src', '')  //emit for sync
        },
        backEvent() {
            this.collapsed = false
            this.fullscreen = false
            this.$refs.quickFormView.clearForm()
            this.$refs.quickFormView.resetForm()
            this.closeClicked()
            this.$emit('quick-back-event')
        },
        saveEvent() {
            this.collapsed = false
            this.fullscreen = false
            this.changeEditData()
            this.$emit('quick-save-event')
        },
        beforeClose() {
            this.$emit('before-close')
        }
    }
}

export default component
</script>

<style scoped>
</style>

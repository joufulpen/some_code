<template>
    <el-dialog
        :top.sync="top"
        :visible.sync="visible"
        :fullscreen.sync="fullscreen"
        :width="width"
        :close-on-click-modal="false"
        :show-close="false"
        @close="closedialog"
        append-to-body
        :class="uniqueKey"
        :before-close="beforeClose"
    >
        <div slot="title">
            {{editDialogTitle}}
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
                <el-container :style="containerStyle" style="height:auto">
                    <el-main height="auto">
                        <slot name="coolForm"></slot>
                        <cool-form-view
                            ref="ruleForm"
                            :form-items="formItems"
                            :inline="inline"
                            :size="size"
                            :labelWidth="labelWidth"
                            :rules="rules"
                            :labelPosition="labelPosition"
                            :label-suffix="labelSuffix" 
                            :hide-required-asterisk="hideRequiredAsterisk" 
                            :show-message="showMessage" 
                            :inline-message="inlineMessage" 
                            :status-icon="statusIcon" 
                            :validate-on-rule-change="validateOnRuleChange" 
                            :disabled="disabled"
                            @update-form="updateForm"
                            @input-button-event="mixInputButtonEvent"
                            @click-events="itemClick"
                            @select="handleSelect"
                            @query-search="querySearch"
                            @keyup.enter.native="nextInputData"
                            @keyup.up.native="backUp"
                            @keyup.down.native="backDown"
                        >
                            <template #formSlot>
                                <slot name="formSlot"></slot>
                            </template>
                        </cool-form-view>
                    </el-main>
                </el-container>
            </div>
        </el-collapse-transition>
        <div slot="footer">
            <transition name="el-fade-in-linear">
                <div v-show="!collapsed">
                    <cool-save-button
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
                    />
                </div>
            </transition>
        </div>
    </el-dialog>
</template>

<script>

import closeButtonMixin from '../mixins/closeButtonMixin.js'
import coolFormMixin from '../mixins/coolFormMixin.js'
import saveButtonMixin from '../mixins/saveButtonMixin.js'
import bus from '@/utils/bus'
import { moduleAxios } from '../utils/tools.js'
const component = {
    name: 'single-dialog',
    mixins: [coolFormMixin, closeButtonMixin, saveButtonMixin],
    props: {
        uniqueKey: String,
        //dialog
        visible: Boolean,
        isMethods: {
            type: Object,
            default: function() {
                return {}
            },
        },
        containerStyle:{
            type:String,
            default:'border:1px solid #DCDFE6;padding-bottom:15px'
        }, 
        saveBtnDisabled: [Boolean, Function]
    },
    data: function() {
        return {
            //dialog
            top: '15vh',
            width: '50%',
            editDialogTitle: '',
            // cool-form
            formItems: {},
            size: 'mini',
            inline: true,
            labelWidth: '',
            rules: {},
            labelPosition: '',
            labelSuffix:'',
            hideRequiredAsterisk:false,
            showMessage:true,
            inlineMessage:false,
            statusIcon:false,
            validateOnRuleChange:true,
            disabled:false,
            // data
            formItemsData: null,
            isEditData: null,
            isEdit: null,
            tableData: [],
            currentData: null,
        }
    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
    created() {
        this.updateForm()
    },
    mounted() {
        this.takeJsonData()
    },
    watch: {
        isEditData(val) {
            if (val) {
                this.closeClicked()
            }
        },
    },
    beforeUpdate() {
        bus.$on('isNewEdit', data => {
            console.log(data)
            this.isEditData = data.isShow
            this.tableData = data.isData
            this.isEdit = false
            this.getNewItem()
        })
        bus.$on('isEditData', data => {
            this.isEditData = true
            this.isEdit = true
            if (data) {
                this.currentData = data.isCurrent
                this.tableData = data.isData
                console.log(data)
                //将选中编辑数据映射到表单
                this.formItems.form.forEach(item => {
                    for (let i in data.isCurrent) {
                        if (i == item.name) {
                            item.value = data.isCurrent[i]
                        }
                    }
                })
                console.log(this.formItems.form)
            }
        })
    },
    methods: {
        beforeClose() {
            this.$emit('before-close')
        },
        takeJsonData() {
            console.time('加载弹窗json数据的时间')
            for (let i in window.coolLocals) {
                if (i == 'index.json') {
                    for (let p in JSON.parse(window.coolLocals[i])) {
                        this[p] = JSON.parse(window.coolLocals[i])[p]
                        this.JsonCallback(p)
                    }
                }
            }
            console.timeEnd('加载弹窗json数据的时间')
        },
        JsonCallback(i) {
            if (i === 'formItems') {
                this.formItems.form.map(item => {
                    if (item.type == 'select' && item.api && item.options) {
                        moduleAxios
                            .get(window.apiDict[item.prefix] + item.api)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    if (item.customValue) {
                                        item.options = []
                                        res.map(p => {
                                            item.options.push({
                                                value: p[item.customValue[0]],
                                                label: p[item.customValue[1]],
                                            })
                                        })
                                    } else {
                                        item.options = []
                                        res.map(p => {
                                            item.options.push({
                                                value: p.name,
                                                label: p.name,
                                            })
                                        })
                                    }
                                }
                            })
                    }
                    if (item.type == 'autocomplete' && item.api && item.data) {
                        moduleAxios
                            .get(window.apiDict[item.prefix] + item.api)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    item.data = []
                                    res.map(p => {
                                        if (p.name)
                                            item.data.push({ value: p.name })
                                        else item.data.push({ value: p })
                                    })
                                }
                            })
                    }
                })
            }
        },
        // dialog
        closeClicked: function() {
            this.$emit('update:visible', !this.visible) //emit for sync
        },
        closedialog() {
            this.$emit('closedialog') //emit for sync
        },
        // cool-form
        updateForm(arg, value, label) {
            if (this.isMethods.isUpdateForm) {
                console.log(arg, value, label)
                this.$emit('update-form', arg, value, label)
            } else {
                this.formItemsData = arg
                console.log(arg, value, label)
                this.$emit('update-form', arg, value, label)
            }
        },
        querySearch(queryString, cb, labelData) {
            if (this.isMethods.isQuerySearch)
                this.$emit('query-search', queryString, cb)
            else {
                let index = this.formItems.form.findIndex(p => {
                    return p.label == labelData
                })
                var results = queryString
                    ? this.formItems.form[index].data.filter(
                          this.createFilter(queryString),
                      )
                    : this.formItems.form[index].data
                cb(results)
                this.$emit('query-search', queryString, cb)
            }
        },
        createFilter(queryString) {
            return name => {
                return (
                    name.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) !== -1
                )
            }
        },
        // button
        backEvent(arg) {
            bus.$off('isNewEdit')
            bus.$off('isEditData')
            this.currentData = null
            this.$refs.ruleForm.resetForm()
            this.formItems.form.forEach(item => {
                item.value = ''
            })
            this.isEditData = null
            this.isEdit = null
            this.$emit('update:visible', !this.visible)
            this.$emit('back-event', !this.visible)
        },
        getNewItem() {
            moduleAxios.get(this.uniqueKey + '/NewItem').then(res => {
                console.log(res)
                if (res) this.newItemData = res
            })
        },
        saveEvent(arg) {
            if (this.isMethods.isSaveEvent) this.$emit('save-event', arg)
            else {
                console.log(
                    this.currentData,
                    this.formItemsData,
                    this.newItemData,
                )
                if (this.$refs.ruleForm.validateForm()) {
                    // 判断编辑还是新建
                    this.isEdit
                        ? (this.formItemsData = Object.assign(
                              this.currentData,
                              this.formItemsData,
                          ))
                        : (this.formItemsData = Object.assign(
                              this.newItemData,
                              this.formItemsData,
                          ))
                    console.log(this.formItemsData)
                    if (this.isEdit) {
                        moduleAxios
                            .put(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
                                    let currentDataIndex = this.tableData.findIndex(
                                        item => {
                                            return item.id == res.id
                                        },
                                    )
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    console.log(currentDataIndex)
                                    this.tableData[
                                        currentDataIndex
                                    ] = Object.assign(
                                        this.tableData[currentDataIndex],
                                        res,
                                    )
                                    this.backEvent()
                                }
                                this.formItemsData = null
                            })
                    } else {
                        moduleAxios
                            .post(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (this.isEdit == false && res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    this.tableData.unshift(res)
                                    this.backEvent()
                                } else {
                                }
                                this.formItemsData = null
                            })
                    }
                }
                this.$emit('save-event', arg)
            }
        },
    },
}

export default component
</script>

<style scoped>
</style>

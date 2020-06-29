<template>
    <el-dialog
        :top.sync="top"
        :visible.sync="visible"
        :width="width"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :show-close="false"
        @close="closedialog"
        append-to-body
        :class="uniqueKey"
    >
        <div slot="title">
            {{editDialogTitle}}
            <cool-close-button
                ref="closeButton"
                @update-collapsed="collapsedClicked"
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
                        <cool-form-view
                            ref="coolForm"
                            height="auto"
                            style="overflow: hidden"
                            :form-items="formItems"
                            :inline="inline"
                            :size="size"
                            :itemWidth="itemWidth"
                            :itemStyle="itemStyle"
                            :label-width="labelWidth"
                            :rules="rules"
                            :labelPosition="labelPosition"
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
                        <slot name="coolForm"></slot>
                    </el-main>
                    <el-footer height="auto" style="border-top: 1px solid #DCDFE6">
                        <cool-form-view
                            v-if="toolsFormItems != null"
                            ref="toolsForm"
                            :form-items="toolsFormItems"
                            :inline="toolsInline"
                            :size="size"
                            :itemWidth="itemWidth"
                            :itemStyle="itemStyle"
                            :labelWidth="toolsLabelWidth"
                            :rules="rules"
                            :labelPosition="labelPosition"
                            @update-form="toolsUpdateForm"
                            @button-click="buttonsevent"
                        >
                            <template #formSlot>
                                <slot name="footerFormSlot"></slot>
                            </template>
                        </cool-form-view>
                        <slot name="tableHeader"></slot>
                        <cool-table-view
                            v-if="editTableData"
                            ref="table"
                            :showSummary="editTableData.showSummary"
                            :tableClass="editTableData.tableClass"
                            :tableStyle="editTableData.tableStyle"
                            :vLoading="editTableData.vLoading"
                            :stripe="editTableData.stripe"
                            :size="editTableData.size"
                            :width="editTableData.width"
                            :height="editTableData.height"
                            :maxHeight="editTableData.maxHeight"
                            :fit="editTableData.fit"
                            :rowKey="editTableData.rowKey"
                            :border="editTableData.border"
                            :data="editTableData.data"
                            :columns="editTableData.columns"
                            :context="editTableData.context"
                            :showHeader="editTableData.showHeader"
                            :sumText="editTableData.sumText"
                            :summaryMethod="editTableData.summaryMethod"
                            :rowClassName="editTableData.rowClassName"
                            :rowStyle="editTableData.rowStyle"
                            :cellClassName="editTableData.cellClassName"
                            :cellStyle="editTableData.cellStyle"
                            :headerRowClassName="editTableData.headerRowClassName"
                            :headerRowStyle="editTableData.headerRowStyle"
                            :headerCellClassName="editTableData.headerCellClassName"
                            :headerCellStyle="editTableData.headerCellStyle"
                            :highlightCurrentRow="editTableData.highlightCurrentRow"
                            :currentRowKey="editTableData.currentRowKey"
                            :emptyText="editTableData.emptyText"
                            :expandRowKeys="editTableData.expandRowKeys"
                            :defaultExpandAll="editTableData.defaultExpandAll"
                            :defaultSort="editTableData.defaultSort"
                            :tooltipEffect="editTableData.tooltipEffect"
                            :spanMethod="editTableData.spanMethod"
                            @table-row-click="tableRowClick"
                            @table-select="tableSelect"
                            @table-select-all="tableSelectAll"
                            @table-selection-change="tableSelectionChange"
                            @table-cell-click="tableCellClick"
                            @table-row-dblclick="tableRowDblclick"
                            @table-header-click="tableHeaderClick"
                            @table-sort-change="tableSortChange"
                            @table-current-change="tableCurrentChange"
                        >
                            <template #columns>
                                <slot name="columns"></slot>
                            </template>
                        </cool-table-view>
                    </el-footer>
                </el-container>
            </div>
        </el-collapse-transition>
        <div slot="footer">
            <transition name="el-fade-in-linear">
                <div v-show="!collapsed">
                    <cool-save-button
                        :backBtnIcon="backBtnIcon"
                        :saveBtnIcon="saveBtnIcon"
                        :BtnSize="BtnSize"
                        :backBtnText="backBtnText"
                        :saveBtnText="saveBtnText"
                        :backBtnType="backBtnType"
                        :saveBtnType="saveBtnType"
                        @back-event="backEvent"
                        @save-event="saveEvent"
                    />
                </div>
            </transition>
        </div>
    </el-dialog>
</template>

<script>
// import coolForm from './commonComponents/cool-form.vue'
// import coolTable from './commonComponents/cool-table.vue'
// import closeButton from './commonComponents/close-button.vue'
// import saveButton from './commonComponents/save-button.vue'
// import axios from 'axios'
import dayjs from 'dayjs'
import coolPageTableMixin from '../mixins/coolPageTableMixin.js'
import coolFormMixin from '../mixins/coolFormMixin.js'
import closeButtonMixin from '../mixins/closeButtonMixin.js'
import saveButtonMixin from '../mixins/saveButtonMixin.js'
import { moduleAxios } from '../utils/tools.js'
import bus from '@/utils/bus'
const component = {
    name: 'master-dialog',
    mixins: [
        coolPageTableMixin,
        coolFormMixin,
        closeButtonMixin,
        saveButtonMixin,
    ],
    // components:{
    //     coolForm,
    //     coolTable,
    //     closeButton,
    //     saveButton
    // },
    props: {
        uniqueKey: String,
        // //dialog
        visible: Boolean,
        isMethods: {
            type: Object,
            default: function() {
                return {}
            },
        },
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
            toolsInline: true,
            itemWidth: '',
            itemStyle: {},
            labelWidth: '',
            rules: {},
            labelPosition: '',
            // tabs
            tabsType: 'card',
            editTabsData: [],
            // footer dltTable
            toolsFormItems: null,
            toolsLabelWidth: '',
            editTableData: {},

            // container style
            containerStyle: 'border:1px solid #DCDFE6',
            //
            formItemsData: null,
            toolsFormItemsData: null,
            isEditData: null,
            isEdit: null,
            tableData: [],
            currentData: null,
            newHdrItemData: null,
            newDtlItemData: null,
            rowClickData: null,
            isDisable: null,
            rowDbCilckData: null,
            isEditDltData: undefined,
            alreadyDelData: [],
            allData: [],
        }
    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
    created() {},
    mounted() {
        // setAxios()
        // console.log(this.uniqueKey)
        // this.getNewItem()
        this.takeJsonData2()
    },
    watch: {
        isEditData(val) {
            if (val) {
                this.closeClicked()
            }
        },
        isDisable(val) {
            this.buttonMapEvent('提交', val)
        },
        rowDbCilckData(arg) {
            let value = arg == null
            this.buttonMapEvent('取消', value)
        },
        rowClickData(arg) {
            let value = arg == null
            this.buttonMapEvent('删除', value)
        },
    },
    beforeUpdate() {
        console.log(this.formItems)
        bus.$on('isNewEdit', data => {
            console.log(data)
            if (data) {
                this.isEditData = data.isShow
                this.tableData = data.isData
                this.isEdit = false
                // this.getNewItem()
                this.getHdrNewItem()
                this.getDtlNewItem()
            }
        })
        bus.$on('isEditData', data => {
            this.isEditData = true
            this.isEdit = true
            if (data) {
                this.currentData = data.isCurrent
                this.tableData = data.isData
                console.log(data)
                let param = this.currentData
                moduleAxios
                    .get(this.uniqueKey + '/GetBill', {
                        params: param,
                    })
                    .then(res => {
                        console.log(res)
                        if (res) {
                            this.editTableData.data = []
                            res.dtls.map(item => {
                                this.editTableData.data.push(item)
                            })
                        } else {
                        }
                    })
                //将选中编辑数据映射到表单
                this.formItems.form.forEach(item => {
                    for (let i in this.currentData) {
                        if (i == item.name) {
                            item.value = this.currentData[i]
                        }
                    }
                })
                console.log(this.formItems.form)
                this.getDtlNewItem()
            }
        })
    },
    methods: {
        takeJsonData2() {
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
        takeJsonData() {
            let instance = axios.create({
                baseURL: '',
            })
            let url
            if (this.uniqueKey.lastIndexOf('/') !== -1)
                url =
                    './' +
                    this.uniqueKey.slice(this.uniqueKey.lastIndexOf('/') + 1) +
                    '.json'
            else url = './' + this.uniqueKey + '.json'

            instance
                .get(url)
                .then(res => {
                    // console.log(res)
                    for (let i in res.data) {
                        this[i] = res.data[i]
                        this.JsonCallback(i)
                    }
                })
                .catch(e => {
                    this.$message.error(e)
                })
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
                                    item.options = []
                                    res.map(p => {
                                        item.options.push({
                                            value: p.name,
                                            label: p.name,
                                        })
                                    })
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
                                        item.data.push({ value: p.name })
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
        updateForm(arg) {
            if (this.isMethods.isUpdateForm) {
                this.$emit('update-form', arg)
            } else {
                this.formItemsData = arg
                this.$emit('update-form', arg)
            }
        },
        toolsUpdateForm(arg) {
            if (this.isMethods.isToolsUpdateForm)
                this.$emit('tools-update-form', arg)
            else {
                for (let i in arg) {
                    if (i === 'undefined') {
                        delete arg[i]
                    } else {
                        this.toolsFormItems.form.map(item => {
                            if (item.name == i) {
                                item.value = arg[i]
                            }
                        })
                    }
                }
                if (this.toolsFormItems.hasOwnProperty('form'))
                    this.ctrlDisable()
                console.log(this.toolsFormItems, this.isDisable)
                this.$emit('tools-update-form', arg)
            }
        },
        ctrlDisable() {
            this.isDisable = this.toolsFormItems.form.some(item => {
                if (item.type != 'button') {
                    // console.log(item)
                    if (item.value === '') {
                        return item.value === ''
                    }
                    if (item.value === undefined) {
                        return item.value === undefined
                    }
                }
            })
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
        backEvent() {
            bus.$off('isNewEdit')
            bus.$off('isEditData')
            this.currentData = null
            if (this.toolsFormItems != null) {
                this.$refs.toolsForm.resetForm()
                this.toolsFormItems.form.forEach(item => {
                    item.value = ''
                })
            }
            this.$refs.coolForm.resetForm()
            this.formItems.form.forEach(item => {
                item.value = ''
            })
            this.editTableData.data = []
            this.isEditData = null
            this.isEdit = null
            this.$emit('update:visible', !this.visible)
            this.$emit('back-event', !this.visible)
        },
        getHdrNewItem() {
            moduleAxios.get(this.uniqueKey + '/NewHdr').then(res => {
                console.log(res)
                if (res) this.newHdrItemData = res
            })
        },
        getDtlNewItem() {
            moduleAxios.get(this.uniqueKey + '/NewDtl').then(res => {
                console.log(res)
                if (res) this.newDtlItemData = res
            })
        },
        saveEvent() {
            if (this.isMethods.isSaveEvent) this.$emit('save-event')
            else {
                if (this.$refs.coolForm.validateForm()) {
                    if (this.editTableData.data.length) {
                        // 判断编辑还是新建
                        console.log(
                            this.isEdit,
                            this.formItemsData,
                            this.currentData,
                            this.newHdrItemData,
                        )
                        this.isEdit
                            ? (this.formItemsData = Object.assign(
                                  this.currentData,
                                  this.formItemsData,
                              ))
                            : (this.formItemsData = Object.assign(
                                  this.newHdrItemData,
                                  this.formItemsData,
                              ))
                        if (this.formItemsData.hasOwnProperty('billDateTime'))
                            this.formItemsData.billDateTime = dayjs(
                                this.formItemsData.billDateTime,
                            ).format('YYYY-MM-DD HH:mm')
                        if (this.isEdit) this.formItemsData.RecStatus = 1 //该处仅为测试
                        console.log(this.formItemsData)
                        let param
                        this.allData = this.editTableData.data.concat(
                            this.alreadyDelData,
                        )
                        this.isEdit
                            ? (param = {
                                  hdr: this.formItemsData,
                                  dtls: this.allData,
                              })
                            : (param = {
                                  hdr: this.formItemsData,
                                  dtls: this.editTableData.data,
                              })
                        console.log(param)
                        moduleAxios
                            .post(this.uniqueKey + '/SaveBill', param)
                            .then(res => {
                                console.log(res)
                                if (this.isEdit && res) {
                                    // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
                                    let currentDataIndex = this.tableData.findIndex(
                                        item => {
                                            return item.guid == res.hdr.guid
                                        },
                                    )
                                    console.log(
                                        currentDataIndex,
                                        this.tableData,
                                    )
                                    this.tableData[
                                        currentDataIndex
                                    ] = Object.assign(
                                        this.tableData[currentDataIndex],
                                        res.hdr,
                                    )
                                    this.formItemsData = null
                                    this.backEvent()
                                } else if (this.isEdit == false && res) {
                                    console.log(567)
                                    // 新建 直接push进去表格数据中 感觉新建完的数据应该在第一条
                                    this.tableData.unshift(res)
                                    this.formItemsData = null
                                    this.backEvent()
                                }
                            })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '必须输入单据明细',
                            duration: 1500,
                        })
                    }
                }
            }
        },
        buttonMapEvent(text, value) {
            if (this.toolsFormItems != null) {
                this.toolsFormItems.form.map(item => {
                    if (item.type == 'button') {
                        item.buttons.map(p => {
                            if (p.text == text) {
                                p.disabled = value
                            }
                        })
                    }
                })
            }
        },
        commonSubmit(callback) {
            let isExisted
            if (this.isEdit) {
                this.allData = this.editTableData.data.concat(
                    this.alreadyDelData,
                )
                isExisted = this.allData.every(item => {
                    return item.code !== this.toolsFormItems.form[0].value
                })
            } else {
                isExisted = this.editTableData.data.every(item => {
                    return item.code !== this.toolsFormItems.form[0].value
                })
            }
            console.log(isExisted)
            if (isExisted) {
                let param = {
                    id: this.toolsFormItems.form[0].value,
                }
                // http://198.168.1.98:8096/api/GoodsInfo/Get
                moduleAxios
                    .get('GoodsInfo/Get', { params: param })
                    .then(res => {
                        console.log(res)
                        if (res) {
                            callback(res)
                        }
                    })
            } else {
                if (this.isEdit) {
                    this.$message.warning(
                        '明细中或删除数据中已有相同编号产品！',
                    )
                } else {
                    this.$message.warning('明细中已有相同编号产品！')
                }
            }
        },
        submitEventCallback(res) {
            // console.log(res)
            let newObj = JSON.parse(JSON.stringify(this.newDtlItemData))
            newObj.codeName = res.name
            newObj.code = res.code
            this.toolsFormItems.form.map(item => {
                for (let i in newObj) {
                    if (i == item.name) {
                        if (item.name == 'qty')
                            item.value = item.value.toFixed(2)
                        if (item.name == 'price')
                            item.value = item.value.toFixed(4)
                        newObj[i] = item.value
                        if (i == 'code') newObj[i] = res.code
                    }
                }
            })
            this.editTableData.data.push(newObj)
            this.clearStatus()
        },
        commonMapDltEvent() {
            this.toolsFormItems.form.map(item => {
                for (let i in this.rowDbCilckData) {
                    if (item.name == i) {
                        if (item.name == 'qty')
                            item.value = item.value.toFixed(2)
                        if (item.name == 'price')
                            item.value = item.value.toFixed(4)
                        this.rowDbCilckData[i] = item.value
                    }
                }
            })
            if (this.isEdit) {
                this.rowDbCilckData.recStatus = 1
            }
            this.clearStatus()
        },
        submitEditDltCallback(res) {
            this.rowDbCilckData.codeName = res.name
            this.commonMapDltEvent()
        },
        submitEditDltData() {
            if (this.rowDbCilckData.code == this.toolsFormItems.form[0].value) {
                this.commonMapDltEvent()
            } else {
                this.commonSubmit(this.submitEditDltCallback)
            }
        },
        tableRowClick(arg) {
            console.log(arg)
            if (this.isMethods.isTableRowClick)
                this.$emit('table-row-click', arg)
            else {
                this.rowClickData = arg
                this.$emit('table-row-click', arg)
            }
        },
        tableRowDblclick(arg) {
            console.log(arg)
            if (this.isMethods.isTableRowDblclick)
                this.$emit('table-row-dblclick', arg)
            else {
                this.rowDbCilckData = arg
                this.toolsFormItems.form.map(item => {
                    for (let i in arg) {
                        if (item.name == i) {
                            item.value = arg[i]
                        }
                    }
                })
                this.ctrlDisable()
                this.isEditDltData = true
                this.$emit('table-row-dblclick', arg)
            }
        },
        clearStatus() {
            this.toolsFormItems.form.forEach(item => {
                item.value = ''
            })
            this.ctrlDisable()
            this.$refs.table.clearCurrentRow()
            this.rowDbCilckData = null
            this.rowClickData = null
            this.isEditDltData = false
        },
        // 提交
        submit() {
            if (this.isEditDltData) {
                // console.log(1)
                this.submitEditDltData()
            } else {
                // console.log(2)
                this.commonSubmit(this.submitEventCallback)
            }
        },
        //取消
        cancel() {
            this.clearStatus()
        },
        // 删除
        delete() {
            if (this.isEdit) {
                this.rowClickData.recStatus = 2
                this.rowClickData.deleted = true
                this.alreadyDelData.push(this.rowClickData)
                this.editTableData.data.splice(
                    this.editTableData.data.indexOf(this.rowClickData),
                    1,
                )
                this.allData = this.editTableData.data.concat(
                    this.alreadyDelData,
                )
                this.clearStatus()
                console.log(this.alreadyDelData, this.allData)
            } else {
                this.editTableData.data.splice(
                    this.editTableData.data.indexOf(this.rowClickData),
                    1,
                )
                this.clearStatus()
            }
        },
        buttonsevent(arg) {
            let action = arg.data.$vnode.data.key
            console.log(action)
            if (typeof this[action] == 'function') this[action].call(this, arg)
            else this.$emit(action, arg)
        },
    },
}

export default component
</script>

<style scoped>
</style>
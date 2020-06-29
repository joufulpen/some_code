<template>
    <el-container>
        <slot name="firstSlot" />
        <el-header height="auto" v-if="buttons">
            <cool-button-group ref="buttonsGroup" :buttons="buttons" @button-click="buttonsevent">
                <template #buttonSlot>
                    <slot name="buttonSlot" />
                </template>
            </cool-button-group>
            <slot name="headerSlot" />
        </el-header>
        <el-main>
            <el-container>
                <cool-query
                    :isMethods="isMethods"
                    :asideWidth="asideWidth"
                    ref="query"
                    v-if="Object.keys(queryCondition).length != 0"
                    :origin-condition="queryCondition"
                    @get-condition="getCondition"
                    @remote-method="remoteMethod"
                >
                    <template #querySlot>
                        <slot name="querySlot"></slot>
                    </template>
                </cool-query>
                <cool-master-slave-table
                    ref="table"
                    :showDtlTable="showDtlTable"
                    :dltTableHeight="dltTableHeight"
                    :hdrTableData="hdrTableData"
                    :dtlTableData="dtlTableData"
                     @table-row-click="tableRowClick"
                     @table-row-contextmenu="tableRowContextmenu" 
                     @table-select="tableSelect" 
                     @table-select-all="tableSelectAll" 
                     @table-cell-mouse-enter="tableCellMouseEnter" 
                     @table-cell-mouse-leave="tableCellMouseLeave" 
                     @table-selection-change="tableSelectionChange" 
                     @table-cell-click="tableCellClick" 
                     @table-cell-dblclick="tableCellDblclick"  
                     @table-row-dblclick="tableRowDblclick" 
                     @table-header-click="tableHeaderClick" 
                     @table-header-contextmenu="tableHeaderContextmenu" 
                     @table-header-dragend="tableHeaderDragend" 
                     @table-sort-change="tableSortChange" 
                     @table-current-change="tableCurrentChange" 
                     @table-expand-change="tableExpandChange" 
                     @table-filter-change="tableFilterChange"
                     @pagination-size-change="paginationSizeChange"
                     @pagination-current-change="paginationCurrentChange"
                     @pagination-prev-click="paginationPrevClick" 
                     @pagination-next-click="paginationNextClick"
                     @dtl-table-row-click="dtlTableRowClick"
                     @dtl-table-row-contextmenu="dtlTableRowContextmenu" 
                     @dtl-table-select="dtlTableSelect" 
                     @dtl-table-select-all="dtlTableSelectAll" 
                     @dtl-table-cell-mouse-enter="dtlTableCellMouseEnter" 
                     @dtl-table-cell-mouse-leave="dtlTableCellMouseLeave" 
                     @dtl-table-selection-change="dtlTableSelectionChange" 
                     @dtl-table-cell-click="dtlTableCellClick" 
                     @dtl-table-cell-dblclick="dtlTableCellDblclick"  
                     @dtl-table-row-dblclick="dtlTableRowDblclick" 
                     @dtl-table-header-click="dtlTableHeaderClick" 
                     @dtl-table-header-contextmenu="dtlTableHeaderContextmenu" 
                     @dtl-table-header-dragend="dtlTableHeaderDragend" 
                     @dtl-table-sort-change="dtlTableSortChange" 
                     @dtl-table-current-change="dtlTableCurrentChange" 
                     @dtl-table-expand-change="dtlTableExpandChange" 
                     @dtl-table-filter-change="dtlTableFilterChange"
                     @dtl-button-click="dtlTabButtonEvent"
                     @tab-click="tabClick"
                >
                    <template #pageTableColumns>
                        <slot name="pageTableColumns"></slot>
                    </template>

                    <template slot="footerTableSlot">
                        <slot name="footerTableSlot"></slot>
                    </template>
                    <template slot="footerTableDiyContentSlot">
                        <slot name="footerTableDiyContentSlot"></slot>
                    </template>
                </cool-master-slave-table>
            </el-container>
        </el-main>
        <cool-multi-dialog
            ref="multiDialog"
            v-if="dialogs.length"
            :dialogs="dialogs"
            @back-event="backEvent"
            @save-event="saveEvent"
            :before-close="beforeClose"
            @closedialog="closedialog"
        />
    </el-container>
</template>
<script>
import { isArrOrObj, settingAxios, moduleAxios } from '../utils/tools.js'
import bus from '@/utils/bus'
import dayjs from 'dayjs'
import coolPageTableMixin from '../mixins/coolPageTableMixin.js'
import coolMasterSlaveTableMixin from '../mixins/coolMasterSlaveTableMixin.js'
import coolMultiDialogMixin from '../mixins/coolMultiDialogMixin.js'
const component = {
    name: 'master-view',
    mixins: [coolPageTableMixin,coolMasterSlaveTableMixin,coolMultiDialogMixin],
    props: {
        isMethods: {
            type: Object,
            default: function() {
                return {}
            },
        },
        asideWidth: {
            type: String,
            default: '235px',
        },
        showDtlTable: {
            type: Boolean,
            default: true,
        },
        uniqueDeployKey: Object,
        axiosSetting: Object,
        dltTableHeight: String,
        theRestParams: {
            type: Object,
            default: function() {
                return {}
            },
        },
        // 弹窗数据
        dialogs: {
            type: Array,
            default: function() {
                return []
            },
        },
    },
    data: function() {
        return {
            isNewEdit: true,
            isCurrentData: {}, //当前选中的数据
            buttons: [],
            // 查询条件组件
            queryCondition: {},
            // table主表的数据
            hdrTableData: {},
            //table从表的数据
            dtlTableData: [],
            // 查询参数
            condition: [],
            //
            modeList: {},
        }
    },
    created() {
        settingAxios(this.axiosSetting)
        this.takeJsonData()
    },
    mounted() {

    },
    methods: {
        dateFormatter(arg, columns) {
            if (arg[columns.property]) {
                return dayjs(arg[columns.property]).format('YYYY-MM-DD')
            }
        },
        takeJsonData() {
            console.time('加载window的json文件时间')
            for (let i in window.coolLocals) {
                if (i != 'index.json') {
                    for (let p in JSON.parse(window.coolLocals[i])) {
                        this[p] = JSON.parse(window.coolLocals[i])[p]
                        if (p == 'hdrTableData') {
                            this.hdrTableData.columns.map(item => {
                                if (item.dateFormatter)
                                    item = Object.assign(item, {
                                        formatter: this.dateFormatter,
                                    })
                                if (
                                    item.hasOwnProperty('formatterName') &&
                                    window.formatterMethods
                                )
                                    item = Object.assign(item, {
                                        formatter:
                                            window.formatterMethods[
                                                item.formatterName
                                            ],
                                    })
                                if (
                                    item.showSelectable &&
                                    item.type == 'selection'
                                ) {
                                    item = Object.assign(item, {
                                        selectable: function(arg, columns) {
                                            if (
                                                arg[item.justifyProp] ==
                                                item.justifyText
                                            ) {
                                                return false
                                            } else return true
                                        },
                                    })
                                }
                            })
                        }
                        if (p == 'dtlTableData') {
                            this.dtlTableData.map(p => {
                                p.columns.map(item => {
                                    if (item.dateFormatter)
                                        item = Object.assign(item, {
                                            formatter: this.dateFormatter,
                                        })
                                    if (
                                        item.hasOwnProperty('formatterName') &&
                                        window.formatterMethods
                                    )
                                        item = Object.assign(item, {
                                            formatter:
                                                window.formatterMethods[
                                                    item.formatterName
                                                ],
                                        })
                                    if (
                                        item.showSelectable &&
                                        item.type == 'selection'
                                    ) {
                                        item = Object.assign(item, {
                                            selectable: function(arg, columns) {
                                                if (
                                                    arg[item.justifyProp] ==
                                                    item.justifyText
                                                ) {
                                                    return false
                                                } else return true
                                            },
                                        })
                                    }
                                })
                            })
                        }
                    }
                }
            }
            this.JsonCallback()
            console.timeEnd('加载window的json文件时间')
        },
        JsonCallback() {
            console.time('加载queryCondition数据的时间')
            if (Object.keys(this.queryCondition).length != 0) {
                for (let p in this.queryCondition) {
                    this.QueryCallback(p)
                    this.QueryApiCallback(p)
                }
            }
            console.timeEnd('加载queryCondition数据的时间')
        },
        QueryCallback(p) {
            for (let k in this.queryCondition[p]) {
                if (
                    k === 'form' &&
                    this.queryCondition[p][k] === 'autocomplete'
                ) {
                    console.log(this.queryCondition[p][k])
                    moduleAxios
                        .get(
                            window.apiDict[this.queryCondition[p].prefix] +
                                this.queryCondition[p].api,
                        )
                        .then(res => {
                            console.log(res)
                            if (res) {
                                this.queryCondition[p].data = []
                                res.map(item => {
                                    this.queryCondition[p].data.push({
                                        value: item,
                                    })
                                })
                                console.log(this.queryCondition[p].data)
                            }
                        })
                }
                if (
                    k === 'dataType' &&
                    Object.keys(this.modeList).length != 0
                ) {
                    let key = this.queryCondition[p][k]
                    this.queryCondition[p].modeList = JSON.parse(
                        JSON.stringify(this.modeList[key]),
                    )
                }
                if (k === 'form' && this.queryCondition[p][k] === 'date') {
                    let currentData = dayjs().format('YYYY-MM-DD')
                    let subtractData = dayjs()
                        .subtract(2, 'month')
                        .format('YYYY-MM-DD')
                    this.queryCondition[p].value[0] = subtractData
                    this.queryCondition[p].value[1] = currentData
                }
            }
        },
        QueryApiCallback(p) {
            if (
                this.queryCondition[p].hasOwnProperty('api') &&
                this.queryCondition[p].hasOwnProperty('options')
            ) {
                moduleAxios
                    .get(
                        window.apiDict[this.queryCondition[p].prefix] +
                            this.queryCondition[p].api,
                    )
                    .then(res => {
                        if (res) {
                            this.queryCondition[p].options = []
                            res.map(item => {
                                this.queryCondition[p].options.push({
                                    value: item.name,
                                    label: item.name,
                                })
                            })
                        }
                    })
            }
        },
        query() {
            this.hdrTableData.currentPage = 1
            this.QUERYDATA()
        },
        QUERYDATA() {
            this.dtlTableData.forEach(item => {
                item.data.splice(0, item.data.length)
            })
            let param = {
                condition: JSON.stringify(this.condition),
                page: JSON.stringify(this.hdrTableData.currentPage),
                size: JSON.stringify(this.hdrTableData.pageSize),
            }
            console.log(this.theRestParams)
            if (this.theRestParams.hasOwnProperty('query')) {
                if (
                    this.theRestParams.query.hasOwnProperty('additional') &&
                    Object.keys(this.theRestParams.query.additional).length != 0
                ) {
                    param = Object.assign(
                        param,
                        this.theRestParams.query.additional,
                    )
                }
                if (
                    this.theRestParams.query.hasOwnProperty('condition') &&
                    this.theRestParams.query.condition.length > 0
                ) {
                    param.condition = JSON.stringify(
                        this.theRestParams.query.condition.concat(
                            this.condition,
                        ),
                    )
                }
            }
            let url = ''
            for (let i in param) {
                url += `${i}=${param[i]}&`
            }
            url = url.slice(0, url.lastIndexOf('&'))

            moduleAxios
                .get(this.uniqueDeployKey.api + '/GetHdrPageList?' + url)
                .then(res => {
                    console.log(res)
                    if (res) {
                        res.rows = formatIndex(
                            res.rows,
                            this.hdrTableData.currentPage,
                            this.hdrTableData.pageSize,
                        )
                        this.hdrTableData.data = []
                        res.rows.forEach(item => {
                            this.hdrTableData.data.push(item)
                        })
                        this.hdrTableData.total = res.total
                    }
                })
        },
        construction() {
            let newData = {
                isShow: this.isNewEdit,
                isData: this.hdrTableData.data,
            }
            bus.$emit('isNewEdit', newData)
            this.clearSelectionOuter()
        },
        edit() {
            let editData = {
                isCurrent: this.isCurrentData,
                isData: this.hdrTableData.data,
            }
            bus.$emit('isEditData', editData)
            setTimeout(() => {
                this.clearSelectionOuter()
            }, 0)
        },
        // 删除数据
        delete() {
            this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    moduleAxios({
                        method: 'delete',
                        url: this.uniqueDeployKey.api,
                        data: this.isCurrentData,
                    })
                        .then(res => {
                            console.log(res)
                            if (res) {
                                if (
                                    this.hdrTableData.currentPage != 1 &&
                                    this.hdrTableData.data.length == 1
                                ) {
                                    this.hdrTableData.currentPage -= 1
                                    this.QUERYDATA(
                                        this.hdrTableData.pageSize,
                                        this.hdrTableData.currentPage,
                                    )
                                } else {
                                    this.QUERYDATA(
                                        this.hdrTableData.pageSize,
                                        this.hdrTableData.currentPage,
                                    )
                                }
                                // this.query()
                                Vue.prototype.$notify.success({
                                    title: '',
                                    message: '删除成功',
                                    duration: 2000,
                                })
                            }
                        })
                        .catch(error => {
                            setTimeout(() => {
                                this.$message.error('请求异常，请联系管理员')
                            }, 500)
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000,
                    })
                })
        },
        buttonsevent(arg) {
            let action = arg.data.$vnode.data.key
            console.log(action)
            if (typeof this[action] == 'function') this[action].call(this, arg)
            else this.$emit(action, arg)
        },
        // dltButtonsEvent(arg, label) {
        //     this.$emit('dlt-button-click', arg, label)
        // },
        // tabClick(tab, event) {
        //     this.$emit('tab-click', tab, event)
        // },
        getCondition(arg, value, label, data) {
            if (this.isMethods.isGetCondition) {
                this.$emit('get-condition', arg, value, label, data)
            } else {
                this.condition = arg
                this.$emit('get-condition', arg, value, label, data)
            }
        },
        remoteMethod(query, name) {
            this.$emit('remote-method', query, name)
        },
        // table主表方法
        tableRowClick(arg) {
            if (this.isMethods.isTableRowClick) {
                this.$emit('table-row-click', arg)
                console.log(arg)
            } else {
                if (this.dtlTableData.length) {
                    console.log(arg.formno)
                    let param = {
                        formno: arg.formno,
                        condition: JSON.stringify([]),
                    }
                    moduleAxios
                        .get(this.uniqueDeployKey.api + '/GetDtlList', {
                            params: param,
                        })
                        .then(res => {
                            console.log(res)
                            if (res) {
                                this.dtlTableData[0].data = []
                                res.forEach(item => {
                                    this.dtlTableData[0].data.push(item)
                                })
                            }
                        })
                }
                this.$emit('table-row-click', arg)
            }
        },
        tableSelectionChange(arg) {
            this.buttons.forEach(item => {
                if (item.controlDisable == 'single')
                    item.disabled = arg.length !== 1
                if (item.controlDisable == 'multiple')
                    item.disabled = arg.length === 0
            })
            if (this.isMethods.isTableSelectionChange) {
                this.$emit('table-select-change', arg)
                console.log(arg)
            } else {
                if (arg.length != 0) {
                    this.isCurrentData = arg[0]
                }
                this.$emit('table-select-change', arg)
            }
        },

        paginationSizeChange(args) {
            console.log(args)
            if (this.isMethods.isPaginationSizeChange) {
                this.$emit('pagination-size-change', args)
                console.log(args)
            } else {
                this.hdrTableData.currentPage = 1
                this.hdrTableData.pageSize = args
                this.QUERYDATA(this.hdrTableData.pageSize)
            }
        },
        paginationCurrentChange(args) {
            console.log(args)
            if (this.isMethods.isPaginationCurrentChange) {
                this.$emit('pagination-current-change', args)
            } else {
                this.hdrTableData.currentPage = args
                this.QUERYDATA(
                    this.hdrTableData.pageSize,
                    this.hdrTableData.currentPage,
                )
            }
        },

    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
}

export default component
</script>

<style>

</style>

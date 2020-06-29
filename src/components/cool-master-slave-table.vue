<template>
    <el-container style="overflow: hidden;">
        <el-main>
            <cool-page-table v-show="isShowHdrTable"
                ref="table"
                :tree-props="hdrTableData.treeProps"
                :showSummary="hdrTableData.showSummary"
                :tableClass="hdrTableData.tableClass"
                :tableStyle="hdrTableData.tableStyle"
                :paginationClass="hdrTableData.paginationClass"
                :paginationStyle="hdrTableData.paginationStyle"
                :vLoading="hdrTableData.vLoading"
                :stripe="hdrTableData.stripe"
                :size="hdrTableData.size"
                :width="hdrTableData.width"
                :height="hdrTableData.height"
                :maxHeight="hdrTableData.maxHeight"
                :fit="hdrTableData.fit"
                :rowKey="hdrTableData.rowKey"
                :showPage="hdrTableData.showPage"
                :border="hdrTableData.border"
                :data="hdrTableData.data"
                :columns="hdrTableData.columns"
                :total="hdrTableData.total"
                :layout="hdrTableData.layout"
                :pageSize.sync="hdrTableData.pageSize"
                :currentPage.sync="hdrTableData.currentPage"
                :context="hdrTableData.context"
                :showHeader="hdrTableData.showHeader"
                :sumText="hdrTableData.sumText"
                :summaryMethod="hdrTableData.summaryMethod"
                :rowClassName="hdrTableData.rowClassName"
                :rowStyle="hdrTableData.rowStyle"
                :cellClassName="hdrTableData.cellClassName"
                :cellStyle="hdrTableData.cellStyle"
                :headerRowClassName="hdrTableData.headerRowClassName"
                :headerRowStyle="hdrTableData.headerRowStyle"
                :headerCellClassName="hdrTableData.headerCellClassName"
                :headerCellStyle="hdrTableData.headerCellStyle"
                :highlightCurrentRow="hdrTableData.highlightCurrentRow"
                :currentRowKey="hdrTableData.currentRowKey"
                :emptyText="hdrTableData.emptyText"
                :expandRowKeys="hdrTableData.expandRowKeys"
                :defaultExpandAll="hdrTableData.defaultExpandAll"
                :defaultSort="hdrTableData.defaultSort"
                :tooltipEffect="hdrTableData.tooltipEffect"
                :spanMethod="hdrTableData.spanMethod"
                :pageCount="hdrTableData.pageCount"
                :pageSizes="hdrTableData.pageSizes"
                :popperClass="hdrTableData.popperClass"
                :prevText="hdrTableData.prevText"
                :nextText="hdrTableData.nextText"
                :background="hdrTableData.background"
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
                :rowClick="rowClick"
            >
                <template #pageTableColumns>
                    <slot name="pageTableColumns"></slot>
                </template>
            </cool-page-table>
        </el-main>
        <el-footer :height="isShowHdrTable ? dtlTableHeight : autoHeight " v-if="showDtlTable">
            <!-- 添加主表收缩功能 -->
            <el-header height="auto" width="100%" style="background: #ccc;" >
                <el-button style="width:100%" size="mini" class="menu-collapse-button" @click="isShowHdrTable=!isShowHdrTable"></el-button>
            </el-header>
            <el-tabs ref="tabs" type="border-card" v-model="activeName" @tab-click="tabClick">
                <el-tab-pane
                    v-for="dtlTab in dtlTableData"
                    :label="dtlTab.label"
                    :name="dtlTab.name"
                >
                    <span slot="tab.label">{{dtlTab.label}}</span>
                    <el-container>
                        <el-header height="auto">
                            <slot name="footerTableSlot" v-if="dtlTab.showFooterTableSlot"></slot>
                            <cool-button-group
                                v-if="dtlTab.buttons && activeName === dtlTab.name"
                                :buttons="dtlTab.buttons"
                                @button-click="(value)=> dtlTabButtonEvent(value,dtlTab.label)"
                            ></cool-button-group>
                        </el-header>
                        <el-main>
                            <cool-table-view
                                v-if="activeName === dtlTab.name"
                                ref="dtlTable"
                                :tree-props="dtlTab.treeProps"
                                :showSummary="dtlTab.showSummary"
                                :tableClass="dtlTab.tableClass"
                                :tableStyle="dtlTab.tableStyle"
                                :vLoading="dtlTab.vLoading"
                                :stripe="dtlTab.stripe"
                                :size="dtlTab.size"
                                :width="dtlTab.width"
                                :height="dtlTab.height"
                                :maxHeight="dtlTab.maxHeight"
                                :fit="dtlTab.fit"
                                :rowKey="dtlTab.rowKey"
                                :border="dtlTab.border"
                                :data="dtlTab.data"
                                :columns="dtlTab.columns"
                                :context="dtlTab.context"
                                :showHeader="dtlTab.showHeader"
                                :sumText="dtlTab.sumText"
                                :summaryMethod="dtlTab.summaryMethod"
                                :rowClassName="dtlTab.rowClassName"
                                :rowStyle="dtlTab.rowStyle"
                                :cellClassName="dtlTab.cellClassName"
                                :cellStyle="dtlTab.cellStyle"
                                :headerRowClassName="dtlTab.headerRowClassName"
                                :headerRowStyle="dtlTab.headerRowStyle"
                                :headerCellClassName="dtlTab.headerCellClassName"
                                :headerCellStyle="dtlTab.headerCellStyle"
                                :highlightCurrentRow="dtlTab.highlightCurrentRow"
                                :currentRowKey="dtlTab.currentRowKey"
                                :emptyText="dtlTab.emptyText"
                                :expandRowKeys="dtlTab.expandRowKeys"
                                :defaultExpandAll="dtlTab.defaultExpandAll"
                                :defaultSort="dtlTab.defaultSort"
                                :tooltipEffect="dtlTab.tooltipEffect"
                                :spanMethod="dtlTab.spanMethod"
                                 @table-row-click="dtlTableRowClick"
                                 @table-row-contextmenu="dtlTableRowContextmenu" 
                                 @table-select="dtlTableSelect" 
                                 @table-select-all="dtlTableSelectAll" 
                                 @table-cell-mouse-enter="dtlTableCellMouseEnter" 
                                 @table-cell-mouse-leave="dtlTableCellMouseLeave" 
                                 @table-selection-change="dtlTableSelectionChange" 
                                 @table-cell-click="dtlTableCellClick" 
                                 @table-cell-dblclick="dtlTableCellDblclick"  
                                 @table-row-dblclick="dtlTableRowDblclick" 
                                 @table-header-click="dtlTableHeaderClick" 
                                 @table-header-contextmenu="dtlTableHeaderContextmenu" 
                                 @table-header-dragend="dtlTableHeaderDragend" 
                                 @table-sort-change="dtlTableSortChange" 
                                 @table-current-change="dtlTableCurrentChange" 
                                 @table-expand-change="dtlTableExpandChange" 
                                 @table-filter-change="dtlTableFilterChange"
                            >
                                <!--  <template #columns>
                  <slot :name="dtlTab.name"></slot>
                                </template>-->
                            </cool-table-view>
                        </el-main>
                    </el-container>
                </el-tab-pane>
            </el-tabs>
        </el-footer>
    </el-container>
</template>

<script>
// import coolPageTable from './commonComponents/cool-page-table.vue'
// import coolTable from './commonComponents/cool-table.vue'
import coolPageTableMixin from '../mixins/coolPageTableMixin.js'
import coolMasterSlaveTableMixin from '../mixins/coolMasterSlaveTableMixin.js'
const component = {
    name: 'master-slave-table',
    mixins: [coolPageTableMixin, coolMasterSlaveTableMixin],
    // components:{
    //  coolPageTable,
    //   coolTable
    // },
    data: function() {
        return {
            // activeName: this.dtlTableData.length ? this.dtlTableData[0].name : ''
            activeName: 'first',
            isShowHdrTable:true,
            autoHeight:"100%",
        }
    },
    props: {
        // table主表的数据
        hdrTableData: {
            type: Object,
            default: function() {
                return {}
            },
        },

        dtlTableHeight: {
            type: String,
            default: '260px',
        },
        // 是否显示从表
        showDtlTable: {
            type: Boolean,
            default: true,
        },
        // showDtlTable:Boolean,
        //table从表的数据
        dtlTableData: {
            type: Array,
            default: function() {
                return []
            },
        },
        rowClick: Function,
    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        )
}

export default component
</script>

<style scoped>
.menu-collapse-button {
  display: block !important;
  width: 100% !important;
  padding: 3px !important;
  text-align: justify !important;
}
</style>

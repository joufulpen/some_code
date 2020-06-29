<template>
    <el-container class="container cool-table" style="height:100%">
    <slot name="pageTableSlot"></slot>
    <el-main style="padding:0px;border:none;height:100%">
      <cool-table-view ref="table" :class="tableClass" v-loading="vLoading" :tree-props="treeProps" :style="tableStyle" :data="data" :size="size" :width="width" :height="height" :max-height="maxHeight" :fit="fit" :stripe="stripe" :border="border" :row-key="rowKey" :context="context" :show-header="showHeader" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" :row-class-name="rowClassName" :row-style="rowStyle" :cell-class-name="cellClassName" :cell-style="cellStyle" :header-row-class-name="headerRowClassName" :header-row-style="headerRowStyle" :header-cell-class-name="headerCellClassName" :header-cell-style="headerCellStyle" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :empty-text="emptyText" :expand-row-keys="expandRowKeys" :default-expand-all="defaultExpandAll" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :span-method="spanMethod" :columns="columns" @table-row-click="tableRowClick" @table-row-contextmenu="tableRowContextmenu" @table-select="tableSelect" @table-select-all="tableSelectAll" @table-cell-mouse-enter="tableCellMouseEnter" @table-cell-mouse-leave="tableCellMouseLeave" @table-selection-change="tableSelectionChange" @table-cell-click="tableCellClick" @table-cell-dblclick="tableCellDblclick"  @table-row-dblclick="tableRowDblclick" @table-header-click="tableHeaderClick" @table-header-contextmenu="tableHeaderContextmenu" @table-header-dragend="tableHeaderDragend" @table-sort-change="tableSortChange" @table-current-change="tableCurrentChange" @table-expand-change="tableExpandChange" @table-filter-change="tableFilterChange">
        <template #columns>
          <slot name="pageTableColumns"></slot>
        </template>
      </cool-table-view>
    </el-main>
    <el-footer height="auto" style="border:1px solid #ebeef5;border-top:0px" v-if="showPage">
      <cool-pagination ref="pagenation" :class="paginationClass" :style="paginationStyle" :page-size="pageSize" :total="total" :page-count="pageCount" :current-page.sync="currentPage" :layout="layout" :page-sizes="pageSizes" :popper-class="popperClass" :prev-text="prevText" :next-text="nextText" :background="background" @pagination-size-change="paginationSizeChange" @pagination-current-change="paginationCurrentChange" @pagination-prev-click="paginationPrevClick" @pagination-next-click="paginationNextClick" />
    </el-footer>
  </el-container>
</template>

<script>
  import tableMixin from '../../mixins/tableMixin.js'
  import paginationMixin from '../../mixins/paginationMixin.js'
  import coolPageTableMixin from '../../mixins/coolPageTableMixin.js'
const component = {
    name: 'page-table',
    mixins:[tableMixin,paginationMixin,coolPageTableMixin],
    props: {
     //是否显示分页
    showPage:{
      type:Boolean,
      default:true
    },
    paginationStyle:'float:right'
  },
  install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),    
}

export default component
</script>

<style scoped>

</style>

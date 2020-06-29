/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-05-27 17:37:36
 * @version $Id$
 */
const coolTableMixin = {
	methods:{
		 // table主表方法
    tableRowClick(row, column, event){
      this.$emit('table-row-click',row, column, event)
    },
    tableRowContextmenu(row, column, event){
      this.$emit('table-row-contextmenu',row, column, event)
    },
    tableSelect(selection, row){
      this.$emit('table-select',selection, row)
    },
    tableSelectAll(selection){
      this.$emit('table-select-all',selection)
    },
    tableCellMouseEnter(row, column, cell, event){
      this.$emit('table-cell-mouse-enter')
    },
    tableCellMouseLeave(row, column, cell, event){
      this.$emit('table-cell-mouse-leave')
    },
    tableSelectionChange(selection){
    	// console.log(arg)
      this.$emit('table-selection-change',selection)
    },
    tableCellClick(row, column, cell, event){
      this.$emit('table-cell-click',row, column, cell, event)
    },
    tableCellDblclick(row, column, cell, event){
      this.$emit('table-cell-dblclick',row, column, cell, event)
    },
    tableRowDblclick(row, column, event){
      this.$emit('table-row-dblclick',row, column, event)
    },
    tableHeaderClick(column, event){
      this.$emit('table-header-click',column, event)
    },
    tableHeaderContextmenu(column, event){
      this.$emit('table-header-contextmenu',column, event)
    },
    tableHeaderDragend(newWidth,oldWidth,column,event){
      this.$emit('table-header-dragend',newWidth,oldWidth,column,event)
    },
    tableSortChange(arg){
      this.$emit('table-sort-change',arg)
    },
    tableExpandChange(row, expanded){
      this.$emit('table-expand-change',row, expanded)
    },
    tableFilterChange(filters){
      this.$emit('table-filter-change',filters)
    },
    tableCurrentChange(currentRow, oldCurrentRow){
      this.$emit('table-current-change',currentRow, oldCurrentRow)
    },
    clearSelectionOuter(){
        this.$refs.table.clearSelectionOuter();
    },
    clearCurrentRow(){
        this.$refs.table.clearCurrentRow();
    },
    // 分页的方法；之所以将分页的方法放在这里的mixin 是因为在cool-master-salve-table中可以减少引入不必要的mixin
    paginationSizeChange(arg){
      // console.log(arg)
          this.$emit('pagination-size-change',arg)
      },
      paginationCurrentChange(args){
        this.$emit('pagination-current-change',args)
      },
      paginationPrevClick(args){
        this.$emit('pagination-prev-click',args)
      },
      paginationNextClick(args){
        this.$emit('pagination-next-click',args)
      },
	}
}
export default coolTableMixin
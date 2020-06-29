/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-05-28 09:45:49
 * @version $Id$
 */

const coolMasterSlaveTableMixin ={
	methods:{
		 // table从表方法
	    dtlTableRowClick(row, column, event){
	      this.$emit('dtl-table-row-click',row, column, event)
	    },
	    dtlTableRowContextmenu(row, column, event){
	      this.$emit('dtl-table-row-contextmenu',row, column, event)
	    },
	    dtlTableSelect(selection, row){
	      this.$emit('dtl-table-select',selection, row)
	    },
	    dtlTableSelectAll(selection){
	      this.$emit('dtl-table-select-all',selection)
	    },
	    dtlTableCellMouseEnter(row, column, cell, event){
	      this.$emit('dtl-table-cell-mouse-enter')
	    },
	    dtlTableCellMouseLeave(row, column, cell, event){
	      this.$emit('dtl-table-cell-mouse-leave')
	    },
	    dtlTableSelectionChange(selection){
	      this.$emit('dtl-table-selection-change',selection)
	    },
	    dtlTableCellClick(row, column, cell, event){
	      this.$emit('dtl-table-cell-click',row, column, cell, event)
	    },
	    dtlTableCellDblclick(row, column, cell, event){
	      this.$emit('dtl-table-cell-dblclick',row, column, cell, event)
	    },
	    dtlTableRowDblclick(row, column, event){
	      this.$emit('dtl-table-row-dblclick',row, column, event)
	    },
	    dtlTableHeaderClick(column, event){
	      this.$emit('dtl-table-header-click',column, event)
	    },
	    dtlTableHeaderContextmenu(column, event){
	      this.$emit('dtl-table-header-contextmenu',column, event)
	    },
	    dtlTableHeaderDragend(newWidth, oldWidth, column, event){
	      this.$emit('dtl-table-header-dragend',newWidth, oldWidth, column, event)
	    },
	    dtlTableSortChange(arg){
	      this.$emit('dtl-table-sort-change',arg)
	    },
	    dtlTableExpandChange(row, expanded){
	      this.$emit('dtl-table-expand-change',row, expanded)
	    },
	    dtlTableFilterChange(filters){
	      this.$emit('dtl-table-filter-change',filters)
	    },
	    dtlTableCurrentChange(currentRow, oldCurrentRow){
	      this.$emit('dtl-table-current-change',currentRow, oldCurrentRow)
	    },
	    dtlClearSelectionOuter(){
	        this.$refs.dtlTable.clearSelectionOuter();
	    },
	    dtlClearCurrentRow(){
	        this.$refs.dtlTable.clearCurrentRow();
	    },
	    dtlTabButtonEvent(arg, label) {
	        this.$emit('dtl-button-click', arg, label)
	    },
        tabClick(tab, event) {
            this.$emit('tab-click', tab, event)
        },
	}
}
export default coolMasterSlaveTableMixin

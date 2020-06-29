<template>
	<el-table ref="table" :class="tableClass" v-loading="vLoading" :style="tableStyle" :data="data" :size="size" :width="width" :height="height" :max-height="maxHeight" :fit="fit" :stripe="stripe" :border="border" :row-key="rowKeys" :context="context" :show-header="showHeader" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" :row-class-name="rowClassName" :row-style="rowStyle" :cell-class-name="cellClassName" :cell-style="cellStyle" :header-row-class-name="headerRowClassName" :header-row-style="headerRowStyle" :header-cell-class-name="headerCellClassName" :header-cell-style="headerCellStyle" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :empty-text="emptyText" :expand-row-keys="expandRowKeys" :default-expand-all="defaultExpandAll" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :span-method="spanMethod" :tree-props="treeProps">
        <el-table-column v-for="column in columns" :type="column.type" :label="column.label" :class-name="column.className" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading":label-class-name="column.labelClassName" :prop="column.prop" :width="column.width" :min-width="column.minWidth" :sortable="column.sortable" :sort-method="column.sortMethod" :sort-by="column.sortBy" :resizable="column.resizable" :column-key="column.columnKey" :align="column.align" :header-align="column.headerAlign" :show-tooltip-when-overflow="column.showTooltipWhenOverflow" :show-overflow-tooltip="true" :fixed="column.fixed" :formatter="column.formatter" :selectable="locationData == undefined ? column.selectable : selectable" :filter-method="column.filterMethod" :filters="column.filters" :filter-placement="column.filterPlacement" :filter-multiple="column.filterMultiple" :index="column.index" :key="column.columnKey">
				<template slot="header" >
          <el-tooltip class="item" effect="dark" :content="column.label" placement="top"><span>{{column.label}}</span></el-tooltip>
        </template>
      </el-table-column>
        <slot name="columns"></slot>
     </el-table>
</template>
<script>
	import tableMixin from '../../mixins/tableMixin.js'
	const component = {
		name: 'table-view',
		mixins:[tableMixin],
	created(){
		this.dealSelectable()
	},
	mounted: function() {
		this.rowKeys()
    	// setTimeout(this.registerEvents, 800)
    	this.$nextTick(()=>{ this.registerEvents() })
  },
  data: function() {
    return {
      locationData:undefined
    }
  },
  methods: {
  	dealSelectable(){
  		this.locationData = undefined
		if(window.location.hash.indexOf('alreadyChooseData') !== -1){
			let alreadyChooseData = window.location.hash.slice(window.location.hash.indexOf('alreadyChooseData'))
  			if(alreadyChooseData.indexOf('#') === -1){
  				alreadyChooseData = alreadyChooseData.slice(alreadyChooseData.indexOf('=') + 1)
  			}
    		else{
    			alreadyChooseData = alreadyChooseData.slice(alreadyChooseData.indexOf('=') + 1,alreadyChooseData.indexOf('#'))
    		}
    		if(JSON.parse(window.decodeURIComponent(alreadyChooseData)).length != 0){
    			this.locationData = JSON.parse(window.decodeURIComponent(alreadyChooseData)).map(p=> {
			 	if(p.hasOwnProperty('id') && p.hasOwnProperty('parentSn')){
			 		console.log('id','parentSn')
			 		if(p.parentSn == null && p.id !=null)return p.id
			 		else if(p.parentSn == null && p.id==null)return p.sn
			 		else return	p.parentSn
			 	}
			 	if(p.hasOwnProperty('id')) return p.id
			 	// if(!p.hasOwnProperty('id') && p.hasOwnProperty('code') && p.code != null)return p.code
			 	if(p.hasOwnProperty('parentSn')) return p.parentSn
			 })
    		}
			 console.log(this.locationData)
		}else{
			console.log('test')
		}
  	},
  	selectable(row,index){
  		if(this.locationData !== undefined && row.hasOwnProperty('id') && row.hasOwnProperty('sn'))
  			return  !this.locationData.includes(row.sn)
  		if(this.locationData !== undefined && row.hasOwnProperty('id'))
  			return  !this.locationData.includes(row.id)
  		// if(this.locationData !== undefined && row.hasOwnProperty('code') && row.code != null && !row.hasOwnProperty('id') )
  		// 	return  !this.locationData.includes(row.code || row.sn)
  		if(this.locationData !== undefined && row.hasOwnProperty('sn'))
  			return  !this.locationData.includes(row.sn)
  	},
  	rowKeys(row){
  		if(row && row.hasOwnProperty('guid')) return row.guid
  		if(row && !row.hasOwnProperty('guid') && row.hasOwnProperty('id')) return row.id
  	},
    clearSelectionOuter(){
        this.$refs.table.clearSelection();
    },
    clearCurrentRow(){
        this.$refs.table.setCurrentRow();
    },
    redirectEvents: function(source, target, events, prefix) {
	      events.forEach(function(event) {
	        if (source) {
	          source.$on(event, function(args) {
	            // 直接把arguments拓展出去
	            target.$emit(prefix + event, ...arguments)
	          })
	        }
	      })
	    },
	registerEvents: function() {
	      var table = this.$refs.table
	      var tableEvents = [
	        'select',
	        'select-all',
	        'selection-change',
	        'cell-mouse-enter',
	        'cell-mouse-leave',
	        'cell-click',
	        'cell-dblclick',
	        'row-click',
	        'row-contextmenu',
	        'row-dblclick',
	        'header-click',
	        'header-contextmenu',
	        'sort-change',
	        'filter-change',
	        'current-change',
	        'header-dragend',
	        'expand-change'
	      ]
	      this.redirectEvents(table, this, tableEvents, 'table-')
	    }
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

<template>
    <el-container>
        <slot name="firstSlot" />
        <el-header height="auto" v-if="buttons">
          <cool-button-group ref="buttonsGroup" :buttons="buttons" @button-click="buttonsevent" @handle-command="handleCommand">
                <template #buttonSlot>
                  <slot name="buttonSlot" />
                </template><slot name="firstSlot" />
          </cool-button-group>
          <slot name="headerSlot" />
        </el-header>
        <el-main>
          <el-container>
             <cool-query :isMethods="isMethods" :asideWidth="asideWidth" ref="query" v-show="Object.keys(queryCondition).length != 0" :origin-condition="queryCondition"  @get-condition="getCondition" @remote-method="remoteMethod">
              <template #querySlot>
                <slot name="querySlot"></slot>
              </template>
            </cool-query>
            <cool-page-table ref="table" :class="singleTableData.tableClass" v-loading="singleTableData.vLoading" :tree-props="singleTableData.treeProps" :style="singleTableData.tableStyle" :data="singleTableData.data" :showPage="singleTableData.showPage" :total="singleTableData.total" :layout="singleTableData.layout" :pageSize.sync="singleTableData.pageSize" :currentPage.sync="singleTableData.currentPage" :size="singleTableData.size" :width="singleTableData.width" :height="singleTableData.height" :max-height="singleTableData.maxHeight" :fit="singleTableData.fit" :stripe="singleTableData.stripe" :border="singleTableData.border" :row-key="singleTableData.rowKey" :context="singleTableData.context" :show-header="singleTableData.showHeader" :show-summary="singleTableData.showSummary" :sum-text="singleTableData.sumText" :summary-method="singleTableData.summaryMethod" :row-class-name="singleTableData.rowClassName" :row-style="singleTableData.rowStyle" :cell-class-name="singleTableData.cellClassName" :cell-style="singleTableData.cellStyle" :header-row-class-name="singleTableData.headerRowClassName" :header-row-style="singleTableData.headerRowStyle" :header-cell-class-name="singleTableData.headerCellClassName" :header-cell-style="singleTableData.headerCellStyle" :highlight-current-row="singleTableData.highlightCurrentRow" :current-row-key="singleTableData.currentRowKey" :empty-text="singleTableData.emptyText" :expand-row-keys="singleTableData.expandRowKeys" :default-expand-all="singleTableData.defaultExpandAll" :default-sort="singleTableData.defaultSort" :tooltip-effect="singleTableData.tooltipEffect" :span-method="singleTableData.spanMethod" :columns="singleTableData.columns" @table-row-click="tableRowClick" @table-row-contextmenu="tableRowContextmenu" @table-select="tableSelect" @table-select-all="tableSelectAll" @table-cell-mouse-enter="tableCellMouseEnter" @table-cell-mouse-leave="tableCellMouseLeave" @table-selection-change="tableSelectionChange" @table-cell-click="tableCellClick" @table-cell-dblclick="tableCellDblclick"  @table-row-dblclick="tableRowDblclick" @table-header-click="tableHeaderClick" @table-header-contextmenu="tableHeaderContextmenu" @table-header-dragend="tableHeaderDragend" @table-sort-change="tableSortChange" @table-current-change="tableCurrentChange" @table-expand-change="tableExpandChange" @table-filter-change="tableFilterChange" @pagination-size-change="paginationSizeChange" @pagination-current-change="paginationCurrentChange" @pagination-prev-click="paginationPrevClick" @pagination-next-click="paginationNextClick">
              <template #columns>
                  <slot name="columnsSlot"></slot>
              </template>
            </cool-page-table>
          </el-container>
        </el-main>
      <cool-multi-dialog ref="multiDialog" v-if="dialogs.length" :dialogs="dialogs" @back-event="backEvent" @save-event="saveEvent" :before-close="beforeClose" @closedialog="closedialog" />
  </el-container >
</template>

<script>
    import {isArrOrObj,settingAxios,moduleAxios} from '../utils/tools.js'
    import bus from '@/utils/bus'
    import dayjs from 'dayjs'
    import coolPageTableMixin from '../mixins/coolPageTableMixin.js'
    import coolMultiDialogMixin from '../mixins/coolMultiDialogMixin.js'
const component = {
    name: 'single-view',
    mixins:[coolPageTableMixin,coolMultiDialogMixin],
    props: {
        saveBtnDisabled: [Boolean, Function],
        showSaveButton:{
          type:Boolean,
          default:false
        },
        uniqueDeployKey:Object,
        axiosSetting:Object,
        // 弹窗数据
        dialogs:{
          type:Array,
          default:function(){
            return []
          }
        },
        isMethods:{
          type:Object,
          default:function(){
            return {}
          }
        },
        theRestParams:{
          type: Object,
          default: function() {
            return {}
          },
        },
        asideWidth:{
          type:String,
          default:'235px'
        }
    },
    data:function(){
      return{
        isEdit:true,
        isNewEdit:true,
        ids:null,
        isCurrentData:{},//当前选中的数据
        buttons: [],
        // 查询条件组件
        queryCondition: {} || [],
        // table主表的数据
        singleTableData:{},
        // 查询参数
        condition:[],
        //
        modeList:{},
        // 升降序
        sortOrder:null,
      }
    },
   created(){
      settingAxios(this.axiosSetting)
      this.takeJsonData()
    },
    mounted(){

    },
    computed:{
      sortPramas:function(){
        if(this.sortOrder!=null && this.sortOrder.order != null){
          let str = this.sortOrder.order == "descending" ? this.sortOrder.order.slice(0,4) : this.sortOrder.order.slice(0,3)
          return {orderBy:this.sortOrder.prop+' '+str}
        }
        else
          return {}
      }
    },
    methods:{
      dateFormatter(arg,columns) {
          if(arg[columns.property]){
            return dayjs(arg[columns.property]).format("YYYY-MM-DD")
          }
        },
      takeJsonData(){
        console.time("加载window的json文件时间");
        for(let i in window.coolLocals){
        if(i != 'index.json'){
        for(let p in JSON.parse(window.coolLocals[i])){
          this[p] = JSON.parse(window.coolLocals[i])[p]
          if(p == 'singleTableData'){
            this.singleTableData.columns.map(item=>{
              if(item.dateFormatter) item = Object.assign(item,{formatter:this.dateFormatter})
              if(item.hasOwnProperty('formatterName') && window.formatterMethods)
                  item = Object.assign(item,{formatter:window.formatterMethods[item.formatterName]})
              if(item.showSelectable && item.type == 'selection'){
                item = Object.assign(item,{selectable:function(arg,columns) {
                    if (arg[item.justifyProp] == item.justifyText) {
                      return false
                    } else return true
                  }})
              }
            })
          }
        }
        }
      }
        this.JsonCallback()
        console.timeEnd("加载window的json文件时间");
      },

       JsonCallback(){
        if(Object.keys(this.queryCondition).length != 0){
           console.log(this.queryCondition,this.modeList,)
            console.time("加载queryCondition数据的时间");
              for(let p in this.queryCondition){
                this.QueryCallback(p)
                this.QueryApiCallback(p)
              }
            console.timeEnd("加载queryCondition数据的时间");
          }
       },
       QueryCallback(p){
                   for (let k in this.queryCondition[p]){
                      if(k === 'form' && this.queryCondition[p][k] === 'autocomplete' && this.queryCondition[p].api){
                        console.log(this.queryCondition[p][k])
                          moduleAxios.get(window.apiDict[this.queryCondition[p].prefix]  + this.queryCondition[p].api).then(res=>{
                            console.log(res)
                            if(res){ 
                              this.queryCondition[p].data = []
                              res.map(item=>{
                                if(item.name) this.queryCondition[p].data.push({value:item.name})
                                else this.queryCondition[p].data.push({value:item})
                              })
                              console.log(this.queryCondition[p].data)
                            }
                          })
                        }
                      if ( k === 'dataType' && Object.keys(this.modeList).length != 0){
                         let key = this.queryCondition[p][k]
                         this.queryCondition[p].modeList =JSON.parse(JSON.stringify(this.modeList[key]))
                      }
                      if(k === 'form' && this.queryCondition[p][k] === 'date'){
                        let currentData =  dayjs().format("YYYY-MM-DD")
                        let subtractData = dayjs().subtract(2,'month').format("YYYY-MM-DD")
                        this.queryCondition[p].value[0] = subtractData;
                        this.queryCondition[p].value[1] = currentData;
                      }
                   }
       },
       QueryApiCallback(p){
        if(this.queryCondition[p].hasOwnProperty('api') && this.queryCondition[p].hasOwnProperty('options') && this.queryCondition[p].hasOwnProperty('prefix')){
                  console.log(window.apiDict[this.queryCondition[p].prefix])
                  moduleAxios.get( window.apiDict[this.queryCondition[p].prefix] + this.queryCondition[p].api).then(res=>{
                    if(res){
                      this.queryCondition[p].options = []
                      if(this.queryCondition[p].hasOwnProperty('customPushData') && this.queryCondition[p]['customPushData'].length > 0){
                          res.map(item=>{  this.queryCondition[p].options.push({value:item[this.queryCondition[p]['customPushData'][0]['value']],label:item[this.queryCondition[p]['customPushData'][0]['label']]}) })                          
                      }else{res.map(item=>{  this.queryCondition[p].options.push({value:item.name,label:item.name}) })} 
                    }
                  })
                }
       },
       //
       handleCommand(arg){
        console.log(arg,window.serveDict)
        this.buttons.map(item=>{
          if(item.dropdownModule){
            item.dropdownModule.map(p=>{
              if(p.command == arg){
                window.vm.dialogs[0].src = `${window.serveDict[p.serveApi]}${p.url}#${window.token}#${this.ids}`
                window.vm.dialogs[0].name = p.command
                window.vm.dialogs[0].title = p.text
                window.getDialog(window.vm.dialogs,p.command).visible = true
              }
            })
          }
        })
      },
      // 表头排序
      tableSortChange({column, prop, order}){
        if(this.isMethods.isTableSortChange){
            this.$emit('table-sort-change',column, prop, order)
          }
          else{
            this.sortOrder = {prop,order}
            this.QUERYDATA()
            this.$emit('table-sort-change',column, prop, order)
          }
      },
      // 前端分页
      pageData(data,size,current){
        this.singleTableData.data = data.slice( size * ( current - 1 ), size * current)
        this.singleTableData.total = data.length
      },
      // 无分页查询
       nrormalQuery(){
        let param ={
          condition:JSON.stringify(this.condition)
        };
        moduleAxios.get(this.uniqueDeployKey.api + '/GetList',{
        params:param
        }).then(res => {
            console.log(res)
            if(res){
              this.singleTableData.data = []
              res.forEach( item=> {
                this.singleTableData.data.push(item)
              });
            }
          })
      },
      // 无分页删除
      nrormalDelete() {
          this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          moduleAxios({
              method:"delete",
              url:this.uniqueDeployKey.api,
              data:this.isCurrentData
            }).then(res=>{
              console.log(res)
              if(res){
                this.nrormalQuery()
                Vue.prototype.$notify.success({
                  title: '',
                  message: '删除成功',
                  duration: 2000,
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
      },
       // 分页查询
       query(){
        this.singleTableData.currentPage = 1
        this.QUERYDATA()
      },
      QUERYDATA(){
        let param ={
          condition:JSON.stringify(this.condition),
          page: JSON.stringify(this.singleTableData.currentPage),
          size: JSON.stringify(this.singleTableData.pageSize),
          // orderBy:JSON.stringify(this.sortPramas)
        };
        // 查看是否有额外参数传入
        if(this.theRestParams.hasOwnProperty('query')){
          if(this.theRestParams.query.hasOwnProperty('additional') && Object.keys(this.theRestParams.query.additional).length != 0){
             param = Object.assign(param,this.theRestParams.query.additional)
          }
          if(this.theRestParams.query.hasOwnProperty('condition') && this.theRestParams.query.condition.length > 0){
            param.condition = JSON.stringify(this.theRestParams.query.condition.concat(this.condition)) 
          }
        }
        // 查看是否有排序参数
        if(Object.keys(this.sortPramas).length != 0)param = Object.assign(param,this.sortPramas)

        console.log(param)
        let url = ''
        for(let i in param){
          url += `${i}=${param[i]}&`
        }
        url= url.slice(0,url.lastIndexOf('&'))
        moduleAxios.get(this.uniqueDeployKey.api + '/GetPageList?' +url).then(res => {
            console.log(res)
            if(res){
              this.singleTableData.data = []
              res.rows.forEach( item=> {
                this.singleTableData.data.push(item)
              });
              this.singleTableData.total = res.total
            }
          })
      },
      // 新建
      construction(){
            let newData = {
              isShow:this.isNewEdit,
              isData:this.singleTableData.data
            }
            bus.$emit('isNewEdit', newData)
            this.$emit('custom-construction')
            this.clearSelectionOuter()
      },
      // 编辑
      edit(){
           let editData = {
              isCurrent:this.isCurrentData,
              isData:this.singleTableData.data
            }
            bus.$emit('isEditData',editData)
            this.$emit('custom-edit')
            setTimeout(()=>{
              this.clearSelectionOuter()
            },0)
      },
      // 删除
      delete() {
          this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          moduleAxios({
              method:"delete",
              url:this.uniqueDeployKey.api,
              data:this.isCurrentData
            }).then(res=>{
              console.log(res)
              if(res){
                console.log(this.singleTableData.data,this.singleTableData.data.length)
                if(this.singleTableData.currentPage != 1 && this.singleTableData.data.length == 1){
                  this.singleTableData.currentPage -= 1
                  this.QUERYDATA()
                }else{
                  this.QUERYDATA()
                }
                Vue.prototype.$notify.success({
                  title: '',
                  message: '删除成功',
                  duration: 2000,
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
      },
       //按钮事件
        buttonsevent(arg){
          let action = arg.data.$vnode.data.key
          if(typeof this[action] == 'function')
            this[action].call(this, arg)
          else
            this.$emit(action,arg)
        },

        getCondition(arg,value,label,data){
          if(this.isMethods.isGetCondition){
            // console.log(arg)
            this.$emit('get-condition',arg,value,label,data)
          }
          else{
            this.condition = arg
            this.$emit('get-condition',arg,value,label,data)
          }
        },
        remoteMethod(query,name) {
          this.$emit('remote-method', query, name)
        },

        tableSelectionChange(arg){
          this.buttons.forEach(item=>{
            if(item.controlDisable == 'single') item.disabled = arg.length !== 1
            if(item.controlDisable == 'multiple') item.disabled = arg.length === 0
            })
          if(this.isMethods.isTableSelectionChange){
            console.log(arg)
            this.$emit('table-selection-change',arg)
          }
          else{
              console.log(arg)
             if (arg.length != 0) {
              this.isCurrentData = arg[0]
              this.ids = arg[0].id
            }
            this.$emit('table-selection-change',arg)
          }
        },
        // backEvent() {
        //   this.$emit('back-event')
        // },
        // saveEvent() {
        //   this.$emit('save-event')
        // },
        // beforeClose(){
        //   this.$emit('before-close')
        // },
        // closedialog(name) {
        //   this.$emit('closedialog',name)
        // },
        paginationSizeChange(args) {
          console.log(args)
          if (this.isMethods.isPaginationSizeChange) {
            this.$emit('pagination-size-change', args)
          } else {
            this.singleTableData.currentPage = 1
            this.singleTableData.pageSize = args
            this.QUERYDATA()
          }
        },
        paginationCurrentChange(args) {
          console.log(args)
          if (this.isMethods.isPaginationCurrentChange) {
            this.$emit('pagination-current-change', args)
          } else {
            this.singleTableData.currentPage = args
            this.QUERYDATA()
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

<style scoped>

</style>

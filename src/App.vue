<template>
    <div>
        <el-row>
            <el-button type="primary" :disabled="currentRow == null" >编辑</el-button>
            <el-button type="danger" :disabled="selectionData.length === 0" @click="delEvent">删除</el-button>
        </el-row>
        <cool-table-view ref="tableView" :showPage="showPage" :data="tableData" :columns="column" @table-selection-change="selection" @table-row-click="tablerowclick" @table-row-dblclick="tableRowDblclick" @table-header-dragend="headerDragend" :highlight-current-row="true" />
        <cool-quick-edit ref="quickEdit" :visible.sync="quickDialogVisible" :form-items="quickCoolFormItems" :show-save-button="showSaveButton" :width="dialogWidth" :labelWidth="labelWidth" :all-data="tableData" :currentEditData="currentEditData"  />
     <!--    <el-table
        border
      :data="tableData2"
      style="width: 100%"
      @header-dragend="headerDragend"
      >
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
 -->    </div>
</template>

<script>
import coolElements from './index.js'
import tableMixin from './mixins/tableMixin'
import saveButtonMixin from './mixins/saveButtonMixin.js'
export default {
    components: coolElements,
    mixins:[tableMixin],
    data(){
            return {
              tableData2: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
              showPage:false,
              quickDialogVisible:false,
              dialogWidth:'400px',
              labelWidth:'100px',
              currentEditData:{},
              currentRow:null,
              selectionData:[],
              quickCoolFormItems:{
                  form:[{
                    "type": "input",
                    "value": "",
                    "label": "产品名称",
                    "disabled":true,
                    "readonly":true,
                    "name": "name",
                    "style": {
                      "width": "100%"
                    }
                  },{
                    "type": "input",
                    "value": "",
                    "label": "产品编码",
                    "disabled":true,
                    "readonly":true,
                    "name": "code",
                    "style": {
                      "width": "100%"
                    }
                  },{
                    "type": "inputNumber",
                    "value": "",
                    "label": "数量",
                    "inputStyle":{"width":"193px"},
                    "min":0,
                    "disabled":false,
                    "name": "qty",
                    "style": {
                      "width": "100%"
                    },
                    "rules":{ "required": true, "message": '请输入数量', "trigger": 'change' }
                  },{
                    "type": "date",
                    "inputStyle":{"width":"193px"},
                    "value": "",
                    "label": "到货时间",
                    "disabled":false,
                    "name": "arrivalDate",
                    "style": {
                      "width": "100%"
                    }
                  },{
                    "type": "input",
                    "value": "",
                    "label": "备注",
                    "disabled":false,
                    "name": "description",
                    "style": {
                      "width": "100%"
                    }
                  }      
                  ]
                },
              showSaveButton:true,
              tableData:[{
                name:"可乐雪碧",
                code:"H001",
                productName:"二氧化碳",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"FY"
              },{
                name:"抹绿茶婊",
                code:"H002",
                productName:"过氧化氢",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"LPO"
              },{
                name:"烤鼠标",
                code:"H003",
                productName:"氯化镁",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"HUI"
              },{
                name:"傻瓜工具",
                code:"H004",
                productName:"机顶盒",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"FFG"
              },{
                name:"放假爱国",
                code:"H005",
                productName:"罚款购买",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"LPO"
              },{
                name:"洗澡干净",
                code:"H006",
                productName:"马克思列宁主义",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"DGFE"
              },{
                name:"开工感冒",
                code:"H007",
                productName:"浓硫酸",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"OPO"
              },{
                name:"放假躺尸",
                code:"H008",
                productName:"睡个觉",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"JKL"
              },{
                name:"上班有病",
                code:"H009",
                productName:"下班有病",
                qty:0,
                arrivalDate:"2020-03-31T15:31:04",
                description:"共产主义对资本主义的打击"
              }],
              column:[{
                  type: 'selection'
                },{
                prop: 'index',
                label: '序号',
                fixed: 'fixed',
                type: 'index',
                width: '50px'
              },
              {
                prop: "name",
                label: "产品名称",
                width: '160',
                fixed: 'fixed'
              }, {
                prop: "code",
                label: "产品编码"
              }, {
                prop: "productName",
                label: "主材质"
              },{
                prop: "qty",
                label: "数量"
              },
              {
                prop: "arrivalDate",
                label: "到货时间"
              },
              {
                prop: "description",
                label: "备注"
              }]
            }
        },
    
    watch:{
       
    } ,   
    methods:{
      headerDragend(newWidth, oldWidth, column, event){
        console.log(newWidth, oldWidth, column, event)
      },
      tableRowDblclick(row, column, event){
        console.log(row, column, event)
        this.editData(this.currentRow)
      },
      editData(arg){
        this.currentEditData = arg
        this.quickDialogVisible = true
        this.quickCoolFormItems.form.forEach(item=>{
          for(let i in arg){
            if(i == item.name)item.value = arg[i]
          }
        })
      },
      tablerowclick(arg){
        this.currentRow = arg
      },
      delEvent(){
        this.selectionData.forEach(p=>{
          this.tableData.splice(this.tableData.indexOf(p),1)
        })
        this.selectionData = []
        console.log(this.selectionData)
        this.$refs.tableView.clearSelectionOuter()
      },
      selection(arg){
        this.selectionData = arg.map(p=>p)
        console.log(arg,this.selectionData)
      }
  }
}
</script>
<style>
 *{
  padding:0;
  margin:0;
}

</style>
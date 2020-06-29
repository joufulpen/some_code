<template>
    <div class="cool-query">
      <el-container>
      <el-aside :width="asideWidth" v-show="isShowQuery" style="overflow-y: hidden;height:100%;">
      <div>
        <el-row >
          <el-col :span="6" style="text-align:center;">
            <i :class="isShowModeList ? 'el-icon-s-tools' : 'el-icon-setting'" @click="changeMode"></i>
          </el-col>
          <el-col :span="12" style="text-align:center;">
            <div>{{queryText}}</div>
          </el-col>
          <el-col :span="6" style="text-align:center;">
            <i class="el-icon-refresh-left" @click="reset"></i>
          </el-col>
        </el-row>
      </div>
  <el-main style="font-size:12px;padding:5px;">
    <el-row :gutter="1" type="flex" justify="center" align="middle" :style="isShowModeList ? 'margin-bottom:10px;text-align:center' : item.mode !== '不参与' ? 'margin-bottom:10px;text-align:center' : 'margin-bottom:0px' " v-for="(item,index) in originCondition" :key="index">
      <el-col :span="isShowModeList ? 6 : 10" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'">{{item.name}}</el-col>
      <el-col :span="5" v-if="isShowModeList">
        <el-dropdown trigger="click" @command="handleCommand" placement="bottom-start">
          <span class="el-dropdown-link" style="font-size:12px;">
            {{item.mode}}
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item v-for="(list,idx) in item.modeList" :key="idx" :command="{data:list,index:idx,mode:item}">{{list}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="isShowModeList ? 13 : 14">
        <el-input clearable :size="size" v-model="item.value" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='input'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'"></el-input>
        <el-row v-if="item.form=='radio'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'">
          <el-col :span="12" >
            <el-radio label="true" v-model="item.value" :size="size" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='radio'">是</el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio label="false" v-model="item.value" :size="size" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='radio'">否</el-radio>
          </el-col>
        </el-row>
          <!-- 带输入建议 -->
        <el-autocomplete v-model="item.value" :fetch-suggestions="querySearch" :size="size" :style="item.inputStyle" v-if="item.form=='autocomplete'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" @select="handleSelect" :disabled="item.disabled"  @change="(value)=>updateCondition(value,item.name)" @focus="focusEvent(item.name)" clearable></el-autocomplete>
        <!-- switch -->
        <el-switch v-if="item.form == 'switch'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" v-model="item.value" :active-color="item.activeColor" :inactive-color="item.inactiveColor" :disabled="item.disabled" :width="item.width" :active-icon-class="item.activeIconClass" :inactive-icon-class="item.inactiveIconClass" :active-text="item.activeText" :inactive-text="item.inactiveText" :active-value="item.activeValue" :inactive-value="item.inactiveValue" :validate-event="item.validateEvent" @change="(value)=>updateCondition(value,item.name)">
      </el-switch>
        <el-select v-model="item.value" v-if="item.form=='select'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" :size="size" clearable :disabled="item.disabled"  @change="(value)=>updateCondition(value,item.name)" :filterable="item.filterable" :remote="item.remote" :remote-method="(value)=>remoteMethod(value,item.name)" :loading="item.loading">
          <el-option v-for="option in item.options" :key="option.value" :value="option.value" :label="option.label"></el-option>
        </el-select>

        <!-- 单个日期选择 -->
        <el-date-picker style="width:100%;font-size:10px" v-model="item.value" type="date" :size="size" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='singleDate'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
        <!-- 两个日期选择 -->
        <el-date-picker style="width:100%;font-size:10px" v-model="item.value[0]" type="date" :size="size" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='date'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" value-format="yyyy-MM-dd" :clearable="false"><br></el-date-picker>
        <el-date-picker style="width:100%;font-size:10px" v-model="item.value[1]" type="date" :size="size" :disabled="item.disabled" @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='date'" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
        <el-input-number v-model="item.value" :min="item.min" :max="item.max" :step="item.step" :precision="item.precision" :disabled="item.disabled" :size="size" :controls="false"  @change="(value)=>updateCondition(value,item.name)" v-if="item.form=='number'" style="width:100%" v-show="isShowModeList ? isShowModeList : item.mode !== '不参与'"></el-input-number>
      </el-col>
    </el-row>
     <slot name="querySlot" />
  </el-main>
</el-aside>
<el-aside width="auto" style="z-index:1">
      <el-button size="mini" class="menu-collapse-button" @click="isShowQuery=!isShowQuery"></el-button>
</el-aside>
</el-container>
</div>
</template>

<script>
  import dayjs from 'dayjs'
  import {isArrOrObj} from '@/utils/tools'
const component = {
    name: 'query',
    props: {
        originCondition:{
          type:[Object, Array],
          default:function(){
            return {} || []
          }
        },
        asideWidth:{
          type:String,
          default:'235px'
        },
        queryText:{
          type:String,
          default:'查询条件'
        },
        isMethods:{
          type:Object,
          default:function(){
            return {}
          }
        }
    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
    data() {
      return {
        size: 'mini',
        condition: [],
        labelData:'',
        isShowQuery:true,
        isShowModeList:false,
        resetData:{}
      }
    },
    mounted() {
      this.updateCondition()
      this.dealWithData()
    },
    methods: {
      dealWithData(){
        this.resetData = JSON.parse(JSON.stringify(this.originCondition))
        Object.keys(this.resetData).forEach(p=>{
          if(this.resetData[p]['options'])delete this.resetData[p]['options']
          if(this.resetData[p]['data'])delete this.resetData[p]['data']  
        })
      },
      changeMode(){
        this.isShowModeList = !this.isShowModeList
      },
      // 重置查询条件
      reset(){
        Object.keys(this.resetData).forEach(p=>{
          this.originCondition[p] = Object.assign(this.originCondition[p],JSON.parse(JSON.stringify(this.resetData[p])))  
        })
        this.originCondition
        this.isShowModeList = false
        this.updateCondition()
      },
      remoteMethod(query,name) {
        this.$emit('remote-method', query, name)
      },
      focusEvent(arg){
        this.labelData = arg
      },
      handleSelect(item) {
        this.$emit('select', item)
        this.updateCondition()
      },
      handleCommand(command) {
        command.mode.mode = command.data
        this.updateCondition()
      },
      querySearch(queryString, cb) {
          if(this.isMethods.isQuerySearch)
              this.$emit('query-search', queryString, cb)
          else{
            for(let i in this.originCondition){
              if(this.originCondition[i].name == this.labelData){
                var results = queryString ? this.originCondition[i].data.filter(this.createFilter(queryString)) : this.originCondition[i].data
                console.log(results)
                cb(results)
              }
            }
            this.$emit('query-search', queryString, cb)
          }
        },
        createFilter(queryString) {
          return name => {
            return (
              name.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
            )
          }
        },

      updateCondition(value,label) {
        this.condition = []
            for (var prop in this.originCondition) {
                this.condition.push(this.originCondition[prop])
            }
        this.condition = this.condition.map(item=>{
            let valueArray =[]
            if(isArrOrObj(item.value)){
              item.value.map((p,index)=>{
                if(index == 1 && item.form == 'date') valueArray.push({value:dayjs(p).add(1,'day').format('YYYY-MM-DD')})
                else valueArray.push({value:p})
              })
            }else if(typeof(item.value) ==='string'){
              if(item.value.indexOf(',') != -1 ){
                let newArr = item.value.split(',')
               newArr.map(p=>{
                valueArray.push({value:p})
              })
              }else if(item.value.indexOf('，') != -1 ){
                let newArr = item.value.split('，')
               newArr.map(p=>{
                valueArray.push({value:p})
              })
             }else{
                valueArray.push({value:item.value})
              }
            }else if(typeof(item.value) ==='boolean'){
                  valueArray.push({value:item.value})
            }
            return {
                  "FieldName":item.fieldName,
                  "TableName":item.tableName,
                  "Value":valueArray,
                  "TableRelationMode":item.tableRelationMode,
                  "Mode":item.mode,
                  "DataType":item.dataType
                }
              })
            let validData = this.condition.filter(item=>item.Mode != '不参与')
            console.log(validData,value,label,this.condition)
           this.$emit('get-condition', validData,value,label,this.condition)
      },
    }
}

export default component
</script>

<style scoped>
.menu-collapse-button {
  padding: 3px !important;
  height: 100% !important;
}
</style>

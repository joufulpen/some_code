<template>
    <div class="cool-form">
    <el-form :model="formItems" :rules="rules" ref="ruleForm" :size="size" :inline="inline" :label-position="labelPosition" :label-width="labelWidth" :label-suffix="labelSuffix" :hide-required-asterisk="hideRequiredAsterisk" :show-message="showMessage" :inline-message="inlineMessage" :status-icon="statusIcon" :validate-on-rule-change="validateOnRuleChange" :disabled="disabled">

      <el-form-item :label="item.label" :prop="'form.' + index + '.value'" :rules="item.rules" :label-width="item.labelWidth" :required="item.required" :error="item.error" :show-message="item.showMessage" :inline-message="item.inlineMessage" :size="item.size" v-for="(item,index) in formItems.form || formItems " :style="item.style" :key="index"   @keydown.tab.native="tabEvent" @keyup.enter.native="(e)=>enterEvent(e)"  @keydown.native="keyDownEvent" @keyup.native="keyUpEvent">
        
        <el-input v-model="item.value"  @change="(value)=>updateForm(value,item.label)" v-if="item.type=='input'" :type="item.inputType ? item.inputType : 'text'"  :style="item.inputStyle" :size="inputSize" @click.native="itemClick" :name="item.prop" :disabled="item.disabled" :readonly="item.readonly" :placeholder="item.placeholder" :suffix-icon="item.suffixIcon" :prefix-icon="item.prefixIcon" :clearable="item.clearable == undefined?true:item.clearable" :show-password="item.showPassword"  @keyup.up.native="backUp" @keyup.down.native="backDown" @focus="focusEvent(item.label)">
          <template slot="append" v-if="item.appendSlotData">{{item.appendSlotData}}</template>
        </el-input>

        <el-radio-group v-model="item.value" v-if="item.type=='radio'" :style="item.inputStyle"  @change="(value)=>updateForm(value,item.label)" :size="inputSize" :disabled="item.disabled" :readonly="item.readonly">
          <el-radio :label="ele.value" v-for="(ele,index) in item.radioItems" :key="index">{{ele.label}}</el-radio>
        </el-radio-group>

        <el-select v-model="item.value"  v-if="item.type=='select'" :clearable="item.clearable == undefined?true:item.clearable" :disabled="item.disabled" :readonly="item.readonly" :style="item.inputStyle"  @change="(value)=>updateForm(value,item.label)"  @focus="focusEvent(item.label)" :size="inputSize" :filterable="item.filterable ? item.filterable : true" :remote="item.remote" :remote-method="(value)=>remoteMethod(value,item.label)" :loading="item.loading">
          <el-option v-for="(ele,index) in item.options" :label="ele.label" :value="ele.value" :key="index"></el-option>
        </el-select>

        <el-checkbox-group v-model="item.value" v-if="item.type=='chenckbox'" :style="item.inputStyle" :size="inputSize" :disabled="item.disabled" :readonly="item.readonly">
          <el-checkbox v-for="ele in item.chenckboxItems" :key="ele.index" :label="ele.value"  @change="(value)=>updateForm(value,item.label)">{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <!-- switch -->
        <el-switch v-if="item.type == 'switch'" v-model="item.value" :active-color="item.activeColor" :inactive-color="item.inactiveColor" :disabled="item.disabled" :readonly="item.readonly" :width="item.width" :active-icon-class="item.activeIconClass" :inactive-icon-class="item.inactiveIconClass" :active-text="item.activeText" :inactive-text="item.inactiveText" :active-value="item.activeValue" :inactive-value="item.inactiveValue" :name="item.name" :validate-event="item.validateEvent" @change="(value)=>updateForm(value,item.label)" :style="item.inputStyle">
      </el-switch>
         <!-- 带输入建议 -->
        <el-autocomplete v-model="item.value"  :fetch-suggestions="querySearch" :clearable="item.clearable == undefined?true:item.clearable" :size="inputSize" :style="item.inputStyle" v-if="item.type=='autocomplete'" @select="handleSelect"  @change="(value)=>updateForm(value,item.label)" @focus="focusEvent(item.label)" :disabled="item.disabled" :readonly="item.readonly" ></el-autocomplete>

        <el-date-picker type="date" v-model="item.value" :size="inputSize" :format="item.format" :value-format="item.valueFormat" :disabled="item.disabled" :readonly="item.readonly" v-if="item.type=='date'" :style="item.inputStyle" :picker-options="item.pickerOptions" @change="(value)=>updateForm(value,item.label)" :clearable="item.clearable == undefined?true:item.clearable" format="yyyy-MM-dd" value-format="yyyy-MM-ddThh:mm:ss" @focus="focusEvent(item.label)"></el-date-picker>
        <!-- textarea -->
        <el-input v-model="item.value" :size="inputSize" type="textarea" :clearable="item.clearable == undefined?true:item.clearable" :rows="item.rows"  @change="(value)=>updateForm(value,item.label)" v-if="item.type=='textarea'" :style="item.inputStyle" @focus="focusEvent(item.label)" :disabled="item.disabled" :readonly="item.readonly"></el-input>
        
        <el-input-number class="formNumber" v-model="item.value" :clearable="item.clearable == undefined?true:item.clearable" :size="inputSize" @change="(value)=>updateForm(value,item.label)" v-if="item.type=='inputNumber'" :min="item.min" :max="item.max" label="item.label" :style="item.inputStyle" :controls="false" :precision="item.precision" @focus="focusEvent(item.label)" :disabled="item.disabled" :readonly="item.readonly" @keyup.up.native="backUp" @keyup.down.native="backDown">
        </el-input-number>
        <!-- 混合输入框 -->
        <el-input :placeholder="item.placeholder" v-model="item.value" :clearable="item.clearable == undefined?true:item.clearable" @change="(value)=>updateForm(value,item.label)" v-if="item.type=='mixInput'"  :style="item.inputStyle" :size="inputSize" @click.native="itemClick" :name="item.prop" :disabled="item.disabled" :readonly="item.readonly" @focus="focusEvent(item.label)">
            <el-button @click="mixInputButtonEvent(item.label)" slot="append" icon="el-icon-search" :disabled="item.buttonDisabled"></el-button>
          </el-input>
      </el-form-item>

      <el-form-item  v-if="formItems.additionButtons" :style="formItems.additionButtons.style">
        <cool-button-group :buttons="formItems.additionButtons.buttons" @button-click="buttonsevent" />
      </el-form-item>

       <slot name="formSlot" ></slot>
    </el-form>
  </div>
</template>

<script>
  // import buttonsGroup from './cool-button.vue'
  import coolFormMixin from '../../mixins/coolFormMixin.js'
  import formPropsMixin from '../../mixins/formPropsMixin.js'
const component = {
    name: 'form-view',
    mixins:[coolFormMixin,formPropsMixin],
    props:{
      inputSize: {
        type:String,
        default:'mini'
      }
    },
    data() {
      return {
        labelData:''
      }
    },
    mounted() {
      this.updateForm()
    },
    methods:{
      updateForm(arg,label) {
        // this.$nextTick(()=>{
          var obj = {}
          if(this.formItems.hasOwnProperty('form')){
            this.formItems.form.forEach(p => {
            obj[p.name] = p.value
            })
          }
          console.log(obj)
          this.$emit('update-form', obj,arg,label)
        // })
      },
      validateForm(){
        let judge=undefined
        // console.log(this.$refs.ruleForm)
        this.$refs.ruleForm.validate((valid) => {
          return judge=valid
         })
         return judge
      },
      clearForm(){
        this.$refs.ruleForm.clearValidate()
      },
      resetForm(){
        this.$refs.ruleForm.resetFields()
      }
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

</style>

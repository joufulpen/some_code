<template>
<el-container>
  <el-header height="auto">
    <div style="padding:15px" v-if="showHeader">
      <el-button type="success" @click="saveBtn">保 存</el-button>
      <el-button @click="returnBtn">返 回</el-button>
    </div>
  </el-header>
  <el-main style="padding:15px 20px 0 20px">
    <div v-if="hdrFormItems">
      <span v-if="hdrTitle" style="font-size:16px;vertical-align: middle;font-weight:bold">{{hdrTitle}}</span>
      <cool-form-view ref="hdrForm" :form-items="hdrFormItems" @update-form="updateHdrForm" size="mini" :inline="true" :label-width="hdrLabelWidth" @input-button-event="inputBtnEvent"></cool-form-view>
    </div>
    <div v-if="multiHdrFormItems" v-for="item in multiHdrFormItems" :key="item.index">
      <!-- style="margin-bottom:5px" -->
      <span style="font-size:16px;vertical-align: middle;font-weight:bold">{{item.title}}</span>
      <cool-form-view ref="multiHdrForm" :form-items="item.formItems" @update-form='updateHdrForm' size="mini" :inline="true" :label-width="hdrLabelWidth"></cool-form-view>
    </div>
    <el-divider></el-divider>
    <div style="height:100%">
      <span v-if="dtlTitle" style="font-size:16px;vertical-align: middle;font-weight:bold">{{dtlTitle}}</span>
      <cool-button-group v-if="dtlButtons" :buttons="dtlButtons" @button-click="buttonsevent"></cool-button-group>
      <cool-form-view ref="dtlForm" :form-items="dtlFormItems" @update-form="updateDtlForm" size="mini" :inline="true" :label-width="dtlLabelWidth" style="margin-bottom:5px" @button-click="buttonClick" @keyup-enter="keyEnter"></cool-form-view>
      <cool-table-view ref="table" :data="dtlTable.data" :columns="dtlTable.columns" :cell-style="dtlTable.cellRow" stripe @table-selection-change="selectionChange" @table-row-click="tableRowClick"></cool-table-view>
    </div>
  </el-main>
  <!-- <el-footer height="auto">
    <div style="padding:15px">
      <el-button type="success">保 存</el-button>
      <el-button>返 回</el-button>
    </div>
  </el-footer> -->
</el-container>
</template>

<script>
import dayjs from 'dayjs'
import bus from '@/utils/bus'
const component = {
  name: 'edit-view',
  props: {
    showHeader: Boolean,
    hdrTitle: String,
    dtlTitle: String,
    hdrLabelWidth: String,
    dtlLabelWidth: String
  },
  data: function() {
    return {
      dtlButtons: [],
      hdrFormItems: {},
      multiHdrFormItems: [],
      dtlFormItems: {},
      dtlTable: {}
    }
  },
  install: (Vue, options) =>
    Vue.component(
      (options ? options.prefix : '') + component.name,
      component,
    ),
  created() {
    for (let i in window.coolLocals) {
      for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
      }
    }
  },
  methods: {
    buttonsevent(arg) {
      let action = arg.data.$vnode.data.key
      console.log(action)
      if (typeof this[action] == 'function') this[action].call(this, arg)
      else this.$emit(action, arg)
    },
    updateHdrForm(obj, arg, label) {
      this.$emit('update-hdr-form', obj, arg, label)
    },
    updateDtlForm(obj, arg, label) {
      this.$emit('update-dtl-form', obj, arg, label)
    },
    selectionChange(arg) {
      this.$emit('selection-change', arg)
    },
    inputBtnEvent(arg) {
      this.$emit('input-button-event', arg)
    },
    buttonClick(arg) {
      let action = arg.data.$vnode.data.key
      this.$emit(action, arg)
    },
    keyEnter(arg) {
      this.$emit('keyup-enter', arg)
    },
    tableRowClick(arg) {
      this.$emit('row-click', arg)
    },
    saveBtn() {
      this.$emit('save-btn')
    },
    returnBtn() {
      this.$emit('return-btn')
    },
  }
}
export default component
</script>


<style scoped>

</style>

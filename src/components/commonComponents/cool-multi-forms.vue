<template lang="html">
  <div style="margin-bottom:15px" v-for="item in orderFormItems" :key="item.index">
    <span style="font-size:16px;vertical-align: middle;font-weight:bold">{{item.title}}</span>
    <cool-form-view ref="hdrForm" :form-items="item.formItems" @update-form='updateForm' size="mini" :inline="true" label-width="100px"></cool-form-view>
  </div>
</template>

<script>
const component = {
  name:'multi-forms',
  props:{
    orderFormItems: Array
  },
  install: (Vue, options) =>
      Vue.component(
          (options ? options.prefix : '') + component.name,
          component,
      ),
}
export default component
</script>

<style lang="css" scoped>
</style>

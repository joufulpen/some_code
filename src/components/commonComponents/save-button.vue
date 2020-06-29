<template>
     <!-- <el-footer height="auto">
        <div style="padding:15px 0px"> -->
        <!-- <el-row  style="float:right;"> -->
        <div >
          <el-button :icon="saveBtnIcon" @click="saveEvent" id="JUSTSAVE" :size="BtnSize" :type="saveBtnType" @keydown.native="keyDownEvent" @keyup.native="keyUpEvent"  :disabled="saveBtnDisabled" plain>{{saveBtnText}}</el-button>
          <el-button style="margin-left: 60px" :icon="backBtnIcon" id="JUSTBACK" @click="backEvent" :size="BtnSize" @keydown.native="keyDownEvent" @keyup.native="keyUpEvent" :type="backBtnType">{{backBtnText}}</el-button>
        </div>
        <!-- </el-row> -->
        <!-- </div>
      </el-footer> -->
</template>

<script>
	import saveButtonMixin from '../../mixins/saveButtonMixin.js'
	const component = {
		name: 'save-button',
		mixins:[saveButtonMixin],
		methods:{
			backEvent(){
				this.$emit('back-event')
			},
			saveEvent(){
				this.$emit('save-event')
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

<style>

</style>

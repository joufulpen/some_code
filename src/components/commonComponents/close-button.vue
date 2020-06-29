<template>
	 <el-button-group style="float: right">
            <el-button  :style="btnStyle" :size="btnSize" icon="el-icon-d-caret" @click="collapsedClicked"></el-button>
            <el-button
                   :style="btnStyle" :size="btnSize"
                    icon="el-icon-tickets"
                    type="primary"
                    @click="maxmizeClicked"
                ></el-button>
            <el-button :style="btnStyle" :size="btnSize" icon="el-icon-close" :type="closeBtnType" @click="backEvent"></el-button>
     </el-button-group>
</template>

<script>
	import closeButtonMixin from '../../mixins/closeButtonMixin.js'
	const component = {
		name: 'close-button',
		mixins:[closeButtonMixin],		  	
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
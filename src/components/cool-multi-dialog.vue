<template>
	<div>
		<template v-for="dialog in dialogs">
            <cool-dialogs class="rawdialog" :name="dialog.name" :id="dialog.id" :visible.sync="dialog.visible" :fullscreen.sync="dialog.fullscreen" :collapsed.sync="dialog.collapsed" :width="dialog.width"  :title="dialog.title" :src.sync="dialog.src" :top="dialog.top"  @closedialog="closedialog(dialog.name)" :backBtnIcon="dialog.backBtnIcon" :saveBtnIcon="dialog.saveBtnIcon" :BtnSize="dialog.BtnSize" :backBtnText="dialog.backBtnText" :saveBtnText="dialog.saveBtnText" :backBtnType="dialog.backBtnType" :saveBtnType="dialog.saveBtnType" :showSaveButton="dialog.showSaveButton" :saveBtnDisabled="dialog.saveBtnDisabled" @back-event="backEvent"  @save-event="saveEvent" :before-close="beforeClose" ></cool-dialogs>
    	</template>
	</div>
</template>

<script>
	import coolMultiDialogMixin from '../mixins/coolMultiDialogMixin.js'
	const component = {
		name: 'multi-dialog',
		mixins: [coolMultiDialogMixin],
		components: {
		},
		props: {
		    dialogs: Array
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

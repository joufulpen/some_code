import Vue from 'vue'
import './plugins/axios'
import './plugins/element.js'
import App from './App.vue'
import './assets/common.css'


// 全局引入组件
import coolButton from './components/commonComponents/cool-button.vue'
import coolForm from './components/commonComponents/cool-form.vue'
import coolQuery from './components/commonComponents/cool-query.vue'
import coolTable from './components/commonComponents/cool-table.vue'
import coolPageTable from './components/commonComponents/cool-page-table.vue'
import closeButton from './components/commonComponents/close-button.vue'
import saveButton from './components/commonComponents/save-button.vue'
import coolPagination from './components/commonComponents/cool-pagination.vue'
import coolDialog from './components/commonComponents/cool-dialog.vue'
import multiDialog from './components/cool-multi-dialog.vue'
import coolMasterSlaveTable from './components/cool-master-slave-table.vue'
import coolMasterView from './components/cool-master-views.vue'
import coolSingleView from './components/cool-single-view.vue'
import coolSingleDialog from './components/cool-single-dialog.vue'
// import coolMasterDialog from './components/cool-master-dialog.vue'

const MODULE_ARRAY = [ 
					  coolButton,
					  coolForm,
					  coolQuery,
					  coolTable,
					  coolPageTable,
					  closeButton,
					  saveButton,
					  coolPagination,
					  multiDialog,
					  coolDialog,
					  coolMasterSlaveTable,
					  coolMasterView,
					  coolSingleView,
					  coolSingleDialog,
					  // coolMasterDialog
					 ]

MODULE_ARRAY.map(item=>{
	Vue.component(`cool-${item.name}`,item)
})

   
new Vue({
    render: h => h(App),
}).$mount('#app')
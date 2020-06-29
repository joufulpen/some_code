/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2020-06-29 10:40:22
 * @version $Id$
 */
const coolMultiDialogMixin = {
	methods: {
		    closedialog(name) {
		      this.$emit('closedialog',name)
		    },
		     backEvent(){
		        this.$emit('back-event')
		    },
		    saveEvent(){
		      this.$emit('save-event')
		    },
		    beforeClose(){
		    	this.$emit('before-close')
		    }
		  }
}

export default coolMultiDialogMixin

/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-05-28 17:24:26
 * @version $Id$
 */

const coolFormMixn ={
	  methods: {
	    mixInputButtonEvent(label){
	      this.$emit('input-button-event',label)
	    },
	    itemClick(ev) {
	      this.$emit('click-events', ev)
	    },
	    focusEvent(arg){
	      this.labelData = arg
	       this.$emit('focus-event', arg)
	    },
	    querySearch(queryString, cb) {
	      this.$emit('query-search', queryString, cb ,this.labelData)
	    },
	    handleSelect(item) {
	      this.$emit('select', item)
	      this.updateForm()
	    },
	    enterEvent(arg){
	      this.$emit('keyup-enter',arg)
	    },
	    tabEvent(arg){
	    	this.$emit('tab-event',arg)
	    },
	    backUp(arg){
	      this.$emit('keyup-up',arg)
	    },
	    backDown(arg){
	      this.$emit('keyup-down',arg)
	    },
	    keyDownEvent(arg){
        this.$emit('key-down-event',arg)
        },
	    keyUpEvent(arg){
	      this.$emit('key-up-event',arg)
	      },
	    buttonsevent(arg){
	      this.$emit('button-click',arg)
	    },
		remoteMethod(query,label){
	      this.$emit('remote-method', query, label)
	    },
	  }
}
export default coolFormMixn

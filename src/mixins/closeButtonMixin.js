/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-05-30 16:21:19
 * @version $Id$
 */
const closeButtonMixin = {
	props:{
			btnStyle:{
				type:String,
				default:'width:24px; padding:4px;'
			},
			btnSize:{
				type:String,
				default:'mini'
			},
			closeBtnType:{
				type:String,
				default:'danger'
			}
		},
	data:function(){
	  		return{
	  			collapsed:false,
	  			fullscreen:false
	  		}
	  	},    
	methods: {
	 	collapsedClicked: function() {
    		this.collapsed = !this.collapsed
  			this.$emit('update-collapsed') //emit for sync
		 },
		 maxmizeClicked: function() {
            this.fullscreen = !this.fullscreen
            this.collapsed = false
            this.$emit('update-fullscreen') 
        },
		 backEvent(){
		 	this.$emit('back-event')
		 }  
	}
}
export default closeButtonMixin
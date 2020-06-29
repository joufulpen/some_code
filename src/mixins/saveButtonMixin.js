/**
 *
 * @authors Your Name (you@example.org)
 * @date    2019-05-30 17:53:28
 * @version $Id$
 */
const saveButtonMixin = {
    props:{
        backBtnIcon:{
        	type:String
        },
        saveBtnIcon:{
        	type:String
        },
        BtnSize:{
        	type:String,
        	default:'medium'
        },
        backBtnText:{
        	type:String,
        	default:'返回'
        },
        saveBtnText:{
        	type:String,
        	default:'保存'
        },
        backBtnType:String,
        saveBtnType:{
                type:String,
                default:'success'
        },
        saveBtnDisabled: [Boolean, Function]
   },
   methods:{
    keyDownEvent(arg){
            this.$emit('key-down-event',arg)
            },
    keyUpEvent(arg){
            this.$emit('key-up-event',arg)
            },
   }
}
export default saveButtonMixin

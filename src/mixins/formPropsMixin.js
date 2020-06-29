/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2020-06-28 10:49:01
 * @version $Id$
 */

const formPropsMixin = {
	props:{
	  formItems: {
        type:[Object,Array],
        default:function(){
          return {} || []
        }
      },
      size: String,
      inline: Boolean,
      labelWidth: String,
      rules: Object,
      labelPosition: String,
      labelSuffix:String,
      hideRequiredAsterisk:Boolean,
      showMessage:Boolean,
      inlineMessage:Boolean,
      statusIcon:Boolean,
      validateOnRuleChange:Boolean,
      disabled:Boolean
	}
}

export default formPropsMixin
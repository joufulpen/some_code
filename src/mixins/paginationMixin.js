/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-05-27 11:03:45
 * @version $Id$
 */
 const paginationgMixin = {
 	props: {
	    //pagination分页
	    // showPage:{
	    // 	type:Boolean,
	    // 	default:true
	    // },
	    paginationClass: String,
    	paginationStyle: String,
	    pageSize: {
	      type: Number,
	      default: 10
	    },
	    total: Number,
	    pageCount: Number,
	    currentPage: {
	      type: Number,
	      default: 1
	    },
	    layout: {
	      default: 'total, sizes, prev, pager, next, jumper'
	    },
	    pageSizes: {
	      type: Array,
	      default () {
	        return [10, 20, 30, 40, 50, 100]
	      }
	    },
	    popperClass: String,
	    prevText: String,
	    nextText: String,
	    background: Boolean,
	    footerPageStyle:{
	    	type:String,
	    	default:'border:1px solid #ebeef5;border-top:0px'
	    }
	},
	methods:{
		
	}
 }
export default paginationgMixin
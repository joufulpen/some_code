/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-05-27 10:05:35
 * @version $Id$
 */
const tableMixin = {
	props: {   
    // table参数
    //classes & styles
    tableClass: String,
    tableStyle: String,
    // treeProps
    treeProps:{
      type:Object,
      default: function() {
        return {children: 'children', hasChildren: 'hasChildren'}
      }
    },
    // 显示的数据
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    // loading
    vLoading: Boolean,
    // Table 的尺寸
    size: String,
    // width
    width: [String, Number],
    // height
    height: {
      type:[String, Number],
      default:'100%'
    },
    maxHeight: [String, Number],
    // 列的宽度是否自撑开
    fit: {
      type: Boolean,
      default: true
    },
    // 是否为斑马纹 table
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否带有纵向边框
    border:{
       type:Boolean,
       default: true
    },
    // 行数据的 Key
    rowKey: [String, Function],
    context: {},
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否在表尾显示合计行
    showSummary: Boolean,
    // 合计行第一列的文本
    sumText: String,
    // 自定义的合计计算方法
    summaryMethod: Function,
    // ClassName & style
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    // 是否要高亮当前行
    highlightCurrentRow: {
      type:Boolean,
      default:true
    },
    // 当前行的 key，只写属性
    currentRowKey: [String, Number],
    // 空数据时显示的文本内容，也可以通过 slot="empty" 设置
    emptyText: String,
    // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
    expandRowKeys: Array,
    // 是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效
    defaultExpandAll: Boolean,
    // 默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序
    defaultSort: Object,
    // tooltip effect 属性
    tooltipEffect: String,
    // 合并行或列的计算方法
    spanMethod: Function,
    //columns
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    }
}
export default tableMixin

<template>
    <div>
      <el-row>
        <el-col> 
          <el-button-group v-if="buttons.length" ref="buttonGroup">
            <template>
            <el-button v-for="button in normalButtons" :type="button.type" :size="button.size ? button.size : buttonSize"  :native-type="button.nativeType" :loading="button.loading" :disabled="button.disabled" :plain="button.plain ? button.plain : buttonPlain"
              :autofocus="button.autofocus" :round="button.round ? button.round : buttonRound" :key="button.key" style="border:none">
              <!-- :icon="button.icon" 图标替换成矢量库的图标-->
              <svg v-if="button.icon" class="icon" aria-hidden="true" style="font-size: 14px;margin-right:5px">
                <use :xlink:href="button.icon"></use>
                </svg>
                {{button.text}}
            </el-button>
            </template>
            <el-dropdown v-for="button in dropdownButtons" :key="button.text" v-show="button.dropdownModule.length" trigger="click" @command="handleCommand">
              <el-button  :type="button.type" :size="button.size ? button.size : buttonSize" :icon="button.icon" :native-type="button.nativeType" :loading="button.loading" :disabled="button.disabled" :plain="button.plain ? button.plain : buttonPlain"
              :autofocus="button.autofocus" :round="button.round ? button.round : buttonRound" :key="button.key" style="border:none" >
                <i class="el-icon-arrow-down el-icon--right" ></i>{{button.text}}
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="btn in button.dropdownModule" :key="btn.text" :command="btn.command">{{btn.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
          <slot name="buttonSlot" >
          </slot>
        </el-col>
      </el-row> 
</div>
</template>

<script>
const component = {
    name: 'button-group',
    props: {
      buttons: {
        type:Array,
        default:function(){
          return []
        }
      },
	    buttonSize: String,
	    buttonPlain: Boolean,
	    buttonRound: Boolean

    },
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
  mounted: function() {
    setTimeout(this.registerEvents, 100)
  },
  computed:{
    normalButtons(){
      return this.buttons.filter(b=>!b.dropdownModule)
    },
    dropdownButtons(){
      return this.buttons.filter(b=>b.dropdownModule)
    }
  },
  methods: {
    handleCommand(arg){
      // console.log(arg)
      this.$emit('handle-command',arg)
    },
    redirectEvents: function(source, target, events, prefix) {
      events.forEach(function(event) {
        source.$on(event, function(args) {
          args.data = source
          target.$emit(prefix + event, args)
        })
      })
    },
    registerEvents: function() {
      // console.log(this.$refs.buttonGroup)
      if (this.$refs.buttonGroup) {
        var buttons = this.$refs.buttonGroup.$children
        // console.log(buttons)
        var buttonEvents = ['click']
        buttons.forEach(p => {
          this.redirectEvents(p, this, buttonEvents, 'button-')
        })
      }
    },
  }
}

export default component
</script>

<style scoped>

</style>
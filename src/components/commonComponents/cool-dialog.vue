<template>
    <el-dialog
        :top.sync="top"
        :visible.sync="visible"
        :fullscreen.sync="fullscreen"
        :width="width"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :show-close="false"
        @close="closedialog"
        append-to-body
        :before-close="beforeClose"
    >
        <div slot="title">
            {{title}}
            <cool-close-button
                ref="closeButton"
                @update-collapsed="collapsedClicked"
                @update-fullscreen="maxmizeClicked"
                @back-event="backEvent"
                :btnStyle="btnStyle"
                :btnSize="btnSize"
                :closeBtnType="closeBtnType"
            />
        </div>
        <el-collapse-transition>
            <div v-show="!collapsed"  style="overflow: hidden;border:1px solid #DCDFE6;">
                <slot name="dialogSlot"></slot>
                <iframe v-if="src"
                    ref="iframe"
                    :src="src"
                    :id="name"
                    :style="{'width':'100%','border':'none','height':(fullscreen?'90vh':'80vh'),'vertical-align':'bottom'}"
                ></iframe>
            </div>
        </el-collapse-transition>
        <div slot="footer">
            <transition name="el-fade-in-linear">
                <div v-show="!collapsed">
                    <cool-save-button
                        v-if="showSaveButton"
                        ref="saveButton"
                        :backBtnIcon="backBtnIcon"
                        :saveBtnIcon="saveBtnIcon"
                        :BtnSize="BtnSize"
                        :backBtnText="backBtnText"
                        :saveBtnText="saveBtnText"
                        :backBtnType="backBtnType"
                        :saveBtnType="saveBtnType"
                        :saveBtnDisabled="saveBtnDisabled"
                        @back-event="backEvent"
                        @save-event="saveEvent"
                    />
                </div>
            </transition>
        </div>
    </el-dialog>
</template>

<script>
import saveButtonMixin from '../../mixins/saveButtonMixin.js'
import closeButtonMixin from '../../mixins/closeButtonMixin.js'
const component = {
    name: 'dialogs',
    mixins: [saveButtonMixin,closeButtonMixin],
    install: (Vue, options) =>
        Vue.component(
            (options ? options.prefix : '') + component.name,
            component,
        ),
    props: {
        name: String,
        visible: Boolean,
        width: String,
        title: String,
        src: String,
        top: String,
        showSaveButton: {
            type: Boolean,
            default: false,
        },
    },    
    methods:{
        closedialog() {
            console.log('esc')
            this.collapsed = false
            this.fullscreen = false
            this.$emit('closedialog')
        },
        backEvent() {
            this.collapsed = false
            this.fullscreen = false
            this.$emit('back-event')
        },
        saveEvent() {
            this.collapsed = false
            this.fullscreen = false
            this.$emit('save-event')
        },
        beforeClose() {
            this.$emit('before-close')
        }
    }  
}

export default component
</script>

<style scoped>
</style>

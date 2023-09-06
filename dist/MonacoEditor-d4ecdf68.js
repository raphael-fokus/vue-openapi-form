"use strict";var e=require("vue");function t(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(i){if("default"!==i){var o=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(t,i,o.get?o:{enumerable:!0,get:function(){return e[i]}})}})),t.default=e,Object.freeze(t)}var i=t(require("monaco-editor")),o=e.defineComponent({name:"MonacoEditor",props:{diffEditor:{type:Boolean,default:!1},width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"100%"},original:String,value:String,language:{type:String,default:"javascript"},theme:{type:String,default:"vs"},options:{type:Object,default:()=>({})}},emits:["editorWillMount","editorDidMount","change"],setup(t){const{width:i,height:o}=e.toRefs(t);return{style:e.computed((()=>({width:i.value.toString().includes("%")?i.value:`${i.value}px`,height:o.value.toString().includes("%")?o.value:`${o.value}px`,"text-align":"left"})))}},mounted(){this.initMonaco()},beforeUnmount(){this.editor&&this.editor.dispose()},methods:{initMonaco(){this.$emit("editorWillMount",this.monaco);const{value:e,language:t,theme:o,options:r}=this;this.editor=i.editor[this.diffEditor?"createDiffEditor":"create"](this.$el,{value:e,language:t,theme:o,...r}),this.diffEditor&&this._setModel(this.value,this.original);const n=this._getEditor();n.onDidChangeModelContent((e=>{const t=n.getValue();this.value!==t&&this.$emit("change",t,e)})),this.$emit("editorDidMount",this.editor)},_setModel(e,t){const{language:o}=this,r=i.editor.createModel(t,o),n=i.editor.createModel(e,o);this.editor.setModel({original:r,modified:n})},_setValue(e){let t=this._getEditor();if(t)return t.setValue(e)},_getValue(){let e=this._getEditor();return e?e.getValue():""},_getEditor(){return this.editor?this.diffEditor?this.editor.getModifiedEditor():this.editor:null},_setOriginal(){const{original:e}=this.editor.getModel();e.setValue(this.original)}},watch:{options:{deep:!0,handler(e){this.editor.updateOptions(e)}},value(){this.value!==this._getValue()&&this._setValue(this.value)},original(){this._setOriginal()},language(){if(this.editor)if(this.diffEditor){const{original:e,modified:t}=this.editor.getModel();i.editor.setModelLanguage(e,this.language),i.editor.setModelLanguage(t,this.language)}else i.editor.setModelLanguage(this.editor.getModel(),this.language)},theme(){i.editor.setTheme(this.theme)}}});o.render=function(t,i,o,r,n,a){return e.openBlock(),e.createElementBlock("div",{class:"monaco-editor-vue3",style:e.normalizeStyle(t.style)},null,4)},exports.default=o;
import{m as e,v as a,a as t,b as l,_ as n}from"./entry-9c9aadaa.js";import{t as s}from"./tabs-95f48e51.js";import{s as r}from"./size-d02f66d9.js";import{defineComponent as o,defineAsyncComponent as i,resolveComponent as u,resolveDirective as m,openBlock as d,createElementBlock as c,normalizeClass as p,createElementVNode as f,createTextVNode as v,toDisplayString as h,createVNode as w,Fragment as y,renderList as b,withDirectives as V,withModifiers as k,createBlock as D,withCtx as g,createCommentVNode as C}from"vue";var x=o({name:"ArrayInput",components:{ArrayInputItems:i((function(){return import("./ArrayInputItems-025c34a4.js").then((function(e){return e.default}))}))},mixins:[e,s,a,r],props:{schema:{type:Object,default:function(){return{}}},fieldName:{type:String,default:""},modelValue:{type:null,default:function(){return[]}},errors:{type:Object,default:function(){return{}}},isLastChild:{type:Boolean,default:!1}},data:function(){return{newData:null,updatePass:0}},computed:{items:function(){return this.schema.items||{}}},methods:{swapElems:function(e,a){var t=JSON.parse(JSON.stringify(this.modelData[e]));this.modelData[e]=JSON.parse(JSON.stringify(this.modelData[a])),this.modelData[a]=t,this.updatePass+=1},addNewValue:function(e){var a=this;return t(l().mark((function t(){var n;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e();case 2:n=t.sent,n.valid&&(a.modelData.push(a.newData),a.newData=null,a.updatePass+=1);case 5:case"end":return t.stop()}}),t)})))()},deleteValue:function(e){this.modelData.splice(e,1),this.updatePass+=1}}}),U={class:"nested-header mb-5"},j={class:"is-flex is-semi-normal"},I=f("div",{class:"collaps-icon is-disabled"},[f("i",{class:"fa fa-minus"})],-1),N={key:0,class:"is-flex gap-16 is-flex-direction-column"},O={class:"form-right-item"},S={class:"buttons",style:{gap:"4px"}},J=["disabled","onClick"],M=[f("span",{class:"icon is-small"},[f("i",{class:"fa fa-angle-up"})],-1)],_=["disabled","onClick"],A=[f("span",{class:"icon is-small"},[f("i",{class:"fa fa-angle-down"})],-1)],L=["onClick"],P=[f("span",{class:"icon"},[f("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[f("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})])],-1)],T={class:"value-list-save"},E=["onClick"],B=[f("div",{class:"icon"},[f("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[f("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 4.5v15m7.5-7.5h-15"})])],-1)];x.render=function(e,a,t,l,s,r){var o=u("component-errors"),i=u("tabs"),x=u("array-input-items"),q=u("object-form-wrapper"),z=u("v-field"),F=u("key-value-pairs"),H=u("array-input",!0),G=u("simple-input"),K=u("v-form"),Q=u("yaml-form"),R=u("json-form"),W=m("tooltip");return d(),c("div",{as:"div",class:p(["ac-nested-elements vue-schema-form-array array-input",{"stop-line":e.isLastChild}])},[f("div",U,[f("h6",j,[I,v(" "+h(e.schema.title||"Array Item Description")+" ",1),w(o,{errors:e.calcFormErrors(e.errors,e.fieldName)},null,8,["errors"])]),w(i,{modelValue:e.activeTab,"onUpdate:modelValue":a[0]||(a[0]=function(a){return e.activeTab=a})},null,8,["modelValue"])]),"form"===e.activeTab?(d(),c("div",N,[(d(!0),c(y,null,b(e.modelData,(function(a,t){return d(),c("div",{key:"".concat(t,"-").concat(e.schema.title,"-form"),class:"nested-body"},[w(x,{"field-name":e.fieldName,items:e.items,schema:e.schema,index:t,"model-value":JSON.parse(JSON.stringify(e.modelData)),errors:e.errors,"reference-model":e.referenceModel||[]},null,8,["field-name","items","schema","index","model-value","errors","reference-model"]),f("div",O,[f("div",S,[f("div",{class:p(["buttons up-down-buttons",{"is-small":!e.isMedium}])},[V((d(),c("button",{class:p(["up-down-button",{"is-primary":0!==t}]),disabled:0===t,onClick:k((function(a){return e.swapElems(t-1,t)}),["prevent"])},M,10,J)),[[W,{content:"move up",placement:"top",classes:["is-primary"],targetClasses:["up-down-button"]}]]),V((d(),c("button",{class:p(["up-down-button",{"is-primary":t!==e.modelData.length-1}]),disabled:t===e.modelData.length-1,onClick:k((function(a){return e.swapElems(t,t+1)}),["prevent"])},A,10,_)),[[W,{content:"move down",placement:"bottom",classes:["is-primary"],targetClasses:["up-down-button"]}]])],2),f("button",{class:"button ac-button is-medium is-danger is-outlined mb-0",onClick:k((function(a){return e.deleteValue(t)}),["prevent"])},P,8,L)])])])})),128)),(d(),D(K,{key:e.updatePass,as:""},{default:g((function(t){var l=t.validate,s=t.errors;return[f("div",T,["object"===e.items.type?(d(),D(z,{key:0,modelValue:e.newData,"onUpdate:modelValue":a[1]||(a[1]=function(a){return e.newData=a}),rules:e.ruleObject(!0),name:"newItem",label:"".concat(e.schema.title," new value"),as:""},{default:g((function(a){var t=a.field,l=a.handleChange;return[w(q,{"field-name":"newItem","model-value":t.value,"is-last-child":!0,"expand-form":!0,"is-self-required":!0,schema:n(n({},e.items),{title:"".concat(e.schema.title," new value")}),type:e.items.type,errors:s,"reference-model":{},"onUpdate:modelValue":l},null,8,["model-value","schema","type","errors","onUpdate:modelValue"])]})),_:2},1032,["modelValue","rules","label"])):"key-value-pairs"===e.items.type?(d(),D(z,{key:1,modelValue:e.newData,"onUpdate:modelValue":a[2]||(a[2]=function(a){return e.newData=a}),rules:e.ruleObject(!0),name:"newItem",label:"".concat(e.schema.title," new value"),as:""},{default:g((function(a){var t=a.field,l=a.handleChange;return[w(F,{"field-name":"newItem","model-value":t.value,"is-last-child":!0,schema:n(n({},e.items),{title:"".concat(e.schema.title," new value")}),errors:s,type:e.items.type,"reference-model":{},"onUpdate:modelValue":l},null,8,["model-value","schema","errors","type","onUpdate:modelValue"])]})),_:2},1032,["modelValue","rules","label"])):"array"===e.items.type?(d(),D(z,{key:2,modelValue:e.newData,"onUpdate:modelValue":a[3]||(a[3]=function(a){return e.newData=a}),rules:e.ruleArray(!0),name:"newItem",label:"".concat(e.schema.title," new value"),as:""},{default:g((function(a){var t=a.field,l=a.handleChange;return[w(H,{"field-name":"newItem","model-value":t.value,"is-last-child":!0,schema:n(n({},e.items),{title:"".concat(e.schema.title," new value")}),errors:s,type:e.items.type,"reference-model":[],"onUpdate:modelValue":l},null,8,["model-value","schema","errors","type","onUpdate:modelValue"])]})),_:2},1032,["modelValue","rules","label"])):(d(),D(z,{key:3,modelValue:e.newData,"onUpdate:modelValue":a[4]||(a[4]=function(a){return e.newData=a}),rules:e.ruleString(!0),name:"newItem",label:"".concat(e.schema.title," new value"),as:""},{default:g((function(a){var t=a.field,l=a.handleChange,s=a.errors,r=a.meta;return[w(G,{"model-value":t.value,schema:n(n({},e.items),{title:"".concat(e.schema.title," new value")}),required:!0,type:e.items.type,"validation-ob":n({errors:s},r),"reference-model":"","onUpdate:modelValue":l},null,8,["model-value","schema","type","validation-ob","onUpdate:modelValue"])]})),_:1},8,["modelValue","rules","label"])),f("button",{class:"button ac-button is-medium is-primary is-outlined",onClick:k((function(a){return e.addNewValue(l)}),["prevent"])},B,8,E)])]})),_:1}))])):"yaml"===e.activeTab?(d(),D(Q,{key:1,modelValue:e.modelData,"onUpdate:modelValue":a[5]||(a[5]=function(a){return e.modelData=a}),"reference-model":e.referenceModel||[]},null,8,["modelValue","reference-model"])):"json"===e.activeTab?(d(),D(R,{key:2,modelValue:e.modelData,"onUpdate:modelValue":a[6]||(a[6]=function(a){return e.modelData=a}),"reference-model":e.referenceModel||[]},null,8,["modelValue","reference-model"])):C("",!0)],2)};export{x as default};
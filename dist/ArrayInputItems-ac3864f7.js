"use strict";var e=require("./entry-9732a413.js"),a=require("vue"),l=a.defineComponent({name:"ArrayInputItems",mixins:[e.m,e.v],props:{items:{type:Object,default:function(){return{}}},schema:{type:Object,default:function(){return{}}},index:{type:Number,default:0},modelValue:{type:null,default:function(){return[]}},fieldName:{type:String,default:""},errors:{type:Object,default:function(){return{}}}}}),t={class:"form-left-item"};l.render=function(l,n,o,r,d,c){var m=a.resolveComponent("object-form-wrapper"),i=a.resolveComponent("v-field"),u=a.resolveComponent("key-value-pairs"),s=a.resolveComponent("array-input"),f=a.resolveComponent("simple-input");return a.openBlock(),a.createElementBlock("div",t,["object"===l.items.type?(a.openBlock(),a.createBlock(i,{key:0,modelValue:l.modelData[l.index],"onUpdate:modelValue":n[0]||(n[0]=function(e){return l.modelData[l.index]=e}),rules:l.ruleObject(!0),name:"".concat(l.fieldName,"/").concat(l.index+1),label:"".concat(l.schema.title," ").concat(l.index+1),as:""},{default:a.withCtx((function(t){var n=t.field,o=t.handleChange;return[a.createVNode(m,{"field-name":"".concat(l.fieldName,"/").concat(l.index+1),"model-value":n.value,schema:e._(e._({},l.items),{title:"".concat(l.schema.title," ").concat(l.index+1)}),"is-self-required":!0,type:l.items.type,errors:l.errors,"reference-model":l.referenceModel[l.index]||{},"onUpdate:modelValue":o},null,8,["field-name","model-value","schema","type","errors","reference-model","onUpdate:modelValue"])]})),_:1},8,["modelValue","rules","name","label"])):"key-value-pairs"===l.items.type?(a.openBlock(),a.createBlock(i,{key:1,modelValue:l.modelData[l.index],"onUpdate:modelValue":n[1]||(n[1]=function(e){return l.modelData[l.index]=e}),rules:l.ruleObject(!0),name:"".concat(l.fieldName,"/").concat(l.index+1),label:"".concat(l.schema.title," ").concat(l.index+1),as:""},{default:a.withCtx((function(t){var n=t.field,o=t.handleChange;return[a.createVNode(u,{"field-name":"".concat(l.fieldName,"/").concat(l.index+1),"model-value":n.value,errors:l.errors,schema:e._(e._({},l.items),{title:"".concat(l.schema.title," ").concat(l.index+1)}),type:l.items.type,"reference-model":l.referenceModel[l.index]||{},"onUpdate:modelValue":o},null,8,["field-name","model-value","errors","schema","type","reference-model","onUpdate:modelValue"])]})),_:1},8,["modelValue","rules","name","label"])):"array"===l.items.type?(a.openBlock(),a.createBlock(i,{key:2,modelValue:l.modelData[l.index],"onUpdate:modelValue":n[2]||(n[2]=function(e){return l.modelData[l.index]=e}),rules:l.ruleArray(!0),name:"".concat(l.fieldName,"/").concat(l.index+1),label:"".concat(l.schema.title," ").concat(l.index+1),as:""},{default:a.withCtx((function(t){var n=t.field,o=t.handleChange;return[a.createVNode(s,{"field-name":"".concat(l.fieldName,"/").concat(l.index+1),"model-value":n.value,schema:e._(e._({},l.items),{title:"".concat(l.schema.title," ").concat(l.index+1)}),type:l.items.type,errors:l.errors,"reference-model":l.referenceModel[l.index]||[],"onUpdate:modelValue":o},null,8,["field-name","model-value","schema","type","errors","reference-model","onUpdate:modelValue"])]})),_:1},8,["modelValue","rules","name","label"])):(a.openBlock(),a.createBlock(i,{key:3,modelValue:l.modelData[l.index],"onUpdate:modelValue":n[3]||(n[3]=function(e){return l.modelData[l.index]=e}),rules:l.ruleString(!0),name:"".concat(l.fieldName,"/").concat(l.index+1),label:"".concat(l.schema.title," ").concat(l.index+1),as:""},{default:a.withCtx((function(t){var n=t.field,o=t.handleChange,r=t.errors,d=t.meta;return[a.createVNode(f,{"model-value":n.value,schema:e._(e._({},l.items),{title:"".concat(l.schema.title," ").concat(l.index+1)}),type:l.items.type,required:!0,"validation-ob":e._({errors:r},d),"reference-model":l.referenceModel[l.index]||"","onUpdate:modelValue":o},null,8,["model-value","schema","type","validation-ob","reference-model","onUpdate:modelValue"])]})),_:1},8,["modelValue","rules","name","label"]))])},exports.default=l;
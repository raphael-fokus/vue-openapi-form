"use strict";var e=require("vue").defineComponent({props:{isSelfFolded:{type:Boolean,default:function(){return!1}},expandForm:{type:Boolean,default:function(){return!1}}},data:function(){return{isFolded:!0}},watch:{expandForm:{immediate:!0,handler:function(e){this.isFolded=!e}}},methods:{toggleFold:function(){this.isFolded=!this.isFolded}}});exports.f=e;
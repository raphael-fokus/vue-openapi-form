import{d as f,i as m,o as s,c as a,n as i,j as o,h as n,t as p}from"./index.813c5492.js";const C=["disabled","title"],g=["src","width"],y=f({__name:"Button",props:{title:{default:""},tooltip:{default:void 0},isLoaderActive:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},iconClass:{default:""},iconImage:{default:""},iconImageWidth:{default:void 0},modifierClasses:{default:"is-primary"},titleModifierClass:{default:""}},emits:["click"],setup(d,{emit:u}){const t=d,r=u,c=e=>{t.disabled||r("click",e)},l=m(()=>!!t.iconClass.includes("unplugin"));return(e,h)=>(s(),a("button",{class:i(["button ac-button",`${e.modifierClasses}${e.isLoaderActive?" is-loading":""}`]),disabled:e.disabled?!0:void 0,onClick:c,title:e.tooltip,"data-testid":"ac-create-button"},[e.iconClass||e.iconImage?(s(),a("span",{key:0,class:i(["icon is-small",l.value?e.iconClass:""])},[e.iconImage?(s(),a("img",{key:0,src:e.iconImage,alt:"icon",width:e.iconImageWidth},null,8,g)):l.value?o(e.$slots,"icon",{key:1}):(s(),a("i",{key:2,class:i(`fa fa-${e.iconClass}`),"aria-hidden":"true"},null,2))],2)):n("",!0),e.title?(s(),a("span",{key:1,class:i(e.titleModifierClass)},p(e.title),3)):n("",!0),o(e.$slots,"default")],10,C))}});export{y as default};

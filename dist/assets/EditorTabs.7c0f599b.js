import{d as l,a as s,_ as o,o as u,g as m,h as a,u as i,i as n,e as _,m as d}from"./index.190f0c2b.js";const T=l({__name:"EditorTabs",props:{activeTab:{default:""}},emits:["tabchange"],setup(f){const v=s(()=>o(()=>import("./TabsBody.01aef701.js"),["assets/TabsBody.01aef701.js","assets/index.190f0c2b.js","assets/index.b810dbe8.css"])),p=s(()=>o(()=>import("./Tabs.92cf764c.js"),["assets/Tabs.92cf764c.js","assets/Tabs.77d4955f.css","assets/index.190f0c2b.js","assets/index.b810dbe8.css"])),r=s(()=>o(()=>import("./TabItem.a354ac9d.js"),["assets/TabItem.a354ac9d.js","assets/index.190f0c2b.js","assets/index.b810dbe8.css"]));return(e,t)=>(u(),m(i(v),null,{default:a(()=>[n(i(p),{class:"is-line"},{default:a(()=>[n(i(r),{"is-active":e.activeTab==="edit"},{default:a(()=>[_("a",{onClick:t[0]||(t[0]=d(c=>e.$emit("tabchange","edit"),["prevent"]))},"Edit")]),_:1},8,["is-active"]),n(i(r),{"is-active":e.activeTab==="preview"},{default:a(()=>[_("a",{onClick:t[1]||(t[1]=d(c=>e.$emit("tabchange","preview"),["prevent"]))},"Preview Changes")]),_:1},8,["is-active"])]),_:1})]),_:1}))}});export{T as default};

import*as _ from"https://cdn.jsdelivr.net/npm/monaco-editor/+esm";import{_ as c,o as r,c as d,a as s,w as l,v as n,b as x,F as v,r as w,t as g,d as p,i as h,e as y,k}from"./index.bfed0d36.js";import"https://cdn.jsdelivr.net/npm/@feathersjs/client@5.0.0-pre.28/+esm";import"https://cdn.jsdelivr.net/npm/socket.io-client@4.5.1/+esm";const A={methods:{init(t){this.content=this.src;let e=_.editor.create(t.path[1],{value:this.content,language:this.lang||"javascript"});e.onDidChangeModelContent(()=>{this.content=e.getValue(),this.$emit("change",this.content)})}},data:()=>({content:""}),props:["src"],emits:["change"]},V={class:"editor"};function C(t,e,m,b,f,a){return r(),d("div",V,[s("img",{src:"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",onLoad:e[0]||(e[0]=(...u)=>a.init&&a.init(...u))},null,32)])}const U=c(A,[["render",C],["__scopeId","data-v-be78c74e"]]);const $={inject:["io","user"],methods:{async create(t){let e=Object.assign({},t);e.fields=e.fields?JSON.parse(e.fields):{},e.roles=e.roles?JSON.parse(e.roles):{},e.instance=new TextEncoder().encode(e.instance).buffer,e.dashboard=new TextEncoder().encode(e.dashboard).buffer,await this.io.service("types/any").create(e),this.clear(),this.list()},async list(){let t=await this.io.service("types/any").find({query:{slug:{$search:this.search},$limit:this.limit,$skip:(this.page-1)*this.limit,$sort:{createdAt:-1}}});t.data=t.data.map(e=>(e.fields&&(e.fields=JSON.stringify(e.fields)),e.roles&&(e.roles=JSON.stringify(e.roles)),e.instance=new TextDecoder().decode(e.instance),e.dashboard=new TextDecoder().decode(e.dashboard),e)),this.$emit("list"),this.response=t},async save(t){await this.io.service("types/any").patch(t._id,{title:t.title,slug:t.slug,status:t.status,fields:t.fields?JSON.parse(t.fields):{},roles:t.roles?JSON.parse(t.roles):{},instance:new TextEncoder().encode(t==null?void 0:t.instance).buffer,dashboard:new TextEncoder().encode(t==null?void 0:t.dashboard).buffer,owner:t.owner,owner_group:t.owner_group});let e=await this.io.service("types/any").get(t._id);e.fields&&(e.fields=JSON.stringify(e.fields)),e.roles&&(e.roles=JSON.stringify(e.roles)),e.instance=new TextDecoder().decode(e.instance),e.dashboard=new TextDecoder().decode(e.dashboard),Object.assign(t,e)},async remove(t){await this.io.service("types/any").remove(t._id),this.list()},clear(){this.title="",this.slug="",this.status="",this.fields="",this.roles="",this.owner="",this.owner_group=""}},created(){this.list()},computed:{types(){var t;return((t=this.response)==null?void 0:t.data)||[]}},data:()=>({title:"",slug:"",status:"",fields:"",roles:"",owner:"",owner_group:"",limit:25,page:1,response:null,search:""}),emits:["list"],components:{Editor:U}},N={style:{display:"flex",height:"100%","font-family":"Arial, Helvetica, sans-serif"}},T={style:{width:"100%","flex-grow":"1",flex:"1",height:"100%",overflow:"auto","background-color":"#edebebff"}},D={style:{"margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px"}},E=s("h2",{style:{color:"#2b2b2bff"}}," Types ",-1),O=p(),S=p(),J={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"60px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#bacad1ff"}},B={style:{display:"inline-block"}},R={style:{display:"inline-block",float:"right"}},j={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#83b5c9ff",position:"relative"}},z={style:{display:"inline-block",float:"right"}},F=["onClick"],I=["onClick"],L=p(),P={style:{display:"inline-block",width:"100%"}},H={style:{"font-size":"12px",position:"absolute",top:"5px",color:"#1c1c1cff"}},K={style:{position:"absolute",top:"5px","font-size":"12px",right:"21px",color:"#1c1c1cff"}},M=p(),q=["onUpdate:modelValue"],G=["onUpdate:modelValue"],Q=["onUpdate:modelValue"],W=["onUpdate:modelValue"],X=["onUpdate:modelValue"],Y=["onUpdate:modelValue"],Z={style:{"margin-top":"10px"}},ee=["onClick"],te=["onClick"],oe=["onClick"],se=["onClick"],ie=p(),le={key:0,style:{"padding-top":"10px"}},ne=s("label",null," Fields ",-1),ae=["onUpdate:modelValue"],re={key:1,style:{"padding-top":"10px"}},de=s("label",null," Roles ",-1),pe=["onUpdate:modelValue"],ue={key:2,style:{"padding-top":"10px"}},ge=s("label",null," Instance ",-1),he={key:3,style:{"padding-top":"10px"}},ce=s("label",null," Dashboard ",-1),me={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#bacad1ff",position:"relative","text-align":"center"}};function be(t,e,m,b,f,a){const u=k("Editor");return r(),d("div",N,[s("div",T,[s("div",D,[E,O,s("button",{type:"",onClick:e[0]||(e[0]=(...o)=>a.list&&a.list(...o)),style:{float:"right"}}," Refresh "),l(s("input",{style:{"margin-right":"5px",width:"167px",float:"right"},"onUpdate:modelValue":e[1]||(e[1]=o=>t.search=o),placeholder:"Filter",onKeydown:e[2]||(e[2]=x((...o)=>a.list&&a.list(...o),["enter"]))},null,544),[[n,t.search]])]),S,s("div",J,[s("div",B,[l(s("input",{placeholder:"title",style:{"margin-right":"5px"},"onUpdate:modelValue":e[3]||(e[3]=o=>t.title=o)},null,512),[[n,t.title]]),l(s("input",{placeholder:"slug",style:{"margin-right":"5px"},"onUpdate:modelValue":e[4]||(e[4]=o=>t.slug=o)},null,512),[[n,t.slug]]),l(s("input",{placeholder:"status",style:{"margin-right":"5px"},"onUpdate:modelValue":e[5]||(e[5]=o=>t.status=o)},null,512),[[n,t.status]]),l(s("input",{placeholder:"owner",style:{"margin-right":"5px"},"onUpdate:modelValue":e[6]||(e[6]=o=>t.owner=o)},null,512),[[n,t.owner]]),l(s("input",{placeholder:"owner group",style:{"margin-right":"5px"},"onUpdate:modelValue":e[7]||(e[7]=o=>t.owner_group=o)},null,512),[[n,t.owner_group]]),l(s("textarea",{placeholder:"fields","onUpdate:modelValue":e[8]||(e[8]=o=>t.fields=o)},null,512),[[n,t.fields]]),l(s("textarea",{placeholder:"roles","onUpdate:modelValue":e[9]||(e[9]=o=>t.roles=o)},null,512),[[n,t.roles]])]),s("div",R,[s("button",{type:"",onClick:e[10]||(e[10]=o=>a.create({title:t.title,slug:t.slug,status:t.status,fields:t.fields,roles:t.roles,owner:t.owner,owner_group:t.owner_group}))}," Create ")])]),(r(!0),d(v,null,w(a.types,o=>(r(),d("div",j,[s("div",z,[s("button",{type:"",style:{"margin-right":"10px"},onClick:i=>a.save(o)}," Save ",8,F),s("button",{type:"",onClick:i=>a.remove(o)}," Remove ",8,I)]),L,s("div",P,[s("div",null,[s("span",H," Created "+g(new Date(o.createdAt).toLocaleString()),1),s("span",K," Updated "+g(new Date(o.updatedAt).toLocaleString()),1)]),M,l(s("input",{placeholder:"title",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o.title.en=i},null,8,q),[[n,o.title.en]]),l(s("input",{placeholder:"slug",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o.slug=i},null,8,G),[[n,o.slug]]),l(s("input",{placeholder:"status",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o.status=i},null,8,Q),[[n,o.status]]),l(s("input",{placeholder:"owner",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o.owner=i},null,8,W),[[n,o.owner]]),l(s("input",{placeholder:"owner group",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o.owner_group=i},null,8,X),[[n,o.owner_group]]),l(s("input",{placeholder:"title",style:{"margin-right":"5px"},"onUpdate:modelValue":i=>o._id=i,readonly:""},null,8,Y),[[n,o._id]]),s("div",null,[s("div",Z,[s("button",{type:"",onClick:i=>o.tab="fields"}," Fields ",8,ee),s("button",{type:"",onClick:i=>o.tab="roles"}," Roles ",8,te),s("button",{type:"",onClick:i=>o.tab="instance"}," Instance ",8,oe),s("button",{type:"",onClick:i=>o.tab="dashboard"}," Dashboard ",8,se)]),ie,!o.tab||o.tab==="fields"?(r(),d("div",le,[ne,l(s("textarea",{style:{width:"100%"},placeholder:"fields","onUpdate:modelValue":i=>o.fields=i},null,8,ae),[[n,o.fields]])])):o.tab==="roles"?(r(),d("div",re,[de,l(s("textarea",{style:{width:"100%"},placeholder:"roles","onUpdate:modelValue":i=>o.roles=i},null,8,pe),[[n,o.roles]])])):o.tab==="instance"?(r(),d("div",ue,[ge,h(u,{src:o.instance,onChange:i=>o.instance=i,style:{height:"400px"}},null,8,["src","onChange"])])):o.tab==="dashboard"?(r(),d("div",he,[ce,h(u,{src:o.dashboard,onChange:i=>o.dashboard=i,style:{height:"400px"}},null,8,["src","onChange"])])):y("",!0)])])]))),256)),s("div",me,[s("button",{type:"",onClick:e[11]||(e[11]=o=>(t.page--,a.list())),style:{float:"left"}}," Previous page "),s("span",null," Page "+g(t.page),1),s("button",{type:"",onClick:e[12]||(e[12]=o=>(t.page++,a.list())),style:{float:"right"}}," Next page ")])])])}const ve=c($,[["render",be]]);export{ve as default};

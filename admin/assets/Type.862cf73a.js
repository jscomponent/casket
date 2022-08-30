var k=Object.defineProperty,C=Object.defineProperties;var V=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var y=(t,e,r)=>e in t?k(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,v=(t,e)=>{for(var r in e||(e={}))U.call(e,r)&&y(t,r,e[r]);if(f)for(var r of f(e))j.call(e,r)&&y(t,r,e[r]);return t},_=(t,e)=>C(t,V(e));import{_ as z,c as a,a as i,t as g,w as n,v as p,b as D,e as R,F as u,r as c,d as h,o as l}from"./index.a8ce7938.js";import"https://cdn.jsdelivr.net/npm/@feathersjs/client@5.0.0-pre.28/+esm";import"https://cdn.jsdelivr.net/npm/socket.io-client@4.5.1/+esm";const T={inject:["io"],methods:{toggle(){this.custom=!this.custom},async list(){var e;let t=await this.io.service("types/any").find({query:{slug:this.type,$limit:this.limit,$skip:(this.page-1)*this.limit,$sort:{createdAt:-1}}});this.response=t,(e=t==null?void 0:t.data[0])!=null&&e.dashboard?this.dashboard=new TextDecoder().decode(t.data[0].dashboard):this.dashboard="",this.listRow()},async listRow(){let t={$or:[]};this.fields.forEach(r=>{if(this.instance.fields[r].type==="String"){let b={};b[r]={$regex:this.search},t.$or.push(b)}}),(!t.$or.length||!this.search)&&delete t.$or;let e=await this.io.service("types/"+this.type).find({query:_(v({},t),{$limit:this.limit,$skip:(this.page-1)*this.limit,$sort:{createdAt:-1}})});this.responseRow=e},async create(t){await this.io.service("types/"+this.type).create(t),this.clear(),this.list()},async save(t){await this.io.service("types/"+this.type).patch(t._id,t),this.list()},async remove(t){await this.io.service("types/"+this.type).remove(t._id),this.list()},clear(){this.obj={}}},computed:{instance(){var t;return((t=this.response)==null?void 0:t.data[0])||{}},fields(){var t,e;return(t=this.instance)!=null&&t.fields?Object.keys((e=this.instance)==null?void 0:e.fields):[]},table(){var t;return((t=this.responseRow)==null?void 0:t.data)||[]}},data:()=>({obj:{},limit:25,page:1,response:null,responseRow:null,search:"",dashboard:"",custom:!0}),props:{type:{type:String,default:"domains"}},created(){this.list()},watch:{type(){this.list()}}},S={style:{display:"flex",height:"100%","font-family":"Arial, Helvetica, sans-serif"}},A={style:{width:"100%","flex-grow":"1",flex:"1",height:"100%",overflow:"auto","background-color":"#edebebff"}},L={style:{"margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px"}},N={style:{color:"#2b2b2bff"}},q=h(),B=h(),F={key:0,style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"60px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#ebf2f5ff"}},H=["disabled"],M=["disabled"],E={key:1,style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#ffffffff"}},K=["innerHTML"],O={key:2},P={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"60px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#bacad1ff"}},I={style:{display:"inline-block"}},$=["onUpdate:modelValue","placeholder"],G={style:{display:"inline-block",float:"right"}},J={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#83b5c9ff",position:"relative"}},Q={style:{display:"inline-block",float:"right"}},W=h(),X={style:{display:"inline-block",width:"100%"}},Y={style:{"font-size":"12px",position:"absolute",top:"5px",color:"#1c1c1cff"}},Z={style:{position:"absolute",top:"5px","font-size":"12px",right:"21px",color:"#1c1c1cff"}},tt=["onUpdate:modelValue","placeholder"],et=h(),it=["onUpdate:modelValue"],ot={style:{"padding-top":"10px"}},st=i("label",null," Objects ",-1),rt=["onUpdate:modelValue"],dt={style:{"box-sizing":"border-box",width:"calc(100% - 40px)","padding-left":"20px","padding-right":"20px","padding-top":"20px","padding-bottom":"20px","margin-left":"20px","margin-right":"20px","margin-top":"20px","margin-bottom":"20px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px","background-color":"#bacad1ff",position:"relative","text-align":"center"}};function at(t,e,r,b,lt,s){var m,x;return l(),a("div",S,[i("div",A,[i("div",L,[i("h2",N,g((x=(m=s.instance)==null?void 0:m.title)==null?void 0:x.en),1),q,i("button",{type:"",onClick:e[0]||(e[0]=(...o)=>s.list&&s.list(...o)),style:{float:"right"}}," Refresh "),n(i("input",{style:{"margin-right":"5px",width:"167px",float:"right"},"onUpdate:modelValue":e[1]||(e[1]=o=>t.search=o),placeholder:"Filter",onKeydown:e[2]||(e[2]=D((...o)=>s.list&&s.list(...o),["enter"]))},null,544),[[p,t.search]])]),B,t.dashboard?(l(),a("div",F,[i("button",{type:"",onClick:e[3]||(e[3]=(...o)=>s.toggle&&s.toggle(...o)),disabled:t.custom}," Custom view ",8,H),i("button",{type:"",onClick:e[4]||(e[4]=(...o)=>s.toggle&&s.toggle(...o)),disabled:!t.custom}," Default view ",8,M)])):R("",!0),t.custom&&t.dashboard?(l(),a("div",E,[i("div",{innerHTML:t.dashboard},null,8,K)])):(l(),a("div",O,[i("div",P,[i("div",I,[(l(!0),a(u,null,c(s.fields,o=>n((l(),a("input",{style:{"margin-right":"5px"},"onUpdate:modelValue":d=>t.obj[o]=d,placeholder:o},null,8,$)),[[p,t.obj[o]]])),256))]),i("div",G,[i("button",{type:"",onClick:e[5]||(e[5]=o=>s.create(t.obj))}," Create ")])]),(l(!0),a(u,null,c(s.table,o=>(l(),a("div",J,[i("div",Q,[i("button",{type:"",style:{"margin-right":"10px"},onClick:e[6]||(e[6]=d=>s.save(r.type))}," Save "),i("button",{type:"",onClick:e[7]||(e[7]=d=>s.remove(r.type))}," Remove ")]),W,i("div",X,[i("div",null,[i("span",Y," Created "+g(new Date(o.createdAt).toLocaleString()),1),i("span",Z," Updated "+g(new Date(o.updatedAt).toLocaleString()),1)]),(l(!0),a(u,null,c(s.fields,d=>n((l(),a("input",{style:{"margin-right":"5px"},"onUpdate:modelValue":w=>o[d]=w,placeholder:d},null,8,tt)),[[p,o[d]]])),256)),et,n(i("input",{placeholder:"ID",style:{"margin-right":"5px"},"onUpdate:modelValue":d=>o._id=d,readonly:""},null,8,it),[[p,o._id]]),i("div",ot,[st,n(i("textarea",{style:{width:"100%"},placeholder:"coming soon","onUpdate:modelValue":d=>o._id=d,readonly:""},null,8,rt),[[p,o._id]])])])]))),256)),i("div",dt,[i("button",{type:"",onClick:e[8]||(e[8]=o=>(t.page--,s.list())),style:{float:"left"}}," Previous page "),i("span",null," Page "+g(t.page),1),i("button",{type:"",onClick:e[9]||(e[9]=o=>(t.page++,s.list())),style:{float:"right"}}," Next page ")])]))])])}var bt=z(T,[["render",at]]);export{bt as default};

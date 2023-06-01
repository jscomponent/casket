import{_ as y,o as n,c as a,F as v,r as b,a as o,e as c,b as h,t as g,n as x,p as w,f as $,w as C,g as z,h as _,i as k,j as S,k as N}from"./index-b9d1c481.js";const B={data:()=>({pages:[{label:"Users",path:"/admin/users"},{label:"Settings",path:"/admin/settings"},{label:"Server",path:"/admin/server"}],types:[]}),computed:{current(){return this.$route.path}},inject:["io"],methods:{async list(){let e=await this.io.service("types/any").find({query:{$limit:100,$sort:{title:"asc"}}});this.types=e.data},async add(){let e=prompt("Slug");e&&(await this.io.service("types/any").create({title:e,slug:e}),this.$emit("list"))}},created(){this.list()},props:{renderkey:{type:Number,default:42}},watch:{renderkey(){console.log("to the edge"),this.list()}}},m=e=>(w("data-v-e1221e38"),e=e(),$(),e),D={style:{height:"100%",width:"160px","font-family":"Arial, Helvetica, sans-serif",background:"linear-gradient(215deg, rgba(58,66,64,1) 0%, rgba(33,33,33,1) 100%)","background-color":"rgb(58,66,64)"}},I=["onClick"],T={key:0,style:{"background-color":"#edebebff",width:"10px",position:"absolute",right:"0px","clip-path":"polygon(100% 0%, 100% 100%, 0% 50%)",top:"9px",height:"20px"}},V=m(()=>o("div",null,null,-1)),A=m(()=>o("hr",null,null,-1)),L=["onClick"],U={key:0,style:{"background-color":"#edebebff",width:"10px",position:"absolute",right:"0px","clip-path":"polygon(100% 0%, 100% 100%, 0% 50%)",top:"9px",height:"20px"}},j=m(()=>o("div",null,null,-1)),F=m(()=>o("div",null,null,-1));function H(e,i,f,l,p,t){return n(),a("div",D,[(n(!0),a(v,null,b(e.pages,s=>(n(),a("div",null,[o("div",{style:{"box-sizing":"border-box","padding-left":"10px","padding-right":"10px","padding-top":"10px","padding-bottom":"10px","font-size":"15px",position:"relative"},class:x(["menu-button",s.path===t.current?"active":""]),onClick:d=>e.$router.push(s.path)},[s.path===t.current?(n(),a("div",T)):c("",!0),h(" "+g(s.label),1)],10,I),V]))),256)),A,(n(!0),a(v,null,b(e.types,s=>(n(),a("div",null,[o("div",{style:{"box-sizing":"border-box","padding-left":"10px","padding-right":"10px","padding-top":"10px","padding-bottom":"10px","font-size":"15px",position:"relative"},class:x(["menu-button","/admin/types/"+s.slug===t.current?"active":""]),onClick:d=>e.$router.push("/admin/types/"+s.slug)},["/admin/types/"+s.slug===t.current?(n(),a("div",U)):c("",!0),h(" "+g(s.title.en),1)],10,L),j]))),256)),o("div",null,[o("div",{style:{"box-sizing":"border-box","padding-left":"10px","padding-right":"10px","padding-top":"10px","padding-bottom":"10px","font-size":"15px",position:"relative"},class:"menu-button",onClick:i[0]||(i[0]=s=>t.add())}," + Add "),F])])}const q=y(B,[["render",H],["__scopeId","data-v-e1221e38"]]);const E={data:()=>({domains:[],current:""}),inject:["io","user","userUpdate"],methods:{async logout(){await this.io.logout(),this.userUpdate(null),this.$router.push("/")},async getDomains(){var e,i;this.domains=await this.io.service("types/domains").find().catch(f=>{var l,p,t;this.domains={data:[{match:(t=(p=(l=this.io)==null?void 0:l.io)==null?void 0:p.io)==null?void 0:t.uri}]}}),(i=(e=this.domains)==null?void 0:e.data)!=null&&i.length&&(this.current=this.domains.data[0].match)},open(){window.open("https://"+this.current,"_blank")}},created(){this.getDomains()}},M=e=>(w("data-v-5707afb5"),e=e(),$(),e),G={style:{height:"30px",display:"flex",color:"#e6e6e6ff","font-family":"Arial, Helvetica, sans-serif",background:"linear-gradient(45deg, rgba(58,66,64,1) 0%, rgba(48,52,51,1) 100%)","background-color":"rgb(58,66,64)"}},J={style:{"padding-left":"10px",width:"calc(100% - 350px)","font-weight":"bold","margin-top":"4px"}},K=M(()=>o("div",{style:{display:"inline-block","margin-top":"1px",color:"#ffffffff"}}," Airportal ",-1)),O=["value"],P={style:{flex:"1"}};function Q(e,i,f,l,p,t){var s,d,u;return n(),a("div",G,[o("div",J,[K,h(),C(o("select",{name:"",style:{width:"200px","padding-top":"1px","padding-bottom":"1px","margin-left":"7px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px"},onChange:i[0]||(i[0]=r=>t.open()),"onUpdate:modelValue":i[1]||(i[1]=r=>e.current=r)},[(n(!0),a(v,null,b((s=e.domains)==null?void 0:s.data,r=>(n(),a("option",{value:r.match},g(r.match),9,O))),256))],544),[[z,e.current]])]),o("div",P,[o("div",{style:{"text-align":"right","font-size":"14px","padding-top":"7px","padding-bottom":"7px","padding-right":"7px",display:"inline-block",float:"right"},class:"link",onClick:i[2]||(i[2]=(...r)=>t.logout&&t.logout(...r))}," Log out "),h(),o("div",{style:{"text-align":"right","font-size":"14px","padding-top":"7px","padding-bottom":"7px","padding-right":"7px",display:"inline-block",float:"right"},onClick:i[3]||(i[3]=r=>e.$router.push("/admin/profile")),class:"link"},g((u=(d=t.user)==null?void 0:d.value)==null?void 0:u.email)+" - ",1)])])}const R=y(E,[["render",Q],["__scopeId","data-v-5707afb5"]]);const W={components:{Navigation:q,TopBar:R},props:["min"],computed:{minimal(){return this.min||!1},rerender(){return this.renderkey}},data:()=>({renderkey:1}),methods:{refresh(){this.renderkey=this.renderkey+1,this.$emit("list")}},emits:["list"]},X={style:{height:"100%",width:"100%"}},Y={style:{width:"100%",height:"100%",overflow:"auto",position:"relative",flex:"1"}};function Z(e,i,f,l,p,t){const s=_("TopBar"),d=_("Navigation"),u=_("router-view");return n(),a("div",X,[t.minimal?c("",!0):(n(),k(s,{key:0,style:{width:"100%"}})),o("div",{style:N([{display:"flex"},t.minimal?"height:100%":"height:calc(100% - 30px)"])},[t.minimal?c("",!0):(n(),k(d,{key:0,path:"/admin/services",renderkey:t.minimal?"":e.renderkey,onList:i[0]||(i[0]=r=>t.refresh())},null,8,["renderkey"])),o("div",Y,[S(u,{style:{width:"100%",height:"100%",overflow:"auto","background-color":"#edebebff",position:"absolute"},min:!0,onList:i[1]||(i[1]=r=>t.refresh())})])],4)])}const te=y(W,[["render",Z]]);export{te as default};

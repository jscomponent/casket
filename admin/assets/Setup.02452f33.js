import{_ as n,c as p,a as o,w as a,v as s,e as l,t as g,d as b,o as r}from"./index.224f5def.js";import"https://cdn.jsdelivr.net/npm/@feathersjs/client@5.0.0-pre.28/+esm";import"https://cdn.jsdelivr.net/npm/socket.io-client@4.5.1/+esm";const m={data:()=>({email:"",password:"",mongodb:"",status:""}),methods:{async setup(){let e={email:this.email,password:this.password};this.status==="setup"&&(e.mongodb=this.mongodb);let t=await this.io.service("/settings").create(e);t==="ready"?this.$router.push("/"):alert(t)},async init(){this.status=await this.io.service("/settings").get("status")}},inject:["io"],created(){this.init()}},u={style:{display:"flex",height:"100%","font-family":"Arial, Helvetica, sans-serif"}},x={style:{width:"100%","flex-grow":"1",flex:"1",height:"100%",overflow:"auto","background-color":"#edebebff"}},h={style:{"box-sizing":"border-box","padding-left":"30px","padding-right":"30px","padding-top":"30px","padding-bottom":"30px","margin-left":"auto","margin-right":"auto","margin-top":"80px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px",width:"360px","background-color":"#424242ff",background:"linear-gradient(40deg, rgba(58,66,64,1) 0%, rgba(33,33,33,1) 100%)"}},f={style:{display:"inline-block",width:"100%"}},c=o("h3",{style:{color:"#f0f0f0ff","margin-top":"0px","text-align":"center"}}," Setup Airportal ",-1),y=b();function w(e,t,v,_,k,d){return r(),p("div",u,[o("div",x,[o("div",h,[o("div",f,[c,y,a(o("input",{placeholder:"email",style:{display:"block",width:"100%","padding-top":"10px","padding-bottom":"10px","padding-right":"10px","padding-left":"10px","margin-bottom":"10px","box-sizing":"border-box"},"onUpdate:modelValue":t[0]||(t[0]=i=>e.email=i),type:"email"},null,512),[[s,e.email]]),a(o("input",{placeholder:"password",style:{display:"block",width:"100%","padding-bottom":"10px","padding-top":"10px","padding-right":"10px","padding-left":"10px","margin-bottom":"10px","box-sizing":"border-box"},type:"password","onUpdate:modelValue":t[1]||(t[1]=i=>e.password=i)},null,512),[[s,e.password]]),e.status!=="admin-registration"?a((r(),p("input",{key:0,placeholder:"connection string",style:{display:"block",width:"100%","padding-bottom":"10px","padding-top":"10px","padding-right":"10px","padding-left":"10px","margin-bottom":"10px","box-sizing":"border-box"},"onUpdate:modelValue":t[2]||(t[2]=i=>e.mongodb=i)},null,512)),[[s,e.mongodb]]):l("",!0),o("button",{type:"",style:{display:"block",width:"100%","padding-bottom":"10px","padding-top":"10px","padding-right":"10px","padding-left":"10px","box-sizing":"border-box"},onClick:t[3]||(t[3]=(...i)=>d.setup&&d.setup(...i))},g(d.setup==="admin-registration"?"Submit admin":"Install"),1)])])])])}const B=n(m,[["render",w]]);export{B as default};

import{_ as n,c as p,a as o,w as a,v as s,b as r,d as l,o as g}from"./index.28b1a564.js";import"https://cdn.jsdelivr.net/npm/@feathersjs/client@5.0.0-pre.28/+esm";import"https://cdn.jsdelivr.net/npm/socket.io-client@4.5.1/+esm";const m={methods:{async login(t){this.io.authenticate({strategy:"local",...t}).then(e=>{this.userUpdate(e==null?void 0:e.user),this.$router.push("/admin/types")}).catch(e=>{console.error("Authentication error",e),alert(e.message)})}},data:()=>({email:"",password:""}),inject:["io","user","userUpdate"],mounted(){var t,e;(e=(t=this.$refs)==null?void 0:t.username)==null||e.focus()}},u={style:{display:"flex",height:"100%","font-family":"Arial, Helvetica, sans-serif"}},b={style:{width:"100%","flex-grow":"1",flex:"1",height:"100%",overflow:"auto","background-color":"#edebebff"}},x={style:{"box-sizing":"border-box","padding-left":"30px","padding-right":"30px","padding-top":"30px","padding-bottom":"30px","margin-left":"auto","margin-right":"auto","margin-top":"80px","border-top-left-radius":"3px","border-top-right-radius":"3px","border-bottom-left-radius":"3px","border-bottom-right-radius":"3px",width:"360px","background-color":"#424242ff",background:"linear-gradient(40deg, rgba(58,66,64,1) 0%, rgba(33,33,33,1) 100%)"}},h={style:{display:"inline-block",width:"100%"}},f=o("h3",{style:{color:"#f0f0f0ff","margin-top":"0px","text-align":"center"}}," Airportal ",-1),y=l();function w(t,e,c,v,k,d){return g(),p("div",u,[o("div",b,[o("div",x,[o("div",h,[f,y,a(o("input",{placeholder:"username",style:{display:"block",width:"100%","padding-top":"10px","padding-bottom":"10px","padding-right":"10px","padding-left":"10px","margin-bottom":"10px","box-sizing":"border-box"},onKeyup:e[0]||(e[0]=r(i=>d.login({email:t.email,password:t.password}),["enter"])),"onUpdate:modelValue":e[1]||(e[1]=i=>t.email=i),ref:"username"},null,544),[[s,t.email]]),a(o("input",{placeholder:"password",style:{display:"block",width:"100%","padding-bottom":"10px","padding-top":"10px","padding-right":"10px","padding-left":"10px","margin-bottom":"10px","box-sizing":"border-box"},type:"password",onKeyup:e[2]||(e[2]=r(i=>d.login({email:t.email,password:t.password}),["enter"])),"onUpdate:modelValue":e[3]||(e[3]=i=>t.password=i)},null,544),[[s,t.password]]),o("button",{type:"",style:{display:"block",width:"100%","padding-bottom":"10px","padding-top":"10px","padding-right":"10px","padding-left":"10px","box-sizing":"border-box"},onClick:e[4]||(e[4]=i=>d.login({email:t.email,password:t.password}))}," Login ")])])])])}const U=n(m,[["render",w]]);export{U as default};

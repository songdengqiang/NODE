webpackJsonp([8],{A80E:function(e,s){},"de/v":function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=t("LEEh"),r=t("mtWM"),o=t.n(r),n={name:"kg_zb_qa",data:function(){return{path:this.globelV.pathID+"/user/project/zbSystem",qustion:"张三的朋友包括",answer:"张三的朋友包括：李四，小红，小米等",headers:"",relations:"",qustions:!1,myKG1:null,myKG2:null,myKG3:null,myKG11:{nodes:[{id:0,color:"red",labels:["person"],name:"李四"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"}],links:[{target:0,source:1,relation:"朋友"},{target:0,source:2,relation:"朋友"},{target:0,source:3,relation:"朋友"},{target:0,source:4,relation:"朋友"}]},myKG12:{nodes:[{id:0,color:"red",labels:["person"],name:"李四"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"}],links:[]},myKG13:{nodes:[{id:10,color:"red",labels:["person"],name:"张宇"},{id:11,color:"red",labels:["person"],name:"李五"},{id:12,color:"red",labels:["person"],name:"小明"},{id:13,color:"red",labels:["person"],name:"小红"},{id:14,color:"red",labels:["person"],name:"小军"}],links:[{target:10,source:11,relation:"朋友"},{target:10,source:12,relation:"朋友"},{target:10,source:13,relation:"朋友"},{target:10,source:14,relation:"朋友"}]},similars:[{name:"张宇",number:"0.564"},{name:"张d",number:"0.562"},{name:"张s",number:"0.561"},{name:"张dd",number:"0.564"},{name:"张gf",number:"0.564"},{name:"张gf",number:"0.564"}]}},methods:{displayKg:function(){var e=this;o.a.get(e.path+"/getAllEntity").then(function(s){e.myKG11.nodes=s.data,o.a.get(e.path+"/getAllKg").then(function(s){e.myKG11.links=s.data,console.log(e.myKG11.links),e.myKG1.updataGraphs(e.myKG11)})})},searchQ:function(){this.qustions=!0,this.headers=this.qustion.slice(0,2),this.relations=this.qustion.slice(3,5),this.myKG1=new a.a("center_bottom_mainPanel"),this.myKG1.updataGraphs(this.myKG11),this.myKG2=new a.a("entityG"),this.myKG2.updataGraphs(this.myKG12)},drawgg:function(e){this.myKG3=new a.a("entityG1"),this.myKG3.updataGraphs(this.myKG13)},ddd:function(e){switch(e){case 1:this.myKG11.nodes=[{id:0,color:"red",labels:["person"],name:"张宇"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"}],this.myKG11.links=[{target:0,source:1,relation:"朋友"},{target:0,source:2,relation:"朋友"},{target:0,source:3,relation:"朋友"},{target:0,source:4,relation:"朋友"}],this.myKG12.nodes=[{id:0,color:"red",labels:["person"],name:"张宇"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"}],this.myKG2.updataGraphs(this.myKG12),this.myKG1.updataGraphs(this.myKG11);break;case 2:this.myKG11.nodes=[{id:0,color:"red",labels:["person"],name:"张宇"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"},{id:5,color:"red",labels:["person"],name:"李五1"},{id:6,color:"red",labels:["person"],name:"小明2"},{id:7,color:"red",labels:["person"],name:"小红3"},{id:8,color:"red",labels:["person"],name:"小军4"}],this.myKG11.links=[{target:0,source:1,relation:"朋友"},{target:0,source:2,relation:"朋友"},{target:0,source:3,relation:"朋友"},{target:0,source:4,relation:"朋友"},{target:0,source:5,relation:"朋友"},{target:0,source:6,relation:"朋友"},{target:0,source:7,relation:"朋友"},{target:0,source:8,relation:"朋友"}],this.myKG12.nodes=[{id:0,color:"red",labels:["person"],name:"张宇"},{id:1,color:"red",labels:["person"],name:"李五"},{id:2,color:"red",labels:["person"],name:"小明"},{id:3,color:"red",labels:["person"],name:"小红"},{id:4,color:"red",labels:["person"],name:"小军"},{id:5,color:"red",labels:["person"],name:"李五1"},{id:6,color:"red",labels:["person"],name:"小明2"},{id:7,color:"red",labels:["person"],name:"小红3"},{id:8,color:"red",labels:["person"],name:"小军4"}],this.myKG2.updataGraphs(this.myKG12),this.myKG1.updataGraphs(this.myKG11)}}},mounted:function(){}},i={render:function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"zb_papar_qa"},[t("div",{staticClass:"top_mainPanel"},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.qustion,expression:"qustion"}],staticClass:"searchQa",attrs:{type:"text"},domProps:{value:e.qustion},on:{input:function(s){s.target.composing||(e.qustion=s.target.value)}}}),e._v(" "),t("button",{staticClass:"btn_pro_green btn1",on:{click:function(s){return e.searchQ()}}},[e._v("查询")])]),e._v(" "),t("div",{staticClass:"bottom_mainPanel"},[t("div",{staticClass:"left_bottom_mainPanel"},[t("div",{staticClass:"qustion"},[t("p",[e._v("问题中头实体相似实体分析：")]),e._v(" "),t("table",{directives:[{name:"show",rawName:"v-show",value:e.qustions,expression:"qustions"}],staticClass:"table"},[e._m(0),e._v(" "),t("tbody",e._l(e.similars,function(s){return t("tr",{key:s.id,staticClass:"trclick",on:{click:function(t){return e.drawgg(s)}}},[t("td",[e._v(e._s(s.name))]),e._v(" "),t("td",[e._v(e._s(s.number))])])}),0)])]),e._v(" "),e._m(1)]),e._v(" "),t("div",{staticClass:"center_bottom_mainPanel"}),e._v(" "),t("div",{staticClass:"right_bottom_mainPanel"},[t("div",{staticClass:"qustion"},[t("p",[e._v("你提出的问题拆解如下：")]),e._v(" "),t("h2",[e._v("实体名："+e._s(e.headers))]),e._v(" "),t("h2",[e._v("查询关系："+e._s(e.relations))]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.qustions,expression:"qustions"}],staticClass:"circle"},[t("div",{staticClass:"circle1"},[e._v(e._s(e.headers))]),e._v(" "),t("div",{staticClass:"circle2"},[e._v(e._s(e.relations))]),e._v(" "),t("div",{staticClass:"circle1"},[e._v("？")])])]),e._v(" "),t("div",{staticClass:"answer"},[t("div",{staticClass:"titile"},[t("p",[e._v("系统给出的结果如下：")]),e._v(" "),t("div",{staticClass:"dropdown"},[t("button",{staticClass:"btn btn-secondary dropdown-toggle",attrs:{type:"button","data-toggle":"dropdown"}},[e._v("\n              关系层级选择\n            ")]),e._v(" "),t("div",{staticClass:"dropdown-menu"},[t("a",{staticClass:"dropdown-item",attrs:{href:"#"},on:{click:function(s){return e.ddd(1)}}},[e._v("层级 1")]),e._v(" "),t("a",{staticClass:"dropdown-item",attrs:{href:"#"},on:{click:function(s){return e.ddd(2)}}},[e._v("层级 2")]),e._v(" "),t("a",{staticClass:"dropdown-item",attrs:{href:"#"},on:{click:function(s){return e.ddd(3)}}},[e._v("层级 3")])])])]),e._v(" "),t("div",{staticClass:"entityG"})])])])])},staticRenderFns:[function(){var e=this.$createElement,s=this._self._c||e;return s("thead",[s("tr",[s("td",[this._v("相似实体：")]),this._v(" "),s("td",[this._v("相似度：")])])])},function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"answer"},[t("div",{staticClass:"titile"},[t("p",[e._v("系统给出的结果如下：")]),e._v(" "),t("div",{staticClass:"dropdown"},[t("button",{staticClass:"btn btn-secondary dropdown-toggle",attrs:{type:"button","data-toggle":"dropdown"}},[e._v("\n              关系层级选择\n            ")]),e._v(" "),t("div",{staticClass:"dropdown-menu"},[t("a",{staticClass:"dropdown-item",attrs:{href:"#"}},[e._v("层级 1")]),e._v(" "),t("a",{staticClass:"dropdown-item",attrs:{href:"#"}},[e._v("层级 2")]),e._v(" "),t("a",{staticClass:"dropdown-item",attrs:{href:"#"}},[e._v("层级 3")])])])]),e._v(" "),t("div",{staticClass:"entityG1"})])}]};var l=t("VU/8")(n,i,!1,function(e){t("A80E")},"data-v-5cdf7564",null);s.default=l.exports}});
//# sourceMappingURL=8.05ac12309feaded9abb7.js.map
﻿!function(){var n=Handlebars.template,r=Handlebars.templates=Handlebars.templates||{};r["Profile.html"]=n(function(n,r,a,e,i){function l(n,r){var e,i,l="";return l+='\r\n    <ul class="highlight">   \r\n        <li><a href="#" class="btn" onclick="window.app.screens.contactInformation.show();">'+h((e=n.dictionary,e=null==e||e===!1?e:e.Profile_ContactInfo,typeof e===d?e.apply(n):e))+'<span class="ico">></span></a></li>\r\n        \r\n        ',i=a.unless.call(n,(e=n.assocData,e=null==e||e===!1?e:e.insurer,null==e||e===!1?e:e.hideBankingInformation),{hash:{},inverse:y.noop,fn:y.program(2,s,r),data:r}),(i||0===i)&&(l+=i),l+='\r\n\r\n        <li><a href="#" class="btn" onclick="window.app.screens.dependentList.show();">'+h((e=n.dictionary,e=null==e||e===!1?e:e.Profile_Dependents,typeof e===d?e.apply(n):e))+'\r\n            <span class="" style="text-align: -webkit-right;">\r\n                ',i=a["if"].call(n,(e=n.profile,null==e||e===!1?e:e.dependents),{hash:{},inverse:y.program(6,t,r),fn:y.program(4,o,r),data:r}),(i||0===i)&&(l+=i),l+='\r\n            </span>\r\n            <span class="ico">></span></a>\r\n        </li>\r\n        <li><a href="#" class="btn" onclick="window.app.screens.coordinationBenefitList.show();">'+h((e=n.dictionary,e=null==e||e===!1?e:e.Profile_CoordinationBenefits,typeof e===d?e.apply(n):e))+'\r\n            <span class="" style="text-align: -webkit-right;">\r\n                ',i=a["if"].call(n,(e=n.profile,null==e||e===!1?e:e.insurers),{hash:{},inverse:y.program(6,t,r),fn:y.program(4,o,r),data:r}),(i||0===i)&&(l+=i),l+='\r\n            </span>\r\n            <span class="ico">></span></a>\r\n        </li>\r\n    </ul>\r\n'}function s(n){var r,a="";return a+='\r\n        <li><a href="#" class="btn" onclick="window.app.screens.refundPreferences.show();">'+h((r=n.dictionary,r=null==r||r===!1?r:r.Profile_RefundPreferences,typeof r===d?r.apply(n):r))+'<span class="ico">></span></a></li>\r\n        '}function o(n){var r,a="";return a+="\r\n                "+h((r=n.dictionary,r=null==r||r===!1?r:r.Common_Yes,typeof r===d?r.apply(n):r))+"\r\n                "}function t(n){var r,a="";return a+="\r\n                "+h((r=n.dictionary,r=null==r||r===!1?r:r.Common_No,typeof r===d?r.apply(n):r))+"\r\n                "}function p(n){var r,a,e="";return e+="\r\n    ",r=n.assocData,r=null==r||r===!1?r:r.insurer,r=null==r||r===!1?r:r.createCompleteProfileText,a=typeof r===d?r.apply(n):r,(a||0===a)&&(e+=a),e+='\r\n        \r\n        <a href="#" class="btn alternative" onclick="window.app.screens.profile.startProfileWizard();"><span>'+h((r=n.dictionary,r=null==r||r===!1?r:r.Profile_WizardButton,typeof r===d?r.apply(n):r))+"</span></a>\r\n        \r\n"}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,n.helpers),e=this.merge(e,n.partials),i=i||{};var c,f,u="",d="function",h=this.escapeExpression,y=this;return u+='<section class="screen" id="',(c=a.containerId)?c=c.call(r,{hash:{},data:i}):(c=r.containerId,c=typeof c===d?c.apply(r):c),u+=h(c)+'">\r\n    ',c=y.invokePartial(e.header,"header",r,a,e,i),(c||0===c)&&(u+=c),u+="\r\n\r\n    <h1>"+h((c=r.dictionary,c=null==c||c===!1?c:c.ProfileMenu_Title1,typeof c===d?c.apply(r):c))+'</h1>\r\n         \r\n    <ul class="highlight">\r\n        <li><a href="#" class="btn" onclick="window.app.screens.editSelectAssociation.show();">'+h((c=r.dictionary,c=null==c||c===!1?c:c.Profile_Association,typeof c===d?c.apply(r):c))+'<span class="ico">></span></a></li>\r\n        <li><a href="#" class="btn" onclick="window.app.screens.basicInformation.show();">'+h((c=r.dictionary,c=null==c||c===!1?c:c.Profile_BasicInformation,typeof c===d?c.apply(r):c))+'<span class="ico">></span></a></li>\r\n        <li><a href="#" class="btn" onclick="window.app.screens.securitySettings.show();">'+h((c=r.dictionary,c=null==c||c===!1?c:c.Profile_SecuritySettings,typeof c===d?c.apply(r):c))+'<span class="ico">></span></a></li>\r\n    </ul>\r\n\r\n    <h1>'+h((c=r.dictionary,c=null==c||c===!1?c:c.ProfileMenu_Title2,typeof c===d?c.apply(r):c))+"</h1>\r\n\r\n",f=a["if"].call(r,(c=r.profile,null==c||c===!1?c:c.completed),{hash:{},inverse:y.program(8,p,i),fn:y.program(1,l,i),data:i}),(f||0===f)&&(u+=f),u+="\r\n\r\n    ",f=y.invokePartial(e.footer,"footer",r,a,e,i),(f||0===f)&&(u+=f),u+="\r\n</section>"})}();
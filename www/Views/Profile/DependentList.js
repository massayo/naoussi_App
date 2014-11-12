﻿!function(){var n=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["DependentList.html"]=n(function(n,a,e,t,r){function l(n,a,t){var r,l,i,s="";return s+='\r\n                    <li>\r\n                        <div class="group-wrapper">\r\n                            <div class="group-text-icon">\r\n                                <span class="group-text">\r\n                                    <span>',(r=e.firstName)?r=r.call(n,{hash:{},data:a}):(r=n.firstName,r=typeof r===v?r.apply(n):r),s+=m(r)+" ",(r=e.lastName)?r=r.call(n,{hash:{},data:a}):(r=n.lastName,r=typeof r===v?r.apply(n):r),s+=m(r)+"</span><br/>\r\n                                    ",i={hash:{},inverse:g.noop,fn:g.program(2,p,a),data:a},r=e["navid-to-value"]||t["navid-to-value"],l=r?r.call(n,(r=t.appData,null==r||r===!1?r:r.relationships),i):D.call(n,"navid-to-value",(r=t.appData,null==r||r===!1?r:r.relationships),i),(l||0===l)&&(s+=l),s+='\r\n                                </span>\r\n                                <span class="group-icon">\r\n                                    <a href="#" class="dependent-btn-edit" data-dependentid="',(l=e.id)?l=l.call(n,{hash:{},data:a}):(l=n.id,l=typeof l===v?l.apply(n):l),s+=m(l)+'" style="margin-right: 16px;">\r\n                                        <img src="data:image/jpeg;base64,'+m((r=t.uiData,r=null==r||r===!1?r:r.modifyIcon,r=null==r||r===!1?r:r.thumbnail,typeof r===v?r.apply(n):r))+'" alt="'+m((r=t.uiData,r=null==r||r===!1?r:r.modifyIcon,r=null==r||r===!1?r:r.alt,typeof r===v?r.apply(n):r))+'"/>\r\n                                    </a>\r\n                                    <a href="#" class="dependent-btn-delete" data-dependentid="',(l=e.id)?l=l.call(n,{hash:{},data:a}):(l=n.id,l=typeof l===v?l.apply(n):l),s+=m(l)+'">\r\n                                        <img src="data:image/jpeg;base64,'+m((r=t.uiData,r=null==r||r===!1?r:r.lessIcon,r=null==r||r===!1?r:r.thumbnail,typeof r===v?r.apply(n):r))+'" alt="'+m((r=t.uiData,r=null==r||r===!1?r:r.lessIcon,r=null==r||r===!1?r:r.alt,typeof r===v?r.apply(n):r))+'"/>\r\n                                    </a>\r\n                                </span>\r\n                            </div>\r\n                        </div>\r\n                    </li>\r\n                '}function p(n,a){var t;return(t=e.relationshipNavId)?t=t.call(n,{hash:{},data:a}):(t=n.relationshipNavId,t=typeof t===v?t.apply(n):t),m(t)}function i(n,a){var t,r,l="";return l+='\r\n            <ul>\r\n                <li>\r\n                    <div class="group-wrapper">\r\n                        <span>'+m((t=n.dictionary,t=null==t||t===!1?t:t.Dependent_List_Empty,typeof t===v?t.apply(n):t))+"</span>\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n            ",r=e["if"].call(n,(t=n.mobileApp,null==t||t===!1?t:t.isInProfileWizard),{hash:{},inverse:g.program(7,o,a),fn:g.program(5,s,a),data:a}),(r||0===r)&&(l+=r),l+="\r\n            "}function s(n){var a,e="";return e+="\r\n                <p>"+m((a=n.dictionary,a=null==a||a===!1?a:a.Profile_Dependents_NoneContinue,typeof a===v?a.apply(n):a))+"</p>\r\n            "}function o(n){var a,e="";return e+="\r\n                <p>"+m((a=n.dictionary,a=null==a||a===!1?a:a.Dependent_List_Invite_To_Add,typeof a===v?a.apply(n):a))+"</p>\r\n            "}function d(n){var a,e="";return e+="\r\n            "+m((a=n.dictionary,a=null==a||a===!1?a:a.Dependent_List_AddDependent,typeof a===v?a.apply(n):a))+"\r\n        "}function u(n){var a,e="";return e+="\r\n            "+m((a=n.dictionary,a=null==a||a===!1?a:a.Dependent_List_AddAnotherDependent,typeof a===v?a.apply(n):a))+"\r\n        "}function c(n){var a,e="";return e+='\r\n            <button type="button" class="btn primary full-width" onClick="window.app.screens.dependentList.wizard();"><span>'+m((a=n.dictionary,a=null==a||a===!1?a:a.Profile_SaveContinue,typeof a===v?a.apply(n):a))+"</span></button>\r\n        "}this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,n.helpers),t=this.merge(t,n.partials),r=r||{};var f,y,h="",v="function",m=this.escapeExpression,g=this,D=e.helperMissing;return h+='<section class="screen" id="',(f=e.containerId)?f=f.call(a,{hash:{},data:r}):(f=a.containerId,f=typeof f===v?f.apply(a):f),h+=m(f)+'">\r\n    ',f=g.invokePartial(t.header,"header",a,e,t,r),(f||0===f)&&(h+=f),h+='\r\n    <div id="dependentListContainerForm">\r\n        <h1>'+m((f=a.dictionary,f=null==f||f===!1?f:f.Dependent_List_Title,typeof f===v?f.apply(a):f))+'</h1>\r\n        <div class="flex">\r\n                <p class="dark center half-m-after">'+m((f=a.dictionary,f=null==f||f===!1?f:f.Dependent_List_Intro,typeof f===v?f.apply(a):f))+"</p>\r\n                <p>"+m((f=a.dictionary,f=null==f||f===!1?f:f.Dependent_List_Presentation,typeof f===v?f.apply(a):f))+"</p>\r\n            <ul>\r\n                ",y=e.each.call(a,(f=a.data,null==f||f===!1?f:f.dependants),{hash:{},inverse:g.noop,fn:g.programWithDepth(1,l,r,a),data:r}),(y||0===y)&&(h+=y),h+="\r\n            </ul>\r\n            ",y=e.unless.call(a,(f=a.data,null==f||f===!1?f:f.hasDependants),{hash:{},inverse:g.noop,fn:g.program(4,i,r),data:r}),(y||0===y)&&(h+=y),h+='\r\n        </div> \r\n        \r\n    <button type="button" class="btn alternative full-width" onClick="window.app.screens.dependentList.addDependent();"><span>\r\n        ',y=e.unless.call(a,(f=a.data,null==f||f===!1?f:f.hasDependants),{hash:{},inverse:g.program(11,u,r),fn:g.program(9,d,r),data:r}),(y||0===y)&&(h+=y),h+="</span></button>\r\n\r\n        ",y=e["if"].call(a,(f=a.mobileApp,null==f||f===!1?f:f.isInProfileWizard),{hash:{},inverse:g.noop,fn:g.program(13,c,r),data:r}),(y||0===y)&&(h+=y),h+='        \r\n            \r\n        <a href="#" class="btn secondary" onclick="window.app.screens.mainMenu.profile();"><span>'+m((f=a.dictionary,f=null==f||f===!1?f:f.Dependent_List_Cancel,typeof f===v?f.apply(a):f))+"</span></a>\r\n    </div>\r\n    ",y=g.invokePartial(t.footer,"footer",a,e,t,r),(y||0===y)&&(h+=y),h+="\r\n</section>"})}();
﻿!function(){var e=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["Welcome.html"]=e(function(e,l,a,n,r){function o(e,l){var n,r="";return r+='\r\n                <option value="',(n=a.email)?n=n.call(e,{hash:{},data:l}):(n=e.email,n=typeof n===s?n.apply(e):n),r+=c(n)+'">',(n=a.firstName)?n=n.call(e,{hash:{},data:l}):(n=e.firstName,n=typeof n===s?n.apply(e):n),r+=c(n)+" ",(n=a.lastName)?n=n.call(e,{hash:{},data:l}):(n=e.lastName,n=typeof n===s?n.apply(e):n),r+=c(n)+"</option>\r\n                "}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),n=this.merge(n,e.partials),r=r||{};var i,t,p="",s="function",c=this.escapeExpression,d=this;return p+='<section class="screen logged-out" id="',(i=a.containerId)?i=i.call(l,{hash:{},data:r}):(i=l.containerId,i=typeof i===s?i.apply(l):i),p+=c(i)+'">\r\n    ',i=d.invokePartial(n.header,"header",l,a,n,r),(i||0===i)&&(p+=i),p+="\r\n    <h1>"+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Title,typeof i===s?i.apply(l):i))+'</h1>\r\n    <fieldset> \r\n        <p class="center text-shadow">'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_IntroText,typeof i===s?i.apply(l):i))+'</p>\r\n        <a class="btn alternative" onclick="window.app.screens.selectAssociation.show();">'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_AddUser_Button,typeof i===s?i.apply(l):i))+'</a>\r\n        <p class="dark center">'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Text,typeof i===s?i.apply(l):i))+'</p>\r\n        <div class="radio-group legend-margin">\r\n            <select onChange="window.app.screens.welcome.loadRemembered(this);">\r\n                <option value="">'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_SelectLogin,typeof i===s?i.apply(l):i))+"</option>\r\n                ",t=a.each.call(l,(i=l.data,null==i||i===!1?i:i.rememberedProfiles),{hash:{},inverse:d.noop,fn:d.program(1,o,r),data:r}),(t||0===t)&&(p+=t),p+='\r\n            </select>\r\n        </div>\r\n        <div id="emailRequiredError" class="control-group error" style="display: none;">        \r\n            '+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Email_Required,typeof i===s?i.apply(l):i))+'\r\n        </div>\r\n        <div id="loginError" class="control-group error" style="display: none;">\r\n            '+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Login_Invalid,typeof i===s?i.apply(l):i))+'\r\n        </div>\r\n        <div id="loginEmailNotValidatedError" class="control-group error" style="display: none;">\r\n            ',i=l.dictionary,i=null==i||i===!1?i:i.Welcome_EmailNotValidated,t=typeof i===s?i.apply(l):i,(t||0===t)&&(p+=t),p+='\r\n        </div>\r\n        <div class="loggin">\r\n            <div class="control-group">\r\n                <label class="control-label" for="studentId"><span>'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Email_Label,typeof i===s?i.apply(l):i))+'</span></label>\r\n                <input type="email" class="required" id="email" placeholder="'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Email_PlaceHolder,typeof i===s?i.apply(l):i))+'" title="'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Email_Required,typeof i===s?i.apply(l):i))+'" />\r\n            </div>\r\n            <div class="control-group">\r\n                <label class="control-label" for="password"><span>'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Password_Label,typeof i===s?i.apply(l):i))+'</span></label>\r\n                <input type="password" class="required input-xlarge" id="password" placeholder="'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Password_PlaceHolder,typeof i===s?i.apply(l):i))+'" title="'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Password_Required,typeof i===s?i.apply(l):i))+'" />\r\n            </div>\r\n            <div class="radio-group legend-margin">\r\n                <label for="rememberMe" class="special-color transparent" style="font-weight: bold; color: #fff;">\r\n                    <input type="checkbox" id="rememberMe" name="rememberMe" value="rememberMe" />\r\n                    '+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_RememberMe,typeof i===s?i.apply(l):i))+'\r\n                </label>\r\n            </div>\r\n            <div class="form-actions">\r\n                <a class="btn primary" onclick="window.app.screens.welcome.login();"><span>'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_Login_Button,typeof i===s?i.apply(l):i))+'</span></a>\r\n            </div>\r\n            \r\n            <p class="dark">'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_HelpTitle,typeof i===s?i.apply(l):i))+'</p> \r\n            <ul class="link-group">\r\n                <li>\r\n                    <a onclick="window.app.screens.forgotPassword.show();">\r\n                        <img class="ico" src="data:image/jpeg;base64, '+c((i=l.uiData,i=null==i||i===!1?i:i.whiteArrowIcon,i=null==i||i===!1?i:i.thumbnail,typeof i===s?i.apply(l):i))+'" />\r\n                        <span>'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_ForgotPassword,typeof i===s?i.apply(l):i))+'</span>\r\n                    </a>\r\n                </li>\r\n                <li>\r\n                    <a onclick="window.app.screens.mainMenu.support();">\r\n                        <img class="ico" src="data:image/jpeg;base64, '+c((i=l.uiData,i=null==i||i===!1?i:i.whiteArrowIcon,i=null==i||i===!1?i:i.thumbnail,typeof i===s?i.apply(l):i))+'" />\r\n                        <span>'+c((i=l.dictionary,i=null==i||i===!1?i:i.Welcome_ContactSupport,typeof i===s?i.apply(l):i))+"</span>\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n        \r\n    ",t=d.invokePartial(n.footer,"footer",l,a,n,r),(t||0===t)&&(p+=t),p+="\r\n</section>"})}();
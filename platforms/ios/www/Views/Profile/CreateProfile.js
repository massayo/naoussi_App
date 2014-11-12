﻿!function(){var l=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["CreateProfile.html"]=l(function(l,e,a,r,n){this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,l.helpers),r=this.merge(r,l.partials),n=n||{};var i,o,t="",p="function",s=this.escapeExpression,d=this;return t+='<section class="screen logged-out" id="',(i=a.containerId)?i=i.call(e,{hash:{},data:n}):(i=e.containerId,i=typeof i===p?i.apply(e):i),t+=s(i)+'">\r\n    ',i=d.invokePartial(r.header,"header",e,a,r,n),(i||0===i)&&(t+=i),t+="\r\n\r\n    <h1>"+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Create_Title,typeof i===p?i.apply(e):i))+'</h1>\r\n    <form id="profileForm" class="form-profile m-after-default">\r\n\r\n        \r\n        \r\n    <p class="dark center">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Create_Text,typeof i===p?i.apply(e):i))+'</p>\r\n        \r\n    <div id="validationError" class="control-group error" style="display: none;">\r\n        '+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ValidationErrors,typeof i===p?i.apply(e):i))+"\r\n    </div>\r\n        <fieldset>\r\n\r\n                    <legend>"+s((i=e.data,i=null==i||i===!1?i:i.associationData,i=null==i||i===!1?i:i.studentIdTitle,typeof i===p?i.apply(e):i))+'</legend>\r\n                    <p class="subText m-before legend-margin">'+s((i=e.data,i=null==i||i===!1?i:i.associationData,i=null==i||i===!1?i:i.studentIdText,typeof i===p?i.apply(e):i))+'</p>\r\n                    <div class="control-group">\r\n                        <label class="control-label" for="studentId">'+s((i=e.data,i=null==i||i===!1?i:i.associationData,i=null==i||i===!1?i:i.studentIdLabel,typeof i===p?i.apply(e):i))+'</label>\r\n                        <input type="text" class="required" id="studentId" name="studentId" value="'+s((i=e.profile,i=null==i||i===!1?i:i.studentId,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.data,i=null==i||i===!1?i:i.associationData,i=null==i||i===!1?i:i.studentIdPlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.data,i=null==i||i===!1?i:i.associationData,i=null==i||i===!1?i:i.studentIdRequired,typeof i===p?i.apply(e):i))+'" />\r\n                    </div>\r\n\r\n        </fieldset>\r\n        <fieldset>\r\n            <legend>'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Identification_Title,typeof i===p?i.apply(e):i))+'</legend>\r\n            <p class="subText m-before legend-margin">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Name,typeof i===p?i.apply(e):i))+'</p>\r\n            <div class="control-group">\r\n                <label class="control-label" for="firstname">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_FirstName_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="text" class="required" id="firstname" name="firstname" value="'+s((i=e.profile,i=null==i||i===!1?i:i.firstName,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_FirstName_PlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_FirstName_Required,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <div class="control-group">\r\n                <label class="control-label" for="lastname">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LastName_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="text" class="required" id="lastname" name="lastname" value="'+s((i=e.profile,i=null==i||i===!1?i:i.lastName,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LastName_PlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LastName_Required,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <p class="">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Name_Text,typeof i===p?i.apply(e):i))+'</p>\r\n        </fieldset>\r\n            \r\n        <fieldset>\r\n            <p class="subText">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Gender_Title,typeof i===p?i.apply(e):i))+'</p>\r\n            <select id="gender" name="gender" class="required">\r\n                <option value="">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_EmptyGender,typeof i===p?i.apply(e):i))+'</option>\r\n                <option value="Male">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Gender_Male,typeof i===p?i.apply(e):i))+'</option>\r\n                <option value="Female">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Gender_Female,typeof i===p?i.apply(e):i))+'</option>\r\n            </select>\r\n        </fieldset>\r\n\r\n        <fieldset>\r\n            <p class="subText">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_DateOfBirth_LabelText,typeof i===p?i.apply(e):i))+'</p>\r\n            <div class="control-group birth-date">\r\n                <label class="control-label" for="birthdate">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_DateOfBirth_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="date" class="required" id="birthdate" name="birthdate" value="'+s((i=e.profile,i=null==i||i===!1?i:i.dateOfBirth,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_DateOfBirth_PlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_DateOfBirth_Required,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <p class="">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Brithdate_Text,typeof i===p?i.apply(e):i))+'</p>\r\n        </fieldset>\r\n\r\n        <fieldset>\r\n            <p class="subText">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Email_Title,typeof i===p?i.apply(e):i))+'</p>\r\n            <div class="control-group">\r\n                <label class="control-label" for="email">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Email_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="email" class="required" id="email" name="email" value="'+s((i=e.profile,i=null==i||i===!1?i:i.email,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Email_PlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Email_Required,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <div class="control-group">\r\n                <label class="control-label" for="confirmEmail">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmEmail_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="email" id="confirmEmail" name="confirmEmail" value="'+s((i=e.profile,i=null==i||i===!1?i:i.confirmEmail,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmEmail_PlaceHolder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmEmail_Validate,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <p class="">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Email_Text,typeof i===p?i.apply(e):i))+"</p>\r\n        </fieldset>\r\n        <fieldset>\r\n            <legend>"+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_SecurePassword_Title,typeof i===p?i.apply(e):i))+'</legend>\r\n            <p class="subText m-before legend-margin">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Password_Title,typeof i===p?i.apply(e):i))+'</p>\r\n            <div class="control-group">\r\n                <label class="control-label" for="password">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Password_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="password" id="password" name="password" class="required" value="'+s((i=e.profile,i=null==i||i===!1?i:i.password,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Password_Placeholder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Password_Required,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <div class="control-group">\r\n                <label class="control-label" for="confirmPassword">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmPassword_Label,typeof i===p?i.apply(e):i))+'</label>\r\n                <input type="password" id="confirmPassword" name="confirmPassword" value="'+s((i=e.profile,i=null==i||i===!1?i:i.confirmPassword,typeof i===p?i.apply(e):i))+'" placeholder="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmPassword_Placeholder,typeof i===p?i.apply(e):i))+'" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_ConfirmPassword_Validation,typeof i===p?i.apply(e):i))+'" />\r\n            </div>\r\n            <p class="">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Password_Text,typeof i===p?i.apply(e):i))+'</p>\r\n            </fieldset>\r\n            <fieldset>   \r\n            <p class="subText">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LogoutOptions_Label,typeof i===p?i.apply(e):i))+'</p>\r\n                \r\n            <div class="radio-group">\r\n                    \r\n                <label><input type="radio" id="logoutOption-yes" name="logoutOption" value="true"/>'+s((i=e.dictionary,i=null==i||i===!1?i:i.Common_Yes,typeof i===p?i.apply(e):i))+".\r\n                    "+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LogoutOption_Yes,typeof i===p?i.apply(e):i))+'</label>\r\n            </div>\r\n            <div class="radio-group">\r\n                    \r\n                <label><input type="radio" id="logoutOption-no" name="logoutOption" value="false" checked="checked" />'+s((i=e.dictionary,i=null==i||i===!1?i:i.Common_No,typeof i===p?i.apply(e):i))+".\r\n                    "+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_LogoutOption_No,typeof i===p?i.apply(e):i))+"</label>\r\n            </div>\r\n                \r\n        </fieldset>\r\n            \r\n        <fieldset>\r\n            <legend>"+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_Title,typeof i===p?i.apply(e):i))+'</legend>\r\n                <div class="radio-group legend-margin">\r\n                        \r\n                    <label for="createProfileAgree" class="special-color transparent" style="font-weight:bold"><input type="checkbox" id="createProfileAgree" class="required" name="createProfileAgree" value="agree" title="'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_Required,typeof i===p?i.apply(e):i))+'"/>\r\n                        '+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_Agree,typeof i===p?i.apply(e):i))+"\r\n                        <a onclick=\"showOverlay('Overlay-Terms', '",(o=a.containerId)?o=o.call(e,{hash:{},data:n}):(o=e.containerId,o=typeof o===p?o.apply(e):o),t+=s(o)+"'); return false;\">"+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_License,typeof i===p?i.apply(e):i))+"</a>\r\n                        "+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_And,typeof i===p?i.apply(e):i))+"\r\n                        <a onclick=\"showOverlay('Overlay-Privacy', '",(o=a.containerId)?o=o.call(e,{hash:{},data:n}):(o=e.containerId,o=typeof o===p?o.apply(e):o),t+=s(o)+"'); return false;\">"+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Terms_Privacy,typeof i===p?i.apply(e):i))+'</a>\r\n                    </label>\r\n                </div> \r\n            \r\n\r\n        </fieldset>\r\n            <div class="controls">\r\n                <button type="submit" class="btn primary full-width">\r\n                    <span>'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Submit,typeof i===p?i.apply(e):i))+'</span>\r\n                </button>\r\n                <a href="#" class="btn secondary" onclick="window.app.screens.createProfile.cancel();">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Profile_Cancel,typeof i===p?i.apply(e):i))+"\r\n                </a>\r\n            </div>\r\n    </form>\r\n        \r\n    ",o=d.invokePartial(r.footer,"footer",e,a,r,n),(o||0===o)&&(t+=o),t+='\r\n</section>\r\n    \r\n<div id="Overlay-Terms" class="overlay" style="display:none;">\r\n    <section class="screen logged-out">\r\n        <header class="header">\r\n            <nav>\r\n                <a class="btn-nav btn" onclick="hideOverlay(\'Overlay-Terms\', \'',(o=a.containerId)?o=o.call(e,{hash:{},data:n}):(o=e.containerId,o=typeof o===p?o.apply(e):o),t+=s(o)+'\'); return false;" id="headerPreviousPlaceHolder">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Common_Back,typeof i===p?i.apply(e):i))+'</a>\r\n            </nav>\r\n            <div class="banner">\r\n                <img alt="" src="data:image/jpeg;base64,'+s((i=e.appData,i=null==i||i===!1?i:i.headerLogo,i=null==i||i===!1?i:i.presentation,typeof i===p?i.apply(e):i))+'" />\r\n            </div>  \r\n        </header>\r\n        <div class="main">\r\n        ',i=e.appData,i=null==i||i===!1?i:i.terms,o=typeof i===p?i.apply(e):i,(o||0===o)&&(t+=o),t+='\r\n        </div>\r\n    </section>\r\n</div>\r\n    \r\n<div id="Overlay-Privacy" class="overlay" style="display:none;">\r\n    <section class="screen logged-out">\r\n        <header class="header">\r\n            <nav>\r\n                <a class="btn-nav btn" onclick="hideOverlay(\'Overlay-Privacy\', \'',(o=a.containerId)?o=o.call(e,{hash:{},data:n}):(o=e.containerId,o=typeof o===p?o.apply(e):o),t+=s(o)+'\'); return false;" id="headerPreviousPlaceHolder">'+s((i=e.dictionary,i=null==i||i===!1?i:i.Common_Back,typeof i===p?i.apply(e):i))+'</a>\r\n            </nav>\r\n            <div class="banner">\r\n                <img alt="" src="data:image/jpeg;base64,'+s((i=e.appData,i=null==i||i===!1?i:i.headerLogo,i=null==i||i===!1?i:i.presentation,typeof i===p?i.apply(e):i))+'" />\r\n            </div>  \r\n        </header>\r\n        <div class="main">\r\n        ',i=e.appData,i=null==i||i===!1?i:i.privacy,o=typeof i===p?i.apply(e):i,(o||0===o)&&(t+=o),t+="\r\n        </div>\r\n    </section>\r\n</div>"})}();
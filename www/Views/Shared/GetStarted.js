﻿!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["GetStarted.html"]=a(function(a,e,t,r,n){function s(a,e){var r,n="";return n+='\r\n            <div class="item ',(r=t.active)?r=r.call(a,{hash:{},data:e}):(r=a.active,r=typeof r===d?r.apply(a):r),n+=p(r)+'">\r\n                <img alt="" src="data:image/jpeg;base64,',(r=t.presentation)?r=r.call(a,{hash:{},data:e}):(r=a.presentation,r=typeof r===d?r.apply(a):r),n+=p(r)+'" />\r\n            </div>\r\n            '}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,a.helpers),r=this.merge(r,a.partials),n=n||{};var i,l,o,c="",d="function",p=this.escapeExpression,h=this,u=t.helperMissing;return c+='<section class="screen getStarted logged-out" id="',(i=t.containerId)?i=i.call(e,{hash:{},data:n}):(i=e.containerId,i=typeof i===d?i.apply(e):i),c+=p(i)+'">\r\n    ',i=h.invokePartial(r.header,"header",e,t,r,n),(i||0===i)&&(c+=i),c+='\r\n        \r\n    <div id="getStartedCarousel" class="carousel slide">\r\n        <div class="carousel-inner">\r\n            ',o={hash:{},inverse:h.noop,fn:h.program(1,s,n),data:n},i=t["each-first-active"]||e["each-first-active"],l=i?i.call(e,e.data,o):u.call(e,"each-first-active",e.data,o),(l||0===l)&&(c+=l),c+='\r\n        </div>\r\n        <a class="carousel-control left" href="#getStartedCarousel" data-slide="prev">&lsaquo;</a>\r\n        <a class="carousel-control right" href="#getStartedCarousel" data-slide="next">&rsaquo;</a>\r\n    </div>\r\n   \r\n    <button type="button" class="btn primary" id="getStarted-continue" style="z-index: 99;" onClick="window.app.screens.getStarted.next();">\r\n        <span>'+p((i=e.dictionary,i=null==i||i===!1?i:i.GetStarted_Button,typeof i===d?i.apply(e):i))+"</span>\r\n    </button>\r\n</section>"})}();
function MSG(b,a){return chrome.i18n.getMessage(b,a)}$(function(){$("span[data-msg],option[data-msg]").each(function(a,b){var c=$(b).attr("data-msg");var d=MSG(c);if(d){$(b).html(d)}});$("input:button[data-msg],input:radio[data-msg]").each(function(a,b){var c=$(b).attr("data-msg");var d=MSG(c);if(d){$(b).val(d)}});$("[data-msg][data-msg-attr]").each(function(b,c){var d=$(c).attr("data-msg");var a=$(c).attr("data-msg-attr");$(c).attr(a,MSG(d))});$("[data-msg-title]").each(function(a,b){var c=$(b).attr("data-msg-title");$(b).attr("title",MSG(c))})});function removeGA(){if(_gaq&&$('script[src$="/ga.js"]').length){$('script[src$="/ga.js"]').remove()}}var G_CONFIG={commonRuleUrl:function(){return chrome.extension.getURL("rules.json")}(),getRules:function(){var a=this.getUserRules();var b=this.getCommonRules();return $.merge(a,b)},getCommonRules:function(){var b=[];if(localStorage.commonRules!=undefined&&localStorage.commonRules!=""){try{commonRules=JSON.parse(localStorage.commonRules);$(commonRules).each(function(c,d){b.push(d)})}catch(a){console.log("parse CommonRule error!!",a)}}return b},getUserRules:function(){var b=[];if(localStorage.userRules==undefined){localStorage.userRules=="[]"}try{userRules=JSON.parse(localStorage.userRules);$(userRules).each(function(c,d){b.push(d)})}catch(a){console.log("parse UserRule error!!",a)}return b},saveUserRule:function(b){var a=JSON.stringify(b,null,null);localStorage.userRules=a},updateCommonRule:function(a){$.get(this.commonRuleUrl+"?rnd="+Math.random(),function(c){try{a=a||{};JSON.parse(c);localStorage.commonRules=c;localStorage.ruleLastUpdateTime=new Date();if(typeof a.callback=="function"){a.callback(c)}}catch(b){console.log("updateCommonRule error!!",b)}})},setOutputTextFormat:function(a){localStorage.outputTextFormat=a},getOutputTextFormat:function(){return localStorage.outputTextFormat||'<img src="{LINK}"/>'},setRenameRule:function(a){localStorage.renameRule=a},getRenameRule:function(){return localStorage.renameRule||"pic_{NO001}.{EXT}"},setRenameMode:function(a){localStorage.renameMode=a},getRenameMode:function(){return localStorage.renameMode||"1"}};var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-54846932-1"]);_gaq.push(["_trackPageview"]);(function(){var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src=chrome.extension.getURL("js/ga.js");var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)})();
!function(n,e){"use strict";function t(){var n=e.createElement("style");n.type="text/css",n.innerHTML=u(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}",[f,m,j]),e.getElementsByTagName("head")[0].appendChild(n)}function r(t){"interactive"===e.readyState||"complete"===e.readyState?i(t):n.addEventListener("DOMContentLoaded",function(){i(t)})}function i(t){try{var r=e.querySelectorAll("code.hljs,code.nohighlight");for(var i in r)r.hasOwnProperty(i)&&l(r[i],t)}catch(o){n.console.error("LineNumbers error: ",o)}}function l(n,e){if("object"==typeof n){e=e||{singleLine:!1};var t=e.singleLine?0:1;h(function(){s(n),n.innerHTML=o(n.innerHTML,t)})}}function o(n,e){var t=c(n);if(""===t[t.length-1].trim()&&t.pop(),t.length>e){for(var r="",i=0,l=t.length;i<l;i++)r+=u('<tr><td class="{0}"><div class="{1} {2}" {3}="{5}"></div></td><td class="{4}"><div class="{1}">{6}</div></td></tr>',[p,g,m,j,v,i+1,t[i].length>0?t[i]:" "]);return u('<table class="{0}">{1}</table>',[f,r])}return n}function s(n){var e=n.childNodes;for(var t in e)if(e.hasOwnProperty(t)){var r=e[t];d(r.textContent)>0&&(r.childNodes.length>0?s(r):a(r.parentNode))}}function a(n){var e=n.className;if(/hljs-/.test(e)){for(var t=c(n.innerHTML),r=0,i="";r<t.length;r++){var l=t[r].length>0?t[r]:" ";i+=u('<span class="{0}">{1}</span>\n',[e,l])}n.innerHTML=i.trim()}}function c(n){return 0===n.length?[]:n.split(L)}function d(n){return(n.trim().match(L)||[]).length}function h(e){n.setTimeout(e,0)}function u(n,e){return n.replace(/\{(\d+)\}/g,function(n,t){return e[t]?e[t]:n})}var f="hljs-ln",g="hljs-ln-line",v="hljs-ln-code",p="hljs-ln-numbers",m="hljs-ln-n",j="data-line-number",L=/\r\n|\r|\n/g;n.hljs?(n.hljs.initLineNumbersOnLoad=r,n.hljs.lineNumbersBlock=l,t()):n.console.error("highlight.js not detected!")}(window,document);
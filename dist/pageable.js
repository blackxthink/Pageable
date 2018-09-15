/*!
 * Pageable 0.1.1
 * http://mobius.ovh/
 *
 * Released under the MIT license
 */
var Pageable=function(b,a){var d=this;if(void 0===b)return console.error("Pageable:","No container defined.");var c={pips:!0,interval:300,delay:0,throttle:50,orientation:"vertical",easing:function(a,b,d,c,f){return-d*(a/=c)*(a-2)+b},onInit:function(){},onUpdate:function(){},onBeforeStart:function(){},onStart:function(){},onScroll:function(){},onFinish:function(){},events:{wheel:!0,mouse:!0,touch:!0}};this.container="string"===typeof b?document.querySelector(b):b;if(!this.container)return console.error("Pageable:",
"The container could not be found.");this.config=Object.assign({},c,a);this.events=Object.assign({},c.events,a.events);if(this.config.anchors&&Array.isArray(this.config.anchors)){var f=document.createDocumentFragment();this.config.anchors.forEach(function(a){var b=document.createElement("div");b.dataset.anchor=a;f.appendChild(b)});this.container.appendChild(f)}this.pages=Array.from(this.container.querySelectorAll("[data-anchor]"));if(!this.pages.length)return console.error("Pageable:","No child nodes with the [data-anchor] attribute could be found.");
this.horizontal="horizontal"===this.config.orientation;this.anchors=[];this.pages.forEach(function(a,b){var c=a.dataset.anchor.replace(/\s+/,"-");a.id!==c&&(a.id=c);d.anchors.push("#"+c);a.classList.add("pg-page");a.classList.toggle("pg-active",0==b)});this.axis=this.horizontal?"x":"y";this.mouseAxis={x:"clientX",y:"clientY"};this.scrollAxis={x:"scrollLeft",y:"scrollTop"};this.size={x:"width",y:"height"};this.bar=this.getScrollBarWidth();this.wrapper=document.createElement("div");this.index=0;this.touch=
"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch;this.init()};
Pageable.prototype.init=function(){this.container.parentNode.insertBefore(this.wrapper,this.container);this.wrapper.appendChild(this.container);this.wrapper.classList.add("pg-wrapper","pg-"+this.config.orientation);this.wrapper.classList.add("pg-wrapper");this.container.classList.add("pg-container");document.body.style.margin=0;document.body.style.overflow="hidden";if(this.config.pips){var b=document.createElement("nav"),a=document.createElement("ul");this.pages.forEach(function(b,c){var d=document.createElement("li"),
e=document.createElement("a"),g=document.createElement("span");e.href="#"+b.id;0==c&&e.classList.add("active");e.appendChild(g);d.appendChild(e);a.appendChild(d)});b.appendChild(a);this.wrapper.appendChild(b);this.pips=Array.from(a.children)}this.bind()};
Pageable.prototype.bind=function(){var b=arguments,a=this;this.callbacks={wheel:this.wheel.bind(this),update:function(d,c,f){var e;return function(){f=f||a;if(!e)return d.apply(f,b),e=!0,setTimeout(function(){e=!1},c)}}(this.update.bind(this),this.config.throttle),load:this.load.bind(this),start:this.start.bind(this),stop:this.stop.bind(this)};this.wrapper.addEventListener("wheel",this.callbacks.wheel,!1);window.addEventListener("resize",this.callbacks.update,!1);this.wrapper.addEventListener(this.touch?
"touchstart":"mousedown",this.callbacks.start,!1);this.wrapper.addEventListener(this.touch?"touchend":"mouseup",this.callbacks.stop,!1);document.addEventListener("DOMContentLoaded",this.callbacks.load,!1);document.addEventListener("click",function(b){var c=b.target.closest("a");c&&-1<a.anchors.indexOf(c.hash)&&(b.preventDefault(),a.scrollToAnchor(c.hash))},!1)};
Pageable.prototype.start=function(b){if("touchstart"===b.type&&!this.events.touch)return!1;if("mousedown"===b.type&&!this.events.mouse)return 1===b.button&&b.preventDefault(),!1;b.preventDefault();b.stopPropagation();b=this.touch?b.touches[0]:b;if(!b.target.closest("[data-anchor]"))return!1;this.down={x:b.clientX,y:b.clientY};this.config.onBeforeStart.call(this,this.index)};
Pageable.prototype.stop=function(b){var a=this,d=function(){return a.index<a.pages.length-1&&a.index++};if(this.down&&!this.scrolling){var c=this.index;this.touch?b.changedTouches[0][this.mouseAxis[this.axis]]<this.down[this.axis]?d():b.changedTouches[0][this.mouseAxis[this.axis]]>this.down[this.axis]&&0<a.index&&a.index--:b[this.mouseAxis[this.axis]]<this.down[this.axis]?1===b.button?0<a.index&&a.index--:d():b[this.mouseAxis[this.axis]]>this.down[this.axis]&&(1===b.button?d():0<a.index&&a.index--);
c===this.index?this.config.onFinish.call(this,this.getData()):(this.oldIndex=c,this.scrollBy(this.getScrollAmount(c)));this.down=!1}};Pageable.prototype.wheel=function(b){b.preventDefault();if(this.events.wheel&&!this.scrolling){var a=this.index;0<b.deltaY?this.index<this.pages.length-1&&this.index++:0<this.index&&this.index--;this.index!==a&&(this.oldIndex=a,this.scrollBy(this.getScrollAmount(a)))}};
Pageable.prototype.load=function(b){var a=this;if(b=location.hash)b=this.anchors.indexOf(b),-1<b&&(this.index=b,this.setPips(),this.pages.forEach(function(b,c){b.classList.toggle("pg-active",c===a.index)}),this.config.onFinish.call(this,this.getData()));this.update();b=this.getData();this.config.onInit.call(this,b);this.emit("init",b)};
Pageable.prototype.setPips=function(b){this.config.pips&&(void 0===b&&(b=this.index),this.pips.forEach(function(a,d){a.firstElementChild.classList.toggle("active",d==b)}))};Pageable.prototype.getScrollAmount=function(b,a){void 0===a&&(a=this.index);var d=this.data.window[this.size[this.axis]];return d*b-d*a};
Pageable.prototype.scrollBy=function(b){var a=this;if(this.scrolling)return!1;this.scrolling=!0;this.config.onBeforeStart.call(this,this.oldIndex);this.emit("scroll.before",this.getData());this.timer=setTimeout(function(){var d=Date.now(),c=a.getScrollOffset();a.setPips();var f=function(){var e=Date.now()-d;if(e>a.config.interval)return cancelAnimationFrame(a.frame),a.container.style.transform="",a.frame=!1,a.scrolling=!1,window.location.hash=a.pages[a.index].id,a.pages.forEach(function(b,c){b.classList.toggle("pg-active",
c===a.index)}),e=a.getData(),a.config.onFinish.call(a,e),a.emit("scroll.end",e),!1;e=a.config.easing(e,0,b,a.config.interval);a.container.style.transform=a.horizontal?"translate3d("+e+"px, 0, 0)":"translate3d(0, "+e+"px, 0)";a.scrollPosition=c[a.axis]-e;e=a.getData();a.config.onScroll.call(a,e);a.emit("scroll",e);a.frame=requestAnimationFrame(f)};a.config.onStart.call(a,a.pages[a.index].id);a.emit("scroll.start",a.getData());a.frame=requestAnimationFrame(f)},this.config.delay)};
Pageable.prototype.scrollToPage=function(b){this.scrollToIndex(b-1)};Pageable.prototype.scrollToAnchor=function(b){this.scrollToIndex(this.anchors.indexOf(b))};Pageable.prototype.next=function(){this.scrollToIndex(this.index+1)};Pageable.prototype.prev=function(){this.scrollToIndex(this.index-1)};Pageable.prototype.scrollToIndex=function(b){if(!this.scrolling&&0<=b&&b<=this.pages.length-1){var a=this.index;this.index=b;this.oldIndex=a;this.scrollBy(this.getScrollAmount(a))}};
Pageable.prototype.update=function(){var b=this;clearTimeout(this.timer);this.data={window:{width:window.innerWidth,height:window.innerHeight},container:{height:this.wrapper.scrollHeight,width:this.wrapper.scrollWidth}};var a=this.size[this.axis],d=this.horizontal?this.size.y:this.size.x;this.wrapper.style["overflow-"+this.axis]="scroll";this.wrapper.style[a]=this.data.window[a]+"px";this.wrapper.style[d]=this.data.window[d]+this.bar+"px";this.container.style[a]=this.pages.length*this.data.window[a]+
"px";this.wrapper.style["padding-"+(this.horizontal?"bottom":"right")]=this.bar+"px";this.wrapper[this.scrollAxis[this.axis]]=this.index*this.data.window[a];this.scrollSize=this.pages.length*this.data.window[a]-this.data.window[a];this.scrollPosition=this.data.window[a]*this.index;this.pages.forEach(function(c,f){b.horizontal&&(c.style["float"]="left");c.style[a]=b.data.window[a]+"px";c.style[d]=b.data.window[d]+"px"});this.config.onUpdate.call(this,this.getData());this.emit("update",this.getData())};
Pageable.prototype.getData=function(){return{index:this.index,scrolled:this.scrollPosition,max:this.scrollSize}};Pageable.prototype.getScrollOffset=function(){return{x:this.wrapper.scrollLeft,y:this.wrapper.scrollTop}};
Pageable.prototype.orientate=function(b){switch(b){case "vertical":this.horizontal=!1;this.axis="y";this.container.style.width="";break;case "horizontal":this.horizontal=!0;this.axis="x";this.container.style.height="";break;default:return!1}this.wrapper.classList.toggle("pg-vertical",!this.horizontal);this.wrapper.classList.toggle("pg-horizontal",this.horizontal);this.config.orientation=b;this.update()};
Pageable.prototype.on=function(b,a){this.listeners=this.listeners||{};this.listeners[b]=this.listeners[b]||[];this.listeners[b].push(a)};Pageable.prototype.off=function(b,a){this.listeners=this.listeners||{};!1!==b in this.listeners&&this.listeners[b].splice(this.listeners[b].indexOf(a),1)};
Pageable.prototype.emit=function(b){this.listeners=this.listeners||{};if(!1!==b in this.listeners)for(var a=0;a<this.listeners[b].length;a++)this.listeners[b][a].apply(this,Array.prototype.slice.call(arguments,1))};Pageable.prototype.getScrollBarWidth=function(){var b=document.createElement("div"),a=0;return b.style.cssText="width: 100; height: 100; overflow: scroll; position: absolute; top: -9999;",document.body.appendChild(b),a=b.offsetWidth-b.clientWidth,document.body.removeChild(b),a};
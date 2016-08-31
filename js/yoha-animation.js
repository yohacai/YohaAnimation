 (function(window){
 window.Yoha = window.Yoha || {};
 var $animateQueue = [];
 var frame_duration = 16.7;
 Array.prototype.map = Array.prototype.map || function(cb) {
     for (var i = 0; i < this.length; i++) {
         cb(this[i], i);
     }
 };
 Array.prototype.indexOf = Array.prototype.indexOf || function(item) {
     for (var i = 0; i < this.length; i++) {
         if (this[i] == item) return i;
     }
     return -1;
 };

 var getFixedSize = function(el, attr , init_style) {
     if (typeof attr == 'object') {
         return {
             fixed_height: getFixedSize(el,attr.height,init_style),
             fixed_width: getFixedSize(el,attr.width,init_style)
         }
     }
     var fixed_value = 0;
     if (attr == 'height') {
        fixed_value = el.offsetHeight      -(init_style.paddingTop != 'auto' ? parseInt(init_style.paddingTop) : 0)
                                           - (init_style.paddingBottom != 'auto' ? parseInt(init_style.paddingBottom) : 0)
                                           - (init_style.borderTopWidth != 'auto' ? parseInt(init_style.borderTopWidth) : 0)
                                           - (init_style.borderBottomWidth != 'auto' ? parseInt(init_style.borderBottomWidth) : 0);
        return fixed_value;
     }
     else if(attr == 'width'){
        fixed_value = el.offsetWidth       - (init_style.paddingLeft != 'auto' ? parseInt(init_style.paddingLeft) : 0)
                                           - (init_style.paddingRight != 'auto' ? parseInt(init_style.paddingRight) : 0)
                                           - (init_style.borderLeftWidth != 'auto' ? parseInt(init_style.borderLeftWidth) : 0)
                                           - (init_style.borderRightWidth != 'auto' ? parseInt(init_style.borderRightWidth) : 0);
        return fixed_value;
     }    
     return 0;
 }
 var isEmptyObj = function(obj) {
     for (var i in obj) {
         return false;
     }
     return true;
 }
 var requestAnimationFrame = window.requestAnimationFrame || function(action) {
     setTimeout(function() {
         action();
     }, frame_duration);
 };
 Yoha.animate = function(el, option, duration, cb) {
     var empty = {};
     var style = el.style;
     var css_style = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
     var animate_task = {
         el: el,
         style: style,
         duration: duration,
         option: option,
         frame: "",
         cb: ""
     };
     var frame = {};
     for (var key in option) {
         var default_value = style[key] || css_style[key] || el[key];

         if (default_value == 'auto') {
             switch (key) {
                 case 'height':
                     default_value = el.offsetHeight + 'px';
                     break;
                 case 'width':
                     default_value = el.offsetWidth + 'px';
                     break;
                 default:
                     default_value = '0px';
                     break;
             }
         }

         if (default_value == option[key]) {
             delete option[key];
             continue;
         }

         if (!default_value) {
             switch (key) {
                 case 'opacity':
                     default_value = 1;
                     break;
                 default:
                     default_value = 0;
                     break;
             }
         }
         var difference = parseFloat(option[key]) - parseFloat(default_value);
         frame[key] = difference / (duration / frame_duration);
         animate_task[key] = default_value;
     }
     animate_task.frame = frame;
     if (!isEmptyObj(option)) {
         $animateQueue.push(animate_task);
     }
     empty.done = function(cb) {
         if (isEmptyObj(option))
             cb && cb.call(el);
         else
             animate_task.cb = cb;
     };
     return empty;
 };

 Yoha.show = function(el, duration, cb) {
     var style = el.style;
     var init_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;

     var default_style = {
         height: init_style.height,
         width: init_style.width
     };

     if (init_style.display != 'none') return;

     style.display = 'block';

     // var css_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
     var target_style = {
         height: getFixedSize(el,'height',init_style) + 'px',
         width: getFixedSize(el,'width',init_style) + 'px'
     };
     style.width = '0px';
     style.height = '0px';

     Yoha.animate(el, { width: target_style.width, height: target_style.height }, duration).done(function() {
         style.height = default_style.height;
         style.width = default_style.width;
         cb && cb.call(el);
     });
 };
 Yoha.hide = function(el, duration, cb) {
     var postfix_reg = /[\d\.]+([^0-9\.]*)/;
     var style = el.style;
     var css_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
     if (style.display == 'none' || css_style.display == 'none') return;

     var default_style = {
         height: style.height || css_style.height,
         width: style.width || css_style.width
     };

     var height_postfix = default_style.height != 'auto' ? postfix_reg.exec(default_style.height)[1] : 'px';
     var width_postfix = default_style.width != 'auto' ? postfix_reg.exec(default_style.width)[1] : 'px';

     Yoha.animate(el, { width: 0 + width_postfix, height: 0 + height_postfix }, duration).done(function() {
         style.display = 'none';
         style.height = default_style.height;
         style.width = default_style.width;
         cb && cb.call(el);
     });
 };
 Yoha.slideDown = function(el, duration, cb) {
     var style = el.style;
     var init_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;

     var default_style = {
         height: init_style.height
     };

     if (init_style.display != 'none') return;

     style.display = 'block';

     // var css_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
     var target_style = {
         height: getFixedSize(el,'height',init_style) + 'px',
     };

     style.height = '0px';

     Yoha.animate(el, { height: target_style.height }, duration).done(function() {
         style.height = default_style.height;
         cb && cb.call(el);
     });
 };
 Yoha.slideUp = function(el, duration, cb) {
     var postfix_reg = /[\d\.]+([^0-9\.]*)/;
     var style = el.style;
     var css_style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
     if (style.display == 'none' || css_style.display == 'none') return;

     var default_style = {
         height: style.height || css_style.height
     };

     var height_postfix = default_style.height != 'auto' ? postfix_reg.exec(default_style.height)[1] : 'px';
     Yoha.animate(el, { height: 0 + height_postfix }, duration).done(function() {
         style.display = 'none';
         style.height = default_style.height;
         cb && cb.call(el);
     });
 };

 function animate_start() {
     var last_time;
     var current_time;
     var window_styles = ['scrollTop'];
     var update = function animate_start() {
         var postfix_reg = /[\d\.]+([^0-9\.]*)/;
         current_time = new Date().getTime();
         $animateQueue.map(function(task, index) {
             var style = task.style;
             var frame = task.frame;
             var option = task.option;
             var cb = task.cb;
             var el = task.el;
             for (var key in option) {
                 var pattern = parseFloat(task[key]);
                 var postfix = postfix_reg.exec(option[key])[1];
                 var frame_value = frame[key];
                 if (last_time) {
                     frame_value = (current_time - last_time) / frame_duration * frame[key];
                 }
                 if (Math.abs(frame[key]) > Math.abs(pattern - parseFloat(option[key]))) {
                     for (var _key in option) {
                         if (window_styles.indexOf(_key) < 0) style[_key] = option[_key];
                         else el[_key] = option[_key];
                     }
                     $animateQueue.splice(index, 1);
                     cb && cb.call(el);
                     break;
                 } else {
                     pattern = pattern + frame[key] + postfix;
                     if (window_styles.indexOf(key) < 0) style[key] = task[key] = pattern;
                     else el[key] = task[key] = pattern;
                 }
             }
         });
         last_time = new Date().getTime();
         requestAnimationFrame(update);
     };
     update();
 }

 animate_start();

 if (window.jQuery) {
     jQuery.fn.YohaAni = function(option, duration, cb) {
         for (var i = 0; i < this.length; i++) {
             Yoha.animate(this[i], option, duration).done(cb);
         }
     }
 }
})(window);
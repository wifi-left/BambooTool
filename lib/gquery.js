// =================================================
//
// gQuery.js v1.4.9
// (c) 2020-present, JU Chengren (Ganxiaozhe)
// Released under the MIT License.
// gquery.net/about/license
//
// [fn]
// init,push,each,find,is,exist,eq,parent,next
// text,html,ohtml,val,width,height,offset
// remove,empty,prepend,append,before,after
// attr,removeAttr,data,removeData
// hasClass,addClass,removeClass,toggleClass
// css,show,hide,fadeIn,fadeOut,fadeToggle
// slideUp,slideDown,slideToggle,on,off,trigger
// click,select,load,wait
//
// [extend fn]
// isPlainObject,isWindow,isNode
// each,copy,fetch
// [extend array]
// unique,finder,has
// [extend event]
// add,remove
// [extend get]
// browserSpec,queryParam,json
// [extend parse]
// html,json
// [extend cookie]
// set,get,remove
// [extend storage]
// local,set,get,remove,clear,push
// [extend sessionStorage]
// local,set,get,remove,clear,push
// [extend chain]
// chain
// [extend date]
// parse,calc
// [extend date prototype]
// init,calc,initDate,format,diff,ago
//
// =================================================
;(function(global, factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = window || self, global.gQuery = global.$ = factory());

    if(!!window.ActiveXObject || "ActiveXObject" in window){
        window.location.href = 'https://www.gquery.net/kill-ie?back='+(window.location.href);
    }

    console.log('%c 引用模块 %c gQuery 1.4.9\n','color: #fff; background: #030307; padding:5px 0; margin-top: 1em;','background: #efefef; color: #333; padding:5px 0;');
}(window, function(){
    'use strict';
    let gQuery = function(selector, context){
        return new gQuery.fn.init(selector, context);
    };

    /* -------------------------------------
     * gQuery - prototype chain
     * ------------------------------------- */
    gQuery.fn = gQuery.prototype = {
        constructor: gQuery,
        gquery: '1.4.9',
        init: function(sel, opts){
            let to = typeof sel, elems = [];
            switch(to){
                case 'function':
                    if (document.readyState != 'loading'){sel();} else {
                        document.addEventListener('DOMContentLoaded', sel);
                    }
                    return;
                case 'object':
                    if(gQuery.isWindow(sel)){elems = [window];break;}
                    if(sel.gquery!==undefined){elems = sel;break;}

                    if(Array.isArray(sel)){
                        sel.map((val)=>{
                            $.isNode(val) && elems.push(val);
                        });
                    } else {elems.push(sel);}
                    break;
                case 'string':
                    try{elems = document.querySelectorAll(sel);} catch(err){
                        elems = $.parse.html(sel);
                    };
                    break;
            }

            switch(opts){
                case 'push':
                    let oi = this.length;
                    for(let i = elems.length-1; i >= 0; i--){
                        let rp = true;
                        for(let ii = this.length-1; ii>=0; ii--){
                            this[ii]===elems[i] && (rp=false);
                        }
                        rp && (this.length+=1, this[oi+i] = elems[i]);
                    }
                    break;
                default:
                    this.length = elems.length;
                    for (let i = elems.length - 1; i >= 0; i--) {this[i] = elems[i];}
            }

            return this;
        },
        push: function(sel){
            return this.init(sel, 'push');
        },
        each: function(arr, callback){
            callback || (callback = arr, arr = this);
            for(let i = 0,len = arr.length; i < len; i++){
                if(callback.call(arr[i], i, arr[i-1]) == false){break;}
            }
            return this;
        },
        find: function(sel, contain){
            let finder = Object.create(this), fArr = [], i;
            this.each(function(idx){
                if(!$.isNode(this)){return;}
                contain && $(this).is(sel) && fArr.push(this);

                let elems = this.querySelectorAll(sel);
                for (i = 0; i < elems.length; i++) {fArr.push(elems[i]);}
                delete finder[idx];
            });

            fArr = $.array.unique(fArr);
            finder.length = fArr.length;
            for (i = fArr.length - 1; i >= 0; i--) {finder[i] = fArr[i];}
            return finder;
        },
        is: function(sel){
            let r = false;
            this.each(function(idx){
                let _mat = (
                    this.matches || this.matchesSelector || 
                    this.msMatchesSelector || this.mozMatchesSelector || 
                    this.webkitMatchesSelector || this.oMatchesSelector
                );
                if(_mat.call(this, sel)){r = true;return false;}
            });
            return r;
        },
        exist: function(){
            let r = false;
            this.each(function(idx){
                if(document.body.contains(this)){r = true;return false;}
            });
            return r;
        },
        eq: function(idx){return $(this[idx]);},
        parent: function(){
            let finder = Object.create(this), fArr = [], i;
            this.each(function(idx){
                fArr.push(this.parentNode);delete finder[idx];
            });

            fArr = $.array.unique(fArr);
            finder.length = fArr.length;
            for (i = fArr.length - 1; i >= 0; i--) {finder[i] = fArr[i];}
            return finder;
        },
        next: function(sel){
            let finder = Object.create(this), fArr = [], elem, i;
            this.each(function(idx){
                elem = this.nextElementSibling;
                if( elem!==null && (!sel || elem.matches(sel)) ){
                    fArr.push(elem);
                }
                delete finder[idx];
            });

            fArr = $.array.unique(fArr);
            finder.length = fArr.length;
            for (i = fArr.length - 1; i >= 0; i--) {finder[i] = fArr[i];}
            return finder;
        },
        remove: function(sel){
            let rthis = ( sel === undefined ? this : this.find(sel) );
            return rthis.each(function(){this.parentNode.removeChild(this);});
        },
        empty: function(sel){
            let rthis = ( sel === undefined ? this : this.find(sel) );
            return rthis.each(function(){
                while(this.firstChild){this.removeChild(this.firstChild);}
            });
        },
        text: function(val){
            return gqHandle.thvEach.call(this,'innerText',val);
        },
        html: function(val){
            return gqHandle.thvEach.call(this,'innerHTML',val);
        },
        val: function(val){
            return gqHandle.thvEach.call(this,'value',val);
        },
        ohtml: function(val){
            return gqHandle.thvEach.call(this,'outerHTML',val);
        },
        width: function(val){
            if(val!==undefined){
                isNaN(val) || (val += 'px');
                return this.each(function(){this.style.width = val;});
            }

            let totalWidth = [], iw;
            this.each(function(){
                iw = this.offsetWidth || parseFloat(this.getBoundingClientRect().width.toFixed(2));
                totalWidth.push(iw);
            });
            return (totalWidth.length>1 ? totalWidth : totalWidth[0]);
        },
        height: function(val){
            if(val!==undefined){
                isNaN(val) || (val += 'px');
                return this.each(function(){this.style.height = val;});
            }

            let totalHeight = [], ih;
            this.each(function(){
                ih = this.offsetHeight || parseFloat(this.getBoundingClientRect().height.toFixed(2));
                totalHeight.push(ih);
            });
            return (totalHeight.length>1 ? totalHeight : totalHeight[0]);
        },
        offset: function(opts){
            if(typeof opts === 'object'){
                return this.each(function(){
                    for(let key in opts){
                        isNaN(opts[key]) || (opts[key]+='px');
                        this.style[key] = opts[key];
                    }
                });
            }

            let rect = this[0].getBoundingClientRect(), spos = {
                top: document.body.scrollTop==0?document.documentElement.scrollTop:document.body.scrollTop,
                left: document.body.scrollLeft==0?document.documentElement.scrollLeft:document.body.scrollLeft
            };
            opts && (spos.top=0, spos.left=0);
            
            return {
                top: rect.top + spos.top, left: rect.left + spos.left
            }
        },
        append: function(elem){
            return gqHandle.pend.call(this, 'appendChild', elem);
        },
        prepend: function(elem){
            return gqHandle.pend.call(this, 'insertBefore', elem);
        },
        insertBefore: function(elem){
            return gqHandle.pend.call($(elem), 'before', this);
        },
        before: function(elem){
            return gqHandle.pend.call(this, 'before', elem);
        },
        after: function(elem){
            return gqHandle.pend.call(this, 'after', elem);
        },
        attr: function(attrs, val){
            if(val === undefined && typeof attrs === 'string') {
                let resArr = [], attr;this.each(function(){
                    attr = this.getAttribute(attrs);attr===null&&(attr=undefined);
                    resArr.push( attr );
                });
                return (resArr.length>1 ? resArr : resArr[0]);
            }

            if(typeof attrs === 'object'){
                return this.each(function(){
                    for(let idx in attrs){this.setAttribute(idx, attrs[idx]);}
                });
            }
            return this.each(function(){this.setAttribute(attrs, val);});
        },
        removeAttr: function(attr){
            attr = attr.split(' ');
            return this.each(function(){
                attr.map(v=>this.removeAttribute(v));
            });
        },
        data: function(keys, val){
            if(typeof keys !== 'object' && val === undefined) {
                let resArr = [];this.each(function(){
                    this.gQueryData===undefined&&(this.gQueryData={});
                    typeof keys === 'string' ? resArr.push( this.gQueryData[keys] ) : resArr.push( this.gQueryData );
                });
                return (resArr.length>1 ? resArr : resArr[0]);
            }

            return this.each(function(){
                this.gQueryData===undefined&&(this.gQueryData={});
                if(typeof keys === 'object'){
                    for(let idx in keys){this.gQueryData[idx] = keys[idx];}
                } else {this.gQueryData[keys] = val;}
            });
        },
        removeData: function(key){
            return this.each(function(){
                this.gQueryData===undefined&&(this.gQueryData={});
                delete this.gQueryData[key];
            });
        },
        hasClass: function(cls){
            cls = cls.split(' ');
            let res = true;
            this.each(function(){
                cls.map(v=>{
                    this.classList.contains(v) || (res = false);
                });
            });
            return res;
        },
        addClass: function(cls){
            cls = cls.split(' ');
            return this.each(function(){
                cls.map(v=>this.classList.add(v));
            });
        },
        removeClass: function(cls){
            cls = cls.split(' ');
            return this.each(function(){
                cls.map(v=>this.classList.remove(v));
            });
        },
        toggleClass: function(cls){
            cls = cls.split(' ');
            return this.each(function(){
                cls.map(v=>this.classList.toggle(v));
            });
        },
        css: function(styles,val){
            if(val !== undefined){
                return this.each(function(){this.style[styles] = val;});
            }

            if(typeof styles === 'string'){
                let _css, resArr=[];
                styles = styles.replace(/^!/,'');
                this.each(function(){
                    resArr.push( getComputedStyle(this)[styles] );
                });
                return (resArr.length>1 ? resArr : resArr[0]);
            }

            return this.each(function(){
                for(let style in styles){this.style[style] = styles[style];}
            });
        },
        show: function(disp){
            return this.each(function(){
                disp || (disp = this.style.display=='none' ? '' : 'block');
                this.style.display = disp;
            });
        },
        hide: function(){
            return this.each(function(){this.style.display='none'});
        },
        fadeIn: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});

            return this.each(function(){
                this.style.display='';
                getComputedStyle(this).display=='none' && (this.style.display='block');
                typeof this.animate==='function' && this.animate([{opacity:0}, {opacity:1}], dur);
                let cthis = this;setTimeout(()=>{callback.call(cthis);}, dur);
            });
        },
        fadeOut: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});

            return this.each(function(){
                let copa = this.style.opacity || 1;
                typeof this.animate==='function' && this.animate([{opacity:copa}, {opacity:0}], dur);

                let cthis = this;
                setTimeout(()=>{cthis.style.display = 'none';},dur);
                setTimeout(()=>{callback.call(cthis);}, dur);
            });
        },
        fadeToggle: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});

            return this.each(function(){
                this.style.display=='none' ? $(this).fadeIn(dur,callback) : $(this).fadeOut(dur,callback);
            });
        },
        slideUp: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});

            setTimeout(()=>{callback.call(this);}, dur);
            return this.each(function(){
                typeof this.animate==='function' && this.animate([{height:this.offsetHeight+'px'}, {height:'0px'}], dur);

                let gthis = $(this);
                setTimeout(()=>{gthis.css({display:'none', height:'0px'});}, dur);
            });
        },
        slideDown: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});
            let elH;setTimeout(()=>{callback.call(this);}, dur);

            return this.each(function(){
                this.style.display = '';this.style.height = '';
                elH = this.offsetHeight+'px';
                typeof this.animate==='function' && this.animate([{height:'0px'}, {height:elH}], dur);
            });
        },
        slideToggle: function(dur,callback){
            dur || (dur=500);typeof callback === 'function' || (callback=function(){});

            return this.each(function(){
                this.style.display=='none' ? $(this).slideDown(dur, callback) : $(this).slideUp(dur, callback);
            });
        },
        on: function(evtName, selector, fn, opts){
            // 以下是所有无需事件委托的情况
            (arguments.length==3 && typeof fn !== 'function') && (opts = fn,fn = selector,selector = false);
            if(arguments.length==2){
                if(typeof selector === 'function'){
                    fn = selector, selector = false;
                } else if(typeof selector === 'object'){opts = selector, selector = false;}
            }
            typeof opts === 'object' || (opts={});

            // 处理事件委托
            if(selector){
                opts.capture===undefined&&(opts.capture=true);
            }
            let appoint = function(inFn){
                return selector ? function(e){
                    let nodes = this.querySelectorAll(selector),
                        tgtNode = false, i;

                    for (i = nodes.length - 1; i >= 0; i--) {
                        nodes[i].contains(e.target) && (tgtNode = nodes[i]);
                    }
                    tgtNode && ( inFn.call(tgtNode, e) );
                } : inFn;
            }, cfn;

            if(typeof fn === 'function'){
                cfn = appoint(fn);
                return this.each(function(){$.event.add(this, evtName, cfn, opts);});
            }

            return this.each(function(){
                for(let evt in evtName){
                    cfn = appoint(evtName[evt]);
                    $.event.add(this, evt, cfn, opts);
                }
            });
        },
        off: function(evts, opts){
            opts===undefined && (opts = false);
            evts || (evts='*');
            evts = evts.split(' ');

            return this.each(function(){
                evts.map(evt=>$.event.remove(this, evt, opts));
            });
        },
        trigger: function(evts, params){
            params || (params={});
            evts = evts.split(' ');
            let ctmEvts = evts.map(name=>new CustomEvent(name, {detail: params}));

            return this.each(function(){
                ctmEvts.map(evt=>this.dispatchEvent(evt));
            });
        },
        click: function(fn){
            if(typeof fn === 'function'){
                return this.each(function(){$.event.add(this,'click',fn);});
            } else {
                return this.trigger('click');
            }
        },
        select: function(){
            switch( this[0].tagName.toLowerCase() ){
                case 'input':case 'textarea':
                    this[0].select();break;
                default:window.getSelection().selectAllChildren(this[0]);
            }
            return this;
        },
        load: function(url, data, func){
            let _this = this, up = url.trim().split(' ');
            typeof data === 'function' && (func=data, data=false);

            $.fetch(up[0], data, 'text').then(function(resp){
                if(up.length>1){
                    up.splice(0, 1);
                    _this.html( $(resp).find(up.join(' '), 1).html() );
                } else {
                    _this.html( resp );
                }
                typeof func === 'function' && func.call( _this );
            });
        },
        wait: function(ms){

        },
        extend: function(obj){
            for(let idx in obj){
                typeof obj[idx] === "object" ? 
                this[idx] = $.extend(true, this[idx], obj[idx]) : 
                this[idx] = obj[idx];
            }
            return this;
        }
    };
    gQuery.fn.init.prototype = gQuery.fn;


    let gqHandle = {
        thvEach: function(prop, val){
            let isArr = Array.isArray(val);

            if(val === undefined || (isArr && val.length==0) ) {
                let resArr = [];this.each(function(){resArr.push(this[prop]);});
                return (isArr ? resArr : resArr.join(''));
            }
            return isArr ? this.each(function(idx){this[prop] = val[idx];}) :
             this.each(function(){this[prop] = val;});
        },
        pend: function(prop, elem){
            let elems = typeof elem === 'string' ? $.parse.html(elem) : (
                elem.gquery ? elem : [elem]
            );

            return this.each(function(){
                let elen = elems.length, i, el;

                for(i = 0; i < elen; i++){
                    el = elems[i].cloneNode(true);
                    prop=='insertBefore' ? this[prop](el, this.firstChild) : this[prop](el);
                }
            });
        }
    };



    /**
     * gQuery wait
     * @author Matthew Lee matt@madleedesign.com
     * @author Ganxiaozhe hi@gxzv.com
     */
    function gQueryDummy($real, delay, _fncQueue){
        // A Fake gQuery-like object that allows us to resolve the entire gQuery
        // method chain, pause, and resume execution later.

        let dummy = this;
        this._fncQueue = (typeof _fncQueue === 'undefined') ? [] : _fncQueue;
        this._delayCompleted = false;
        this._$real = $real;

        if (typeof delay === 'number' && delay >= 0 && delay < Infinity)
            this.timeoutKey = window.setTimeout(function () {
                dummy._performDummyQueueActions();
            }, delay);

        else if (delay !== null && typeof delay === 'object' && typeof delay.promise === 'function')
            delay.then(function () {
                dummy._performDummyQueueActions();
            });

        else return $real;
    }

    gQueryDummy.prototype._addToQueue = function(fnc, arg){
        // When dummy functions are called, the name of the function and
        // arguments are put into a queue to execute later

        this._fncQueue.unshift({ fnc: fnc, arg: arg });

        if (this._delayCompleted)
            return this._performDummyQueueActions();
        else
            return this;
    };

    gQueryDummy.prototype._performDummyQueueActions = function(){
        // Start executing queued actions.  If another `wait` is encountered,
        // pass the remaining stack to a new gQueryDummy

        this._delayCompleted = true;

        let next;
        while (this._fncQueue.length > 0) {
            next = this._fncQueue.pop();

            if (next.fnc === 'wait') {
                next.arg.push(this._fncQueue);
                return this._$real = this._$real[next.fnc].apply(this._$real, next.arg);
            }

            this._$real = this._$real[next.fnc].apply(this._$real, next.arg);
        }

        return this;
    };

    // Add shadow methods for all gQuery methods in existence.
    // skip non-function properties or properties of Object.prototype
    for (let fnc in gQuery.fn) {
        if (typeof gQuery.fn[fnc] !== 'function' || !gQuery.fn.hasOwnProperty(fnc)){
            continue;
        }

        gQueryDummy.prototype[fnc] = (function (fnc) {
            return function(){
                let arg = Array.prototype.slice.call(arguments);
                return this._addToQueue(fnc, arg);
            };
        })(fnc);
    }

    gQuery.fn.wait = function(delay, _queue) {
        return new gQueryDummy(this, delay, _queue);
    };




    /* -------------------------------------
     * gQuery - extend
     * ------------------------------------- */
    gQuery.extend = function(obj){
        if(arguments.length==1){
            for(let idx in obj){
                typeof obj[idx] === "object" ? 
                this[idx] = $.extend(true, this[idx], obj[idx]) : 
                this[idx] = obj[idx];
            }
            return this;
        }

        let deep = false, length = arguments.length, i = 1,
            name, options, src, copy, clone, copyIsArray,
            target = arguments[0] || {};
        if (typeof target == 'boolean') {
            deep = target;target = arguments[i] || {};i++;
        }
        if (typeof target !== "object") {target = {};}

        for (; i < length; i++) {
            options = arguments[i];
            if(options == null){continue;}

            for (name in options) {
                src = target[name];
                copy = options[name];

                // 解决循环引用
                if (target === copy) {continue;}
                // 要递归的对象必须是 plainObject 或者数组
                if ( deep && copy && (gQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ) {
                    // 要复制的对象属性值类型需要与目标属性值相同
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && gQuery.isPlainObject(src) ? src : {};
                    }
                    target[name] = gQuery.extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
        return target;
    };


    gQuery.each = function(object, callback){
        if(typeof object === 'object'){
            for(let i in object){
                if(callback.call(object[i], i, object[i]) === false){
                    break;
                }
            }
            return true;
        }

        [].every.call(object, function(v, i){
            return callback.call(v, i, v) === false ? false : true;
        });
    };
    gQuery.copy = function(str){
        if(typeof str==='object'){str = $(str).text();}

        $('body').append("<textarea id='gQuery-copyTemp'>"+str+"</textarea>");
        $('#gQuery-copyTemp').select();document.execCommand("Copy");
        $('#gQuery-copyTemp').remove();
    };
    gQuery.fetch = function(url, data, bodyMH){
        let _mh = {method: 'GET'};
        typeof url === 'object' && (_mh = $.extend(_mh, url), url = url.url);

        if(typeof data === 'object'){
            _mh.method = 'POST';
            if(Object.prototype.toString.call(data)=='[object FormData]'){
                _mh.body = data;
            } else {
                _mh.body = new FormData();
                for(let nm in data){_mh.body.append(nm, data[nm]);}
            }
        } if(typeof data === 'string'){bodyMH = data;}

        if(!bodyMH){return fetch(url, _mh);}
        return fetch(url, _mh).then(res => {
            if(!res.ok){throw new Error('Network response was not ok.');}
            return res[bodyMH]();
        }).catch(err => {
            if(typeof $.ui === 'object' && typeof $.ui.alert === 'function'){
                $.ui.alert({
                    title: 'Error: fetch',
                    message: `<div class='code-box mb-0 mt-2'>${err}</div>`,
                    type: 'alert', buttons: false, timer: 8000
                });
            }
            throw new Error(err);
        });
    };
    gQuery.global = (typeof window !== 'undefined' ? window : global);
    gQuery.isWindow = function(obj){
        return Object.prototype.toString.call(obj)==='[object Window]';
    };
    gQuery.isNode = function(obj){
        let str = Object.prototype.toString.call(obj);
        return (str.indexOf('HTML')>-1 && str.indexOf('Element')>-1) ? true : false;
    };
    gQuery.isPlainObject = function(obj){
        let prototype;

        return Object.prototype.toString.call(obj) === '[object Object]' 
            && (prototype = Object.getPrototypeOf(obj), prototype === null || 
            prototype == Object.getPrototypeOf({}));
    };
    gQuery.ui = "缺少 UI 组件，请前往 https://www.gquery.net/ui/ 下载";


    /** -------------------------------------
     * Array
     * ------------------------------------- */
    gQuery.array = {
        unique: function(arr, typ){
            let j = {};
            if( typ=='node' || $.isNode(arr[0]) ){
                return arr.filter(function(item, index, arr) {
                    return arr.indexOf(item, 0) === index;
                });
            }

            arr.forEach(function(v){
                let vtyp = typeof v, vv=v;
                if(vtyp==='object'){v = JSON.stringify(v);}
                j[v + '::' + vtyp] = vv;
            });
            return Object.keys(j).map(function(v){return j[v];});
        },
        finder: function(arr, finder, opts){
            typeof opts === 'object' || (opts = {});
            opts.limit === undefined && (opts.limit=1);

            let isObj = (typeof finder === 'object'), resame, resArr = [];
            for (let i = 0; i < arr.length; i++) {
                if(isObj){
                    resame = true;
                    for(let obj in finder){arr[i][obj]==finder[obj] || (resame = false);}
                    resame && resArr.push( {index:i, array:arr[i]} );

                    if(opts.limit>0 && resArr.length>=opts.limit){break;}
                } else {
                    arr[i]==finder && resArr.push( {index:i,array:arr[i]} );
                    if(opts.limit>0 && resArr.length>=opts.limit){break;}
                }
            }

            if(opts.array){return resArr;}
            return resArr.length>1 ? resArr : resArr[0];
        },
        has: function(arr, finder){
            let fdr = this.finder(arr, finder);
            return fdr!==undefined;
        }
    };

    gQuery.event = {
        add: function(obj, evtName, fn, opts){
            typeof opts === 'object' || (opts={});
            opts.capture === undefined && (opts.capture=false);

            let flag = evtName.split('.');evtName = flag.splice(0,1);
            flag.length>0 && (opts.__flag = {});
            flag.map(f=>{opts.__flag[f]=true;});

            let events = obj.gQueryEvents, evtObj = {fn:fn, opts:opts};

            if(events===undefined){
                events = {[evtName]:[ evtObj ]};
            } else {
                if(typeof events[evtName] !== 'object'){
                    events[evtName] = [evtObj];
                } else {
                    events[evtName].push(evtObj);
                }
            }

            obj.gQueryEvents = events;
            let event = events[evtName][ events[evtName].length-1 ];
            obj.addEventListener(evtName, event.fn, event.opts);
        },
        remove: function(obj, evtName, opts){
            let events = obj.gQueryEvents, flag = evtName.split('.'), i;
            evtName = flag.splice(0,1);
            if(events===undefined){return;}
            if(evtName=='*'){
                Object.keys(events).map(evt=>revent(evt, true));return;
            }

            if(typeof events[evtName]!=='object'){return;}
            revent(evtName);

            function revent(evt, forceFilter){
                let fns = events[evt];
                for (i = fns.length - 1; i >= 0; i--) {
                    /*
                     * 默认过滤状态；
                     * 传入 flag 时，过滤无 flag 的对象，留下有 flag 的对象；
                     * 未传入 flag 时，过滤有 flag 的对象，留下无 flag 的对象。
                    */
                    if(!forceFilter){
                        let filter=1, flagO=fns[i].opts.__flag || {};
                        if(flag.length<1 && Object.keys(flagO).length<1){filter=0;}
                        flag.map(f=>{flagO[f] && (filter=0);});
                        if(filter){continue;}
                    }

                    obj.removeEventListener(evt, fns[i].fn, fns[i].opts);
                    events[evt].splice(i, 1);
                    events[evt].length<1 && (delete events[evt]);
                }
            }
        }
    };

    /** -------------------------------------
     * Get
     * ------------------------------------- */
    gQuery.get = {
        browserSpec: function(){
            let ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

            if(/trident/i.test(M[1])){
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name:'IE',version:(tem[1] || '')};
            }
            if(M[1]=== 'Chrome'){
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if(tem != null) return {name:tem[1].replace('OPR', 'Opera'),version:tem[2]};
            }
            M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];

            if((tem = ua.match(/version\/(\d+)/i))!= null){M.splice(1, 1, tem[1]);}
            return {
                name: M[0], version: M[1],
                isMobile: /Mobi/i.test(ua),
                touchPoints: (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement || 0)
            };
        },
        queryParam: function(href, name){
            name===undefined && (name = href, href=window.location.href);
            if(href.indexOf('?')<0){return null;}

            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
                res = href.replace(/.*?\?/g, '').match(reg);
            if(res != null){return decodeURI(res[2]);}
            return null;
        },
        json: function(url, data){
            return $.fetch(url, data, 'text').then(data => {
                return $.parse.json(data);
            });
        }
    };

    /** -------------------------------------
     * Parse
     * ------------------------------------- */
    gQuery.parse = {
        html: function(html){
            if(typeof html === 'string'){
                let template = document.createElement('template');
                template.innerHTML = html;
                return template.content.childNodes;
            }
            return html;
        },
        json: function(str){
            if(typeof str === 'object'){return str;}
            if(str===''){return {};}

            let json;
            try{json = JSON.parse(str);} catch(err){}
            try{
                if(!json){json = Function('"use strict";return (' + str + ')')();}
            } catch(err){throw new Error(err);}

            return json;
        },
        number: function(str){
            return (
                typeof str === 'string' ? parseInt( str.replace(/[^\d]/g,'') ) : str
            );
        }
    };

    /** -------------------------------------
     * Cookie
     * ------------------------------------- */
    gQuery.cookie = {
        get: function(key, json){
            let jar = {}, i = 0,
                cookies = document.cookie ? document.cookie.split('; ') : [];
            function decode(s){return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);}

            for (; i < cookies.length; i++) {
                let parts = cookies[i].split('=');
                let cookie = parts.slice(1).join('=');
                if (!json && cookie.charAt(0) === '"') {cookie = cookie.slice(1, -1);}

                try {
                    let name = decode(parts[0]);cookie = decode(cookie);

                    if(json){try {cookie = JSON.parse(cookie);} catch(e){}}
                    jar[name] = cookie;

                    if(key === name){break;}
                } catch (e) {}
            }

            return key ? jar[key] : jar;
        },
        set: function(key, value, attributes){
            attributes = $.extend({path: '/'}, attributes);
            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
            }
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            let stringifiedAttrs = '';
            for (let attrName in attributes) {
                if (!attributes[attrName]) {continue;}
                stringifiedAttrs += '; ' + attrName;

                if (attributes[attrName] === true) {continue;}
                stringifiedAttrs += '=' + String(attributes[attrName]).split(';')[0];
            }

            typeof value==='object' && (value = JSON.stringify(value));
            return (document.cookie = key + '=' + value + stringifiedAttrs);
        },
        remove: function(key, attributes){
            $.cookie.set(key, '', $.extend(attributes, {expires: -1}));
        }
    };

    /** -------------------------------------
     * Storage
     * ------------------------------------- */
    gQuery.storage = {
        local: function(){return $.global.localStorage},
        set: function(key, data){
            (typeof data=='object') && (data = JSON.stringify(data));
            this.local().setItem(key, data);
        },
        get: function(key, typ){
            if(!typ){return this.local().getItem(key);}

            let keyData = this.local().getItem(key);
            if(typ=='array' || typ=='object'){
                try{keyData = $.parse.json(keyData);} catch(err){throw new Error("Parsing!");}
            }
            return keyData;
        },
        remove: function(key){this.local().removeItem(key);},
        clear: function(){this.local().clear();},
        push: function(key, data, ext){
            let kd = this.get(key);
            if(!kd){
                data = '['+JSON.stringify(data)+']';this.set(key,data);
                return this.get(key);
            } else {
                try{
                    let tkd = JSON.parse(kd);
                    if( Array.isArray(tkd) ){tkd.push(data);kd = tkd;} else {
                        kd = JSON.parse('['+kd+']');kd.push(data);
                    }
                } catch(err){
                    kd = '['+JSON.stringify(kd)+']';kd = JSON.parse(kd);
                    kd.push(data);
                }
                if(ext=='unique'){kd = $.array.unique(kd);}
                this.set(key,JSON.stringify(kd));
                return this.get(key, 'array');
            }
        }
    };
    gQuery.sessionStorage = gQuery.extend({}, gQuery.storage);
    gQuery.sessionStorage.local = function(){return $.global.sessionStorage};


    /** -------------------------------------
     * Prototype Chain Generator
     * ------------------------------------- */
    gQuery.chain = function(_ch){
        function chain(){
            return new chain.prototype.init(...arguments);
        }
        chain.prototype = _ch;
        chain.prototype.init.prototype = chain.prototype;
        return chain;
    };

    /** -------------------------------------
     * Date
     * ------------------------------------- */
    gQuery.date = new gQuery.chain({
        gquery: true,
        init: function(){
            let arg = arguments[0], isArg = false;
            this.date = $.date.parse(arg);

            return this.initDate();
        },
        calc: function(arg){
            // 以免在计算过程中对初始日期产生影响
            let __dt = Object.create(this);
            __dt.date = $.date.calc(__dt.date, arg);

            return this.initDate(__dt);
        },
        initDate: function(__dt){
            if(typeof __dt!=='object'){
                __dt = this;
            }

            __dt.timestamp = __dt.date.getTime();

            let dt = __dt.date;
            __dt._y = dt.getFullYear();
            __dt._m = dt.getMonth() + 1;
            __dt._d = dt.getDate();
            __dt._h = dt.getHours();
            __dt._i = dt.getMinutes();
            __dt._s = dt.getSeconds();

            return __dt;
        },

        /**
         * @e.g. format()
         * @e.g. format('yyyy-mm-dd')
         * @e.g. format('本世纪第yy年的m月')
         */
        format: function(fmt){
            let _t = $.extend({}, this);
            _t._m<10 && (_t._m='0'+_t._m);
            _t._d<10 && (_t._d='0'+_t._d);
            _t._h<10 && (_t._h='0'+_t._h);
            _t._i<10 && (_t._i='0'+_t._i);
            _t._s<10 && (_t._s='0'+_t._s);
            _t._dt = _t._y+'-'+_t._m+'-'+_t._d+' '+_t._h+':'+_t._i+':'+_t._s;
            // 未自定义直接返回默认格式
            if(typeof fmt!=='string'){return _t._dt;}

            rp('yyyy', _t._y);rp('yy', String(_t._y).substr(-2));
            rp('mm', _t._m);rp('m', this._m);
            rp('dd', _t._d);rp('d', this._d);

            rp('hh', _t._h);rp('h', this._h);
            rp('ii', _t._i);rp('i', this._i);
            rp('ss', _t._s);rp('s', this._s);

            function rp(regStr, repStr){
                fmt = fmt.replace(new RegExp(regStr, 'g'), repStr);
            };
            return fmt;
        },
        diff: function(_dt){
            _dt = $.date.parse(_dt);
            let df = {}, _t = {},
                ms_start = this.date.getTime(), ms_end = _dt.getTime();
            function fl(val){return Math.floor(val);}

            df._ms = ms_start - ms_end;
            df._s = fl(df._ms/1000);
            df._i = fl(df._s/60);
            df._h = fl(df._i/60);
            df._d = fl(df._h/24);

            // 防止开始时间>结束时间导致的计算出错
            _t._ms = Math.abs(df._ms);

            df.d = fl( _t._ms / (24*60*60*1000) );
            _t.df_h = _t._ms % (24*60*60*1000);
            df.h = fl( _t.df_h / (60*60*1000) );
            _t.df_i = _t.df_h % (60*60*1000);
            df.i = fl( _t.df_i / (60*1000) );
            _t.df_s = _t.df_i % (60*1000);
            df.s = fl( _t.df_s / (1000) );
            df.ms = _t.df_s % (1000);

            this._df = df;
            return this;
        },
        ago: function(){
            let df = this._df;
            if(typeof df!=='object'){return '现在';}
            if(df._ms<0){return '未来';}

            if(df.d>0){
                if(df.d>=30){
                    df.mon = Math.floor(df.d/30);
                    if(df.mon>=12){
                        df.year = Math.floor(df.mon/12);
                        return df.year+"年前";
                    }

                    return df.mon+"个月前";
                }

                if(df.d==1){return "昨天";}
                if(df.d==2){return "前天";}
                return df.d+"天前";
            }
            if(df.h>0){return df.h+"小时前";}
            if(df.i>0){return df.i+"分钟前";}
            if(df.s>0){return df.s+"秒前";}
            if(df.ms>0){return "刚刚";}
            if(df.ms===0){return "现在";}

            return '未知';
        }
    });
    /**
     * @e.g. parse('2002-2-14 12:00:00')
     * @e.g. parse(timestamp)
     * @e.g. parse(Date, '+6 day')
     * @e.g. parse('+6 day')
     */
    gQuery.date.parse = function(arg1, arg2){
        let typ1 = typeof arg1, typ2 = typeof arg2, date, _t = {};

        if(arg1 && arg1 instanceof Date){
            if(typ2!=='string'){return arg1;}
            return this.calc(arg1, arg2);
        }
        if(typ1==='string' && /^[+-]/.test(arg1)){
            return this.calc(new Date(), arg1);
        }

        if(typ1==='string'){
            date = new Date(arg1);
            // Safari 处理
            if( isNaN(date.getTime()) ){
                date = new Date(arg1.replace(/-/g, '/'));
            }
            return date;
        }

        if(typ1==='number'){
            // 处理错误数值
            _t.len = 13 - String(arg1).length;
            if(_t.len!=0){
                arg1 = _t.len<0 ? arg1/(10**Math.abs(_t.len)) : arg1*(10**_t.len);
            }
            return new Date(Math.round(arg1));
        }

        return new Date();
    };
    /**
     * @e.g. parse(Date, '+6 day')
     * @return Date
     */
    gQuery.date.calc = function(arg1, arg2){
        let ts = arg1.getTime(), isAdd = !/^-/.test(arg2);
        let dt = {};
        arg2 = arg2.replace(/[\+\- ]/g, '');
        // 分割数值和类型
        dt.num = arg2.replace(/[^\d]/g, '');
        dt.typ = arg2.replace(dt.num, '');

        dt.num = parseInt(dt.num);
        isAdd && (dt.num*=-1);
        
        switch(dt.typ){
            case 'y':case 'year':case 'years':
                arg1.setYear(arg1.getFullYear() - dt.num);
                ts = arg1.getTime();
                break;
            case 'm':case 'mon':case 'month':case 'months':
                arg1.setMonth(arg1.getMonth() - dt.num);
                ts = arg1.getTime();
                break;

            case 'd':case 'day':case 'days':
                ts -= dt.num*(24*60*60*1000);
                break;
            case 'h':case 'hour':case 'hours':
                ts -= dt.num*(60*60*1000);
                break;
            case 'i':case 'min':case 'minute':case 'minutes':
                ts -= dt.num*(60*1000);
                break;
            case 's':case 'sec':case 'second':case 'seconds':
                ts -= dt.num*1000;
                break;
            case 'ms':case 'millisecond':case 'milliseconds':
                ts -= dt.num;
                break;
        }
        return new Date(ts);
    }

    return gQuery;
}));
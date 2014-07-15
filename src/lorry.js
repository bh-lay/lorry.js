(function(global,document,factoryFn,plugIns){
	//��ʼ��factory
	global.L = global.L || factoryFn(global,document);
	
	//��չԭ����
	plugIns(L,global.L.fns);
})(window,document,function(window,document){
	/**
 	 * ��������
	 * 
	 */
	function each(arr,fn){
		//��������ֵ
		if(typeof(arr) == 'object' && typeof(fn) == 'function'){
			var Length = arr.length;
			if(Length && Length == +Length){
				for(var i=0;i<Length;i++){
					fn.call(this,i,arr[i]);
				}
			}else{
				for(var i in arr){
					if (!arr.hasOwnProperty(i)){
						continue;
					}
					fn.call(this,i,arr[i]);
				}
			}
		}
	}
	/**
	 * �ж�dom�Ƿ�ӵ��ĳ��class
	 */
	function hasClass(dom,classSingle){
		//dom��class ��⣬��class��ֱ�ӷ���false
		if(dom.className && dom.className.length){
			return dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)')) ? true : false;
		}
		return false;
	}
	/**
	 * �ж�dom��tagName
	 */
	function isTagName(dom,name){
		if(dom.tagName.toLowerCase() == name.toLowerCase()){
			return true;
		}else{
			return false;
		}
	}
	/**
	 * ɸѡԪ��
	 * �ӵ���dom������ҵ���ID��class��tagname
	 */
	function findDom(dom,str){
		var matchs = str.match(/(\w+)?(?:(\.|\#)?(\w+))?/),
			caches = [];
			returns = [];
		
		//��������ID���
		if(matchs[2] == '#'){
			caches = dom.getElementById(matchs[3]);
			/**
			 * ��url������û��tagName
			 * ��url��������tagName����ID�Ѳ��ҵ�Ԫ�أ������ҵ���Ԫ��tagName�����һ��
			 */
			if(!matchs[1] || (caches && isTagName(caches,matchs[1]))){
				returns.push(caches);
			}
		}
		//��������class���
		else if(matchs[2] == '.'){
			//ʹ��url�����е�tagName,���ޣ����Ի�ȡ����Ԫ��
			var caches = dom.getElementsByTagName(matchs[1] || "*");
			//�������
			each(caches,function(i,thisDom){
				//���class�Ƿ�Ϸ�
				if(hasClass(thisDom,matchs[3])){
					returns.push(thisDom);
				}
			});
		}
		//�����н���tagName���
		else if(matchs[1]){
			returns = dom.getElementsByTagName(matchs[1]);
		}
		return returns;
	}
	/**
	 * ���dom�Ƿ����css����
	 *
	 */
	function check_dom_for_css(dom,rule){
		var matchs = rule.match(/(\w+)?(?:(\.|\#)?(\w+))?/);
		//��������tagNameʱ
		if(matchs[1]){
			//�ж�tagName�Ƿ����
			if(!isTagName(dom,matchs[1])){
				return false
			}
		}
		if(matchs[2] == '.'){
			//�ж��Ƿ�ӵ�и�class
			if(!hasClass(dom,matchs[3])){
				return false
			}
		}else if(matchs[2] == '#'){
			//�ж�ӵ�д�ID
			if(dom.id != matchs[3]){
				return false
			}
		}
		return true;
	}
	/**
	 * �����dom���Ƿ����css�������飩
	 */
	function check_css_between_doms(outerDom,innerDom,cssArr){
		//ʣ���У���css����
		var rest_css_rule = cssArr;
		//ʣ���У���css��������ֵ
		var rest_css_index = rest_css_rule.length - 1;
		while (1) {
			//���Ѿ���������������ѭ��
			if(innerDom == outerDom || !innerDom){
				return false;
			}
			//������ʣ���У��Ĺ���ƥ�����
			if(rest_css_index == -1){
				return true;
			}
			//console.log(innerDom,rest_css_rule);
			//���dom�Ƿ����css����
			if(check_dom_for_css(innerDom,rest_css_rule[rest_css_index])){
				rest_css_index--;
			}
			//����ѭ��
			innerDom = innerDom.parentNode;
		}
	}
	 
	 
	/**
	 * ���ض�dom�����飩�����Ӷ���css path��
	 */
	function find(root,cssPath){
		var returns = [];
		//���·��
		var rootlist = cssPath.split(/\s+/) || [];
		//���һ��css����
		var last_css_rule = rootlist.pop();
		
		//��������dom
		each(root,function(i,thisDom){
			//�ӵ�ǰdom�����Ӷ���
			var this_result = findDom(thisDom,last_css_rule);
			
			if(this_result.length){
				//�������ҽ��
				each(this_result,function(s,innerDom){
				
					//���dom�Ƿ����ʣ���css����
					if(rootlist.length==0 || check_css_between_doms(thisDom,innerDom,rootlist)){
						//���Ϲ�����������ֵ
						returns.push(innerDom);
					}
				});
			}
		});
		return returns;
	}
	
	/**
	 * ���캯��
	 */
	function construction(elems){
		//����α����
		this.length = 0;
        Array.prototype.push.apply(this, elems); 
	}
	//����α����
	construction.prototype = [];
	//����
	construction.prototype['find'] = function(){
		return new construction(find(this,arguments[0]));
	};
	//����
	construction.prototype['each'] = function (fn){
		for(var i=0,total=this.length;i<total;i++){
			fn.call(this[i],i);
		}
	};
	//ѡ������
	construction.prototype['eq'] = function (num){
		if( num == +num ){
			var doms = this[num] ? [this[num]] : [];
			return new construction(doms);
		}
		return this;
	};
	//���class
	construction.prototype['hasClass'] = function (className){
		return hasClass(this[0],className);
	};
	
	var query = function(){
		if(typeof(arguments[0]) == 'string'){
			return new construction(find([document],arguments[0]));
		}else{
			var type = Object.prototype.toString.call(arguments[0]);
			if(type == '[object HTMLDivElement]'){
				return new construction([arguments[0]]);
			}else if(type == '[object NodeList]'){
				return new construction(arguments[0]);
			}
		}
	};
	query.fns = construction.prototype;
	query.each = each;
	return query;
},function(L,fns){
	/**
	 * �ж϶�������
	 * String Number Array
	 * Object Function 
	 * HTMLDocument
	 * Undefined Null 
	 */
	function TypeOf(obj) {
		return Object.prototype.toString.call(obj).match(/\s(\w+)/)[1];
	}
	//��ȡ��ʽ
	function getStyle(elem, prop) {
		var value;
		prop == "borderWidth" ? prop = "borderLeftWidth" : prop;
		if (elem.style[prop]){
			value = elem.style[prop];
		} else if(document.defaultView) {
			var style = document.defaultView.getComputedStyle(elem, null);
			value = prop in style ? style[prop] : style.getPropertyValue(prop);
		} else if (elem.currentStyle) {
			value = elem.currentStyle[prop];
		}
		
		if (/\px$/.test(value)){
			value = parseInt(value);
		} else if( value == +value){
			value = parseInt(value*10000)/10000;;
		} else if(value == '' || value == 'medium'){
			value = 0;
		} else if (value == 'auto'){
			if(prop == 'height'){
				value = elem.clientHeight;
			}
		}
		return value;
	}

	/**
	 * dom������ʽ
	 */
	function setStyle(elem,prop,value){
	
		if(!value && (value != +value)){
			console.log(prop,'-',value,'-','error');
			return
		}
		prop = prop.toString();
		if (prop == "opacity") {
			elem.style['filter'] = 'alpha(opacity=' + (value * 100)+ ')';
			value = value;
		} else if (value == +value){
			value = value + "px";
		}
		elem.style[prop] = value;
	}
	
	//����
	fns.hide = function(){
		this.each(function(i){
			this.style['display'] = "none";
		});
		return this;
	};
	//��ʾ
	fns.show = function(){
		this.each(function(i){
			this.style['display'] = "block";
		});
		return this;
	};
	/**
	 * outerWidth
	 * outerHeight
	 */
	var testDom = document.createElement('div');
	//�������ڼ�����
	function count_outerWidth (elem){
		return (getStyle(elem,'borderLeftWidth') + getStyle(elem,'paddingLeft') + getStyle(elem,'width') + getStyle(elem,'paddingRight') + getStyle(elem,'borderRightWidth'));
	}
	//�������ڼ���߶�
	function count_outerHeight (elem){
		return (getStyle(elem,'borderTopWidth') + getStyle(elem,'paddingTop') + getStyle(elem,'height') + getStyle(elem,'paddingBottom') + getStyle(elem,'borderBottomWidth'));
	}
	if(testDom.getBoundingClientRect !== 'undefined'){
		fns.outerWidth = function(){
			var output = this[0].getBoundingClientRect()['width'] || 0;
			if(typeof(output) == 'undefined'){
				output = count_outerWidth(this[0]);
			}
			return output;
		};
		fns.outerHeight = function(elem){
			var output = elem.getBoundingClientRect()['height'] || 0;
			if(typeof(output) == 'undefined'){
				output = count_outerHeight(elem);
			}
			return output;
		};
	}else{
		fns.outerWidth = function(){
			return count_outerWidth(this[0]);
		};
		fns.outerHeight = function(){
			return count_outerHeight(this[0]);
		};
	}
	
	//��ȡ������css
	fns.css = function setCss(input){
		if(typeof(input) == 'string'){
			return this[0] ? getStyle(this[0],input) : null;
		}else if( typeof(input == 'object') ){
			this.each(function(){
				L.each.call(this,input,function(pro){
					setStyle(this,pro,input[pro]);
				});
			});
		}
		return this;
	};
	/**
	 * ����
	 *
	 */
     var Tween = {
		Linear: function (t, b, c, d) { return c * t / d + b; },
		QuadEaseIn: function (t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		SineEaseIn: function (t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		SineEaseOut: function (t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		ElasticEaseOut: function (t, b, c, d, a, p) {
			if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
			else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
		},
		BackEaseOut: function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		}
    }
	
	/**
	 * ��ȡ��������Ĳ�����ֻ��ȡΪ���ֵĲ���
	 *
	 * ������
	 * ��ʼֵ
	 * Ŀ��ֵ
	 */
	function parseCSS_forAnim (elem, cssObj) {
		var props = [];
		var cssOri = [];
		var cssEnd = [];
		for (var prop in cssObj) {
			if (!cssObj.hasOwnProperty(prop)){
				continue;
			}
			
			var value = getStyle(elem, prop);
			//��ʽ��css����ֵ
			if (/\px$/.test(value)){
				value = parseInt(value);
			}
			
			if(value !== '' && (value == +value)){
				value = parseInt(value*10000)/10000;
				props.push(prop);
				cssOri.push(value);
				cssEnd.push(cssObj[prop]);
			}
			
		}
		return [props,cssOri,cssEnd];
	}
	
	var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 10);
				};
    })();
	
	/**
	 * ������
	 *
	 */
    function anim(elem,cssObj,durtime) {
		var args = arguments;
        this.elem = elem;
		
		var cssParse = parseCSS_forAnim(this.elem, cssObj);
		
		//��Ҫ�޸ĵ�����Array
		this.props = cssParse[0];
		//���Գ�ʼֵArray
		this.cssOri = cssParse[1];
		//����Ŀ��ֵArray
		this.cssEnd = cssParse[2];
		this.durtime = durtime;
		this.animType = "Linear";
		this.onEnd = null;
		if (args.length < 3) {
			throw new Error("missing arguments [dom,cssObj,durtime]");
		} else {
			if (TypeOf(args[3]) == "Function") {
				this.onEnd = args[3];
			}else if (typeof (args[3]) == "string") {
				this.animType = args[3];
			}
			
			if (TypeOf(args[4]) == "Function") {
				this.onEnd = args[4];
			}
		}
		this.startAnim();
    }
    anim.prototype['startAnim'] = function () {
		var me = this;
		//ȫ��ʱ�� | ��ʼʱ��
		var time_all = this.durtime;
		var time_start = new Date();
		
		//�˶����߷���
		var aniFunction = Tween[me.animType];
		
		//�Ƿ��ѽ�������
		var is_end = false;
		
		//��Ҫ�޸ĵ�css����
		var css_length = this.props.length;
		
		//��ʾ��ǰ֡���ݹ飩
		function showFrame(){
			var time_use = new Date() - time_start;
			
			if (time_use < time_all) {
				requestAnimationFrame(showFrame);
			}else{
				time_use = time_all;
				is_end = true;
			}
			var start,end,value;
			for (var i = 0; i < css_length; i++) {
				//���㵱ǰ֡��Ҫ������ֵ
				start = me.cssOri[i] * 10000;
				end = me.cssEnd[i] * 10000;
				value = aniFunction(time_use, start, (end-start), time_all)/10000;
				setStyle(me.elem,me.props[i],value);
			}
			
			if(is_end){
				me.onEnd && me.onEnd.call(me, me.elem);
			}
		}
		//��ʼ����
		requestAnimationFrame(showFrame);
	};
	
	fns.animation = function(cssEnd,durtime,a,b){
		this.each(function(){
			new anim(this,cssEnd,durtime,a,b);
		});
	};
});
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
			if(arr.length && (arr.length == +arr.length)){
				for(var i=0,total=arr.length;i<total;i++){
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
	 * ����ʵ��������Ϊ����
	 */
	function objectToArray(elems) {  
        //��ʼ�����ȣ���Ϊpush����ԭʼ��length++
		this.length = 0;
        Array.prototype.push.apply(this, elems);  
        return this;  
    }
	/**
	 * ���캯��
	 */
	function construction(obj){
		objectToArray.call(this,obj);
	}
	//ʵ������Ķ����ʼΪ����
	construction.prototype = new Array();
	construction.prototype['find'] = function(){
		return new construction(find(this,arguments[0]));
	};
	construction.prototype['each'] = function (fn){
		for(var i=0,total=this.length;i<total;i++){
			fn.call(this[i],i);
		}
	};
	construction.prototype['eq'] = function (num){
		if( num == +num ){
			var doms = this[num] ? [this[num]] : [];
			return new construction(doms);
		}
		return this;
	};
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
	
});
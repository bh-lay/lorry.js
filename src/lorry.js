(function(global,document,factoryFn){
	var factory = factoryFn(global,document);
	global.L = global.L = factory;
	
})(window,document,function(){
	/**
 	 * ��������
	 * 
	 */
	function each(arr,fn){
		//��������ֵ
		if(typeof(arr) == 'object' && typeof(fn) == 'function'){
			if(typeof(arr.length) != undefined){
				for(var i=0,total=arr.length;i<total;i++){
					fn.call(this,i,arr[i]);
				}
			}else{
				for(var i in arr){
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
		return (dom.className && dom.className.length) ? dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)')) : false;
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
			//�ӵ�ǰdom�����Ӷ���\
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
	construction.prototype['hide'] = function(){
		
	};
	return function(){
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
});
(function(global,document,factoryFn){
	var factory = factoryFn(global,document);
	global.L = global.L = factory;
	
})(window,document,function(){
	/**
 	 * 遍历数组
	 * 
	 */
	function each(arr,fn){
		//检测输入的值
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
	 * 判断dom是否拥有某个class
	 */
	function hasClass(dom,classSingle){
		//dom有class 检测，无class，直接返回false
		return (dom.className && dom.className.length) ? dom.className.match(new RegExp('(\\s|^)' + classSingle +'(\\s|$)')) : false;
	}
	/**
	 * 判断dom的tagName
	 */
	function isTagName(dom,name){
		if(dom.tagName.toLowerCase() == name.toLowerCase()){
			return true;
		}else{
			return false;
		}
	}
	/**
	 * 筛选元素
	 * 从单个dom对象查找单个ID、class、tagname
	 */
	function findDom(dom,str){
		var matchs = str.match(/(\w+)?(?:(\.|\#)?(\w+))?/),
			caches = [];
			returns = [];
		
		//规则中有ID标记
		if(matchs[2] == '#'){
			caches = dom.getElementById(matchs[3]);
			/**
			 * 当url规则中没有tagName
			 * 或当url规则中有tagName，且ID已查找到元素，并且找到的元素tagName与规则一致
			 */
			if(!matchs[1] || (caches && isTagName(caches,matchs[1]))){
				returns.push(caches);
			}
		}
		//规则中有class标记
		else if(matchs[2] == '.'){
			//使用url规则中的tagName,若无，则尝试获取所有元素
			var caches = dom.getElementsByTagName(matchs[1] || "*");
			//遍历结果
			each(caches,function(i,thisDom){
				//检查class是否合法
				if(hasClass(thisDom,matchs[3])){
					returns.push(thisDom);
				}
			});
		}
		//规则中仅有tagName标记
		else if(matchs[1]){
			returns = dom.getElementsByTagName(matchs[1]);
		}
		return returns;
	}
	/**
	 * 检测dom是否符合css规则
	 *
	 */
	function check_dom_for_css(dom,rule){
		var matchs = rule.match(/(\w+)?(?:(\.|\#)?(\w+))?/);
		//规则中有tagName时
		if(matchs[1]){
			//判断tagName是否相等
			if(!isTagName(dom,matchs[1])){
				return false
			}
		}
		if(matchs[2] == '.'){
			//判断是否拥有该class
			if(!hasClass(dom,matchs[3])){
				return false
			}
		}else if(matchs[2] == '#'){
			//判断拥有此ID
			if(dom.id != matchs[3]){
				return false
			}
		}
		return true;
	}
	/**
	 * 检测两dom间是否符合css规则（数组）
	 */
	function check_css_between_doms(outerDom,innerDom,cssArr){
		//剩余待校验的css规则
		var rest_css_rule = cssArr;
		//剩余待校验的css规则索引值
		var rest_css_index = rest_css_rule.length - 1;
		while (1) {
			//若已经查找至顶，结束循环
			if(innerDom == outerDom || !innerDom){
				return false;
			}
			//若已无剩余待校验的规则，匹配完成
			if(rest_css_index == -1){
				return true;
			}
			//console.log(innerDom,rest_css_rule);
			//检测dom是否符合css规则
			if(check_dom_for_css(innerDom,rest_css_rule[rest_css_index])){
				rest_css_index--;
			}
			//向上循环
			innerDom = innerDom.parentNode;
		}
	}
	 
	 
	/**
	 * 从特定dom（数组）查找子对象（css path）
	 */
	function find(root,cssPath){
		var returns = [];
		//拆分路径
		var rootlist = cssPath.split(/\s+/) || [];
		//最后一条css规则
		var last_css_rule = rootlist.pop();
		
		//遍历输入dom
		each(root,function(i,thisDom){
			//从当前dom查找子对象\
			var this_result = findDom(thisDom,last_css_rule);
			
			if(this_result.length){
				//遍历查找结果
				each(this_result,function(s,innerDom){
				
					//检测dom是否符合剩余的css规则
					if(rootlist.length==0 || check_css_between_doms(thisDom,innerDom,rootlist)){
						//符合规则，推至返回值
						returns.push(innerDom);
					}
				});
			}
		});
		return returns;
	}
	
	
	/**
	 * 设置实例化对象为数组
	 */
	function objectToArray(elems) {  
        //初始化长度，因为push会在原始的length++
		this.length = 0;
        Array.prototype.push.apply(this, elems);  
        return this;  
    }
	/**
	 * 构造函数
	 */
	function construction(obj){
		objectToArray.call(this,obj);
	}
	//实例化后的对象初始为数组
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
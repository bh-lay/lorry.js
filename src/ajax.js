(function(L){
var createAjax = function() {
    var xhr = null;
    try {
        //IE系列浏览器
        xhr = new ActiveXObject("microsoft.xmlhttp");
    } catch (e1) {
        try {
            //非IE浏览器
            xhr = new XMLHttpRequest();
        } catch (e2) {
            alert("您的浏览器不支持ajax，请更换！");
        }
    }
    return xhr;
};

var ajax = function(conf) {
    // 初始化
    //url参数，必填 
    var url = conf.url;
    //data参数可选，只有在post请求时需要
    var data = conf.data;
    //datatype参数可选    
    var dataType = conf.dataType;
    //回调函数可选
    var success = conf.success;
                                                                                         
    //type参数可选，默认为get
    var type = conf.type ? conf.type.toLowerCase() : "get";
    if (dataType == null){
        //dataType参数可选，默认为text
        dataType = "text";
    }
    // 创建ajax引擎对象
    var xhr = createAjax();
    // 打开
    xhr.open(type, url, true);
    // 发送
    if (type == 'get') {
        xhr.send(null);
    } else if (type == "post") {
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if(dataType == "text"||dataType=="TEXT") {
                if (success != null){
                    //普通文本
                    success(xhr.responseText);
                }
            }else if(dataType=="xml"||dataType=="XML") {
                if (success != null){
                    //接收xml文档    
                    success(xhr.responseXML);
                }  
            }else if(dataType=="json"||dataType=="JSON") {
                if (success != null){
                    //将json字符串转换为js对象  
                    success(eval("("+xhr.responseText+")"));
                }
            }
        }
    };
};
})(L);

L.ajax({
    type:"post",
    url:"test.jsp",
    data:"name=dipoo&info=good",
    dataType:"json",
    success:function(data){
        alert(data.name);
    }
});

define(['vue'], function(Vue){
	Vue.prototype.$billToCtrlComponetName = function(value){
		var lowerVal = value.toLowerCase();		
		return "ctrl-" + lowerVal;
	};
	
	//随机数
	Vue.prototype.$getRanKey = function(){
		return new Date().getTime().toString();
	};

});

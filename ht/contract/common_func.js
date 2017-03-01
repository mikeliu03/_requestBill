define(['jquery'], function(){
	function handlerAccountFormat(_data){
		var startPos = 0;
    	var _strArr = [];
    	var _sub = "";
    	while(_sub = _data.substr(startPos, 4)){
    		_strArr.push(_sub);
    		startPos += 4;
    	}	                     
    	return _strArr.join(' ');
	}

	return {
		handlerAccountFormat: handlerAccountFormat
	}
});
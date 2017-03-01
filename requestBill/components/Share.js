define(['vue', 'utils'], function(Vue, utils){
	var vmDetail = Vue.component('bill-share', {
		template: "#bill-share-template",
		props: {
			tmpl: {
				type: Object,
				default: function(){
					return {
						title: "",
						items: []
					};					
				}
			},
			contents: {
				type: Array,
				default: function(){
					return [];
				}
			},
			auth: {
				type: Object,
				default: function(){
					return {
						"isShow": true,
			  			"isEdit": true
					};					
				}
			}
		},
		data: function(){
			return {
				ctrldataArr: [],
				ctrlTmpData: {}
			}
		},
		computed: {
			/*originalCurrencySum: function(){
				var resultVal = 0;
				this.ctrldataArr.forEach(function(a){
					if(a.detail_originalCurrencySum){
						resultVal += parseFloat(a.detail_originalCurrencySum) || 0;
					}
				});
				return resultVal;
			}*/
		},
		watch: {
			"contents": {
				handler: function(newVal){
					this._initData();
				}
			},
			"ctrldataArr": {
				handler: function(newVal){
					console.log(newVal);
				},
				deep: true
			},
			/*"originalCurrencySum": {
				handler: function(newVal){
					this.$parent.$emit("updateOriginalCurrSumEvt", newVal);
				}
			}*/
		},
		created: function(){
			var tmpData = {};
			var items = this.tmpl.items;
			for(var i = 0; i < items.length; i++){
				tmpData[items[i].prop.name] = null;
			}
			this.ctrlTmpData = tmpData;
			if(this.$store.getters.isCreatePage){
				this.ctrldataArr.push(this._cloneCtrlTmp());
			}else{
				this._initData();
			}			
		},
		mounted: function(){
			var self = this;
			/*this.$on("updateMappingValEvt", function(data){
				var item = self.getItemDataByKey(data.rowkey);
				data.targets.forEach(function(a){
					if(item[a]) item[a] = null;
				});
			});*/
		},		
		methods: {
			getName: function(){
				return "share";
			},
			addShareItemHandler: function(){
				this.ctrldataArr.push(this._cloneCtrlTmp());
			},
			removeShareItemHandler: function(index){
				this.ctrldataArr.splice(index, 1);
			},
			getItemDataByKey: function(key){
				return this.ctrldataArr.filter(function(a){
					return a._key == key;
				})[0];
			},
			getAreaData: function(){
				console.log(this.ctrldataArr);
				var resultData = [];
				var self = this;
				this.ctrldataArr.forEach(function(linedata){
					var tmpLineData = {};
					for(var e in linedata){
						if(e && e !== "_key"){
							tmpLineData[e] = self._transformCtrlDataToSaveFormat(linedata[e]);
						}						
					}
					resultData.push(tmpLineData);
				});
				return resultData;
			},
			_transformCtrlDataToSaveFormat: function(item){
				if(!item){
					return "";
				}
				if(Object.prototype.toString.call(item) == "[object Array]"){
					return item[0] + '@' + item[1];
				}else{
					return item.toString();
				}
			},
			_cloneCtrlTmp: function(){
				var key = this.$getRanKey();
				return $.extend(true, {_key: key}, this.ctrlTmpData);
			},
			_initData: function(){
				var self = this;
				this.ctrldataArr = this.contents;
				this.ctrldataArr.forEach(function(a){
					var key = self.$getRanKey();
					$.extend(true, a, {_key: key});
				});
			}
		}
	});
	return vmDetail;
});
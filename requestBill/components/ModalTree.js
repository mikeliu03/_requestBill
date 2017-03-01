define(['vue', 'utils', 'jq_ztree'], function(Vue, utils){
	//下拉框选择数据公用弹出层
	Vue.component('modal-tree', {
		props: {
			
		},
		template: '#modal-tree-template',
		data: function(){
			return {
				resolve: null,
				reject: null,
				clickObj: {}
			}
		},
		methods: {
			showModal: function(opt){
				var self = this;
				this.clickObj = {};
				this.resolve = opt.resolve;
				$.when(this._initTree(opt)).done(function(){
					$(self.$el).modal('show');
				});		
			},
			ztreeSaveHandler: function(){
				this.resolve(this.clickObj);
				$(this.$el).modal('hide');
			},
			_initTree: function(opt){
				//初始化树形结构
				var url = opt.url;
				var param = opt.param;
				var self = this;
				var deferred = $.Deferred();

				$.ajax({
                     url: url,
                     type: "get",
                     data: param,
                     dataType: "json",
                     async: true
                }).success(function(data){
					data = data.rspData;
					var setting = {
	                    data: {
	                        simpleData: {enable: true}
	                    },
	                    callback: {
	                     	beforeClick: function(treeId, treeNode, clickFlag) {
                             	return !treeNode.isParent;//当是父节点 返回false 不让选取
                            },
	                        onClick: function (event, treeId, treeNode) {
	                            var obj = {
	                                 key: treeNode.name,
	                                 value: treeNode.tId.split("_")[1],
	                                 id: treeNode.id,
	                                 eid: treeNode.oId,
	                                 deduflag:treeNode.deductibleFlag,
	                                 defaultValue:treeNode.defaultValue
	                            };
	                            //取父级
	                            if(opt.extendDataLevel){
	                            	obj.parents = [];
	                            	var tmpTreeNode = treeNode;
	                            	for(var i = 0; i < opt.extendDataLevel; i++){
	                            		var tmpData = tmpTreeNode.getParentNode();
	                            		obj.parents.push(tmpData);
	                            		tmpTreeNode = tmpData;
	                            	}
	                            }
	                            self.clickObj = obj;
	                        }
	                    }
	                };
	                var z_nodes = data.datas;
                    if(z_nodes != null && z_nodes!= ''){
                        $.fn.zTree.init($("#ztreeDetail", self.$el), setting, z_nodes);
                    }
	                deferred.resolve();
                });
                return deferred.promise();
			},
		}
	});
});
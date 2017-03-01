define(['vue', 'utils', 'jq_ztree'], function(Vue, utils){
	//关联单据弹出层
	Vue.component('modal-relevant-bill', {
		props: {
			
		},
		template: '#modal-relevant-bill',
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
				$.when(this._initTable(opt)).done(function(){
					$(self.$el).modal('show');
				});		
			},
			ztreeSaveHandler: function(){
				this.resolve(this.clickObj);
				$(this.$el).modal('hide');
			},
			_initTable: function(opt){
				var url = opt.url;
			}
		}
	});
});
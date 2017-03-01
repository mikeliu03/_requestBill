define(['vue', 'utils'], function(Vue, utils){
	//意见弹出层
	Vue.component('modal-advice', {
		props: {
			
		},
		template: '#modal-advice-template',
		data: function(){
			return {
				"form_explain": "同意",
				opt: {
					save: null
				}
			}
		},
		mounted: function(){
			
		},
		methods: {
			showModal: function(option){
				this.opt.save = option.save;
				$(this.$el).modal('show');
			},
			adviceSaveHandler: function(){
				this.opt.save({"form_explain": this.form_explain});
			}
		}
	});
});
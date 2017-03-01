define(['vue', 'ctt_entity', 'ctt_attach', 'ctt_entity_modal', 'ctt_plan', 'ctt_plan_modal', 'ctt_benefit', 'ctt_benefit_modal',
	'ctt_auth', 'ctt_auth_modal', 'ctt_bill', 'ctt_pay', 'ctt_history'], 
	function(Vue, cttEntity, cttAttach, cttEntityModal, cttPlan, cttPlanModal, cttBenefit, cttBenefitModal, cttAuth, cttAuthModal,
		cttBill, cttPay, cttHistory){
	var vmDetail = Vue.component('contract-detail', {
		//el: "#contractEntity",
		template: '#contractDetail-template',
		props: ['baseInfo'],
		data: function(){
			return {
				
			}
		},
		created: function(){

		},
		computed: {
			isShowTab: function(){
				return this.baseInfo.pageType !== 'C' && this.baseInfo.state !== '1';
			}
		},
		components: {
		  'contract-entity': cttEntity,		  
		  'modal-entity': cttEntityModal,
		  'contract-plan': cttPlan,		  
		  'modal-plan': cttPlanModal,
		  'contract-benefit': cttBenefit,		  
		  'modal-benefit': cttBenefitModal,
		  'contract-auth': cttAuth,		  
		  'modal-auth': cttAuthModal,
		  'contract-bill': cttBill,
		  'contract-pay': cttPay,
		  'contract-history': cttHistory,
		  'contract-attach': cttAttach,
		},
		methods: {
			operationFire: function(data){
				var _refName = data.ref;
				this.$refs[_refName].$emit('showModal', data);
			},
			reloadDataFire: function(data){
				var _refName = data.ref;
				this.$refs[_refName].$emit('reloadData', data);				
			}
		}
	});
	return vmDetail;
});
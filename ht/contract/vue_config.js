define(['vue', 'vuex', 'common_func'], function(Vue, Vuex, CommonFunc){
	Vue.use(Vuex);
	var store = new Vuex.Store({
		state: {
		    entityChangeFlag: false
		  },
		  mutations: {
		    setEntityFlag: function(state, flag) {
		    	state.entityChangeFlag = flag;
		    }
		  }
	});
	
	return {
		store: store
	}
});
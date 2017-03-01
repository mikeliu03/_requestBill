define(['vue', 'cem_autocomplete_input'], function(Vue){
	var vmDate = Vue.component('autoinput', {
		template: '<input type="text" class="form-control"\
			ref="input"\
			v-bind:value="value.value">',
		//props: ['value'],
		props: {
			value: {
				type: Object,
				default: function(){
					return {value: "", key: ""}
				}
			},
			type: {
				type: String
			}
		},
		mounted: function() {
			var self = this;
		    this.$nextTick(function() {		    	
		    	$(this.$el).cemAutocompleteInput(function(key, oEvt){
		    		return self.getOptions(key);
				}, function(data){					
					self.updateValue(data);
				});
		   });
		},
		methods: {
		    updateValue: function (data) {
		        this.$emit('input', data);
		    },
		    getOptions: function(name){		    	
		    	var url = "";
		    	var _self = this;
		    	switch(this.type){
		    		//组织机构
		    		case '1': url = "getOrgs.ajax"; break;
		    		case '2': url = "getPosts.ajax"; break;
		    		case '3': url = "getEmployees.ajax"; break;
		    	}
		    	if(url && name){
		    		var defferd = $.Deferred();
		    		$.ajax({
		    			url: url,
		    			data: {
		    				name: name
		    			},
		    			dataType: "json",
		    			type: "post"
		    		}).success(function(data){
		    			var data = data.rspData || [];		    			
		    			defferd.resolve(data);
		    		});
		    		return defferd.promise();
		    	}else{
		    		return [];
		    	}
		    }
		}
	});
	return vmDate;
});
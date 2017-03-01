define(['vue'], function(Vue){
	var vmDate = Vue.component('datepicker', {
		template: '\
		  <input class="form-control datepicker"\
		        ref="input"\
		        v-bind:value="value"\
		        v-on:input="updateValue($event.target.value)"\
		        data-date-format="yyyy-mm-dd"\
		        data-date-end-date="0d"\
		        :placeholder="placeholder"\
		        type="text"  />\
		',
		props: {
		    value: {
		      type: String
		      //default: moment().format('DD-MM-YYYY')
		    },
		    placeholder: {
		      type: String,
		      default: 'yyyy-mm-dd'
		    }
		},
		mounted: function() {
		    var self = this;
		    this.$nextTick(function() {
		        $(this.$el).datepicker({
		            startView: 1,
		            todayHighlight: true,
		            todayBtn: "linked",
		            autoclose: true,
		            //format: "dd-mm-yyyy",
		            format: "yyyy-mm-dd",
		            onClose: function(e) {
			            self.updateValue(e);
		        	}
		        });
		    });
		},
		methods: {
		    updateValue: function (value) {
		        this.$emit('input', value);
		    },
		}
	});
	return vmDate;
});
define(['vue', 'utils'], function(Vue, utils){
	Vue.component('ctrl-date', {
		props: {
			ctrltmpl: {
				type: Object,
				default: function(){
					return {};
				}
			},
			value: {
				type: String,
				default: function(){
					return "";
				}
			}
		},
		template: '<dl class="fee-template-date">\
					<dt>\
						<span class="glyphicon glyphicon-exclamation-sign" v-show="ctrltmpl.prop.required == \'required\'"></span>\
						<span class="prefix-text" v-show="ctrltmpl.prop.prefixShow">{{ctrltmpl.prop.prefix}}</span>\
					</dt>\
					<dd>\
						<input :name="ctrltmpl.prop.name" class="form-control" :required="ctrltmpl.prop.required" type="text" \
						:data-resource="ctrltmpl.prop[\'data-resource\']" :placeholder="ctrltmpl.prop.placeholder" \
						v-model="content.value" :disabled="ctrltmpl.access.isEdit == \'001\'" readonly="readonly" @blur="blurHandler">\
					</dd>\
					<dd v-show="ctrltmpl.prop.suffixShow">{{ctrltmpl.prop.suffix}}\
					</dd>\
				</dl>',
		data: function(){
			return {
				content: {
					value: ""
				}
			}
		},
		mounted: function(){
			var self = this;
			this._syncPropToContent();
			$("input", $el).datePicker({
				changeMonth: true,
                changeYear: true,
			})
		},
		watch: {
			"ctrltmpl": {
				handler: function(val){
					console.log(val);
				},
				deep: true
			}
		},
		methods: {
			blurHandler: function(){
				this.updateValue(this.content.value);
			},
			updateValue: function(val){
				this.$emit('input', val);
			},
			_syncPropToContent: function(){
				this.content.value = this.value;	
			}
		}
	});
});
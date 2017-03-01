define(['vue', 'utils'], function(Vue, utils){
	Vue.component('ctrl-select', {
		props: {
			ctrltmpl: {
				type: Object,
				default: function(){
					return {};
				}
			},
			value: {
				//type: Object,
				default: function(){
					return ["", ""];
				}
			},
			rowkey: {
				type: String
			}		
		},
		template: '<dl class="fee-template-select">\
					<dt>\
						<span class="glyphicon glyphicon-exclamation-sign" v-show="ctrltmpl.prop.required == \'required\'"></span>\
					</dt><dd>\
						<div class="cemUiValueHelpInput" @click="showHelpModal">\
							<input type="text" readonly="readonly" autocomplete="off" style="width:100%;direction:inherit;text-align:left"\
							:required="ctrltmpl.prop.required" :name="ctrltmpl.prop.name" :placeholder="ctrltmpl.prop.placeholder" \
							:value="content.value"><span class="icon-cem-106 cemUiValueHelpIcon" role="button"></span>\
						</div>\
					</dd></dl>',
		/*template: '<dl class="fee-template-select">\
					<dt>\
						<span class="glyphicon glyphicon-exclamation-sign" v-show="ctrltmpl.prop.required == \'required\'"></span>\
					</dt><dd>\
						<select disabled="disabled" :required="ctrltmpl.prop.required" class="form-control"\
						 :data-url="ctrltmpl.prop[\'data-url\']" \
						 :data-resource="ctrltmpl.prop[\'data-resource\']" :name="ctrltmpl.prop.name">\
						 	<option value="">{{ctrltmpl.prop.placeholder}}</option>\
						 </select>\
					</dd></dl>',*/
		data: function(){
			return {
				content: {
					"key": null, "value": null
				}
			}
		},
		watch: {
			"value": {
				handler: function(){
					this._syncPropToContent();		
				},
				deep: true
			}
		},
		mounted: function(){
			this._syncPropToContent();
		},
		methods: {
			showHelpModal: function(){
				if(this.ctrltmpl.access.isEdit == '001'){
					return false;
				}
				var param = this.$store.getters.getUserParam;				
				var opt = this._getModalProps();
				var mapParam = this._getMappingParam();
				$.extend(true, param, mapParam, {"fieldName": this.ctrltmpl.prop["data-resource"]});
				$.extend(true, opt, {"param": param});
				
				var modalTree = this.$root.$refs[opt.ref];
				console.log(opt);
				modalTree.showModal(opt);
			},
			updateValue: function(data){
				this.$emit('input', [data.key, data.value]);
			},
			_getModalProps: function(){
				var self = this;
				var specialCtrlMap = {
					/*"detail_dzno": {
						ref: "modal_relevant_bill",
						url: "searchFieldDynamicDBColumnsData.ajax",
						//url: "searchFieldDynamicDBColumnsData.ajax",
						resolve: function(data){}
					}*/
				};
				var defaultProp = {
					ref: "modal_tree",
					url: this.ctrltmpl.prop["data-url"],
					_resolve: function(data){
						if(self.content.key == data.key){
							return;
						}									
					}
				};
				var name = this.ctrltmpl.prop.name;
				var resultProp = specialCtrlMap[name]? specialCtrlMap[name] : defaultProp;
				resultProp.resolve = function(data){
					data = {"key": data.id, "value": data.key};
					resultProp._resolve(data);
					self.updateValue(data);
					self._afterValueUpdate();	
				}
				return resultProp;
			},
			_afterValueUpdate: function(){
				//触发维度映射事件
				var mappingFields = this._getMappingToFields();
				if(mappingFields.length > 0){
					this.$parent.$emit('updateMappingValEvt', {
						"rowkey": this.rowkey,
						//"data": this.content,
						"targets": mappingFields
					});
				}				
			},
			_getMappingToFields: function(){
				var mappingFields = this.$store._getMappingTargetFields(this.ctrltmpl.prop.name);
				return mappingFields;
			},
			_getMappingParam: function(){
				var srcDim = this.$store._getMappingSrcField(this.ctrltmpl.prop.name);
				if(!srcDim){
					return;
				}
				var srcData = this.$parent.getItemDataByKey(this.rowkey);
				if(!srcData || !srcData[srcDim]){
					return;
				}

				var param = {
					"sourceDim": srcDim,
					"targetDim": this.ctrltmpl.prop.name,
					"dimRefValue": this._valToStrCommon(srcData[srcDim])
				};
				return param;
			},
			_valToStrCommon: function(data){
				if(Object.prototype.toString.call(data) == "[object Array]"){
					return data.join("@");	
				}else{
					return data;
				}				
			},
			_syncPropToContent: function(){
				this.content.key = this.value && this.value[0];
				this.content.value = this.value && this.value[1];	
			}
		}
	});
});

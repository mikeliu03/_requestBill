define(['vue', 'utils', 'cem_upload'], function(Vue, utils, CemUpload){
	/*var vmAttach = new Vue({
		el: "#contractAttach",*/
	var vmAttach = Vue.component('contract-attach', {
		template: '#contractAttach-template',
		props: ['baseInfo'],
		data: function(){
			return{
				jViewImage: $('#view-image'),
				jPluginTable: null
			}			
		},
		computed: {
			sUploadUrl: function(){
				return $('#uploadUrl').val();
			},
			jHideUploadBtn: function(){
				return $('#upload_hide_btn', this.$el);
			}			
		},
		mounted: function(){
			var _self = this;
			//init picture view
			this.jViewImage.viewer();
			
			//init upload btn
			this.initUploadBtn();						
		},
		watch: {
			"baseInfo.isEditable": {
				handler: function(){
					this.initTable();
				},
				deep: true
			}
		},
		methods: {
			upload_attach: function(event){
				console.log(this.jHideUploadBtn);
				this.jHideUploadBtn.trigger('click');
			},
			initUploadBtn: function(){
				//upload files
				var _self = this;
				console.log(this.sUploadUrl);
				var fButtonUpload = CemUpload.cemUpload(this.jHideUploadBtn,{
					uploader: this.sUploadUrl,
					fileSizeLimit: 5120,
				 	fileObjName: "cem_storage_file",
				 	onUploadInputChange: function(e){
				 		fButtonUpload.uploadFiles();
				 	},
				 	onUploadSuccess: function(file, data, dom){
						var jsonData = eval("(" + data + ")");
			            //返回 0  代表上传文件服务器成功  其他 失败

			            console.log(jsonData);
			            if (jsonData.code == "0") {
			            	var imgParamArray = [];
							var imgParam = {};
			                imgParam["name"] = file.name;
			                imgParam["attachmentSize"] = file.size;
			                imgParam["suffix"] = file.type;
			                imgParam["src"] = jsonData.data.fileUrl;
			                imgParam["url"] = jsonData.data.fileCode;
			                _self._saveAttachData(imgParam);
			                //imgParamArray.push(JSON.stringify(imgParam));			                
			            }
			            //上传附件服务器失败
			            else {
			            	utils.cem_message(jsonData.code + ":" + jsonData.msg);
			            }
					},
					onUploadError: function(file, data){
						utils.cem_message(data);
					}
				});
				
				this.jHideUploadBtn.change(function(){
					fButtonUpload.uploadFiles();
				});
			},
			initTable: function(){
				var _self = this;
				var _editable = this.baseInfo.isEditable;
				var jTable = $(".table", this.$el);
				this.jPluginTable = jTable.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
	                serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractAttachmentList.ajax",
	                    type: "post",
	                    data: function(param){
	                        return $.extend(true, {"contractId": _self.baseInfo.contractId}, param);
	                    }
	                },
	                info: false,
	                lengthChange: false,
	                ordering: false,
	                paging: true,
	                searching: false,
                	columns: [
	                    {
	                        data: "name"
	                    },
	                    {
	                       data: "attachmentSize",
	                       render: function (_data) {
	                        	var str = _data + "kb";
	                        	return str;
	                        }
	                    },
	                    {
	                    	data: "id",	                        
	                        render: function (_data, type, row) {
	                        	var supportViewType = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp'];
	                        	var str = '<span data-id="' + _data + '" data-url="' + row.src + '">';
	                        	if(supportViewType.indexOf((row.suffix || "").toLowerCase()) >= 0){
	                        		//str += '<a href="' + row.src +'" class="view-attach mr10">查看</a>';
	                        		str += '<a href="javascript:void(0)" class="view-attach mr10">查看</a>';	                        		
	                        	}
	                        	str += '<a href="' + row.url +'" download="'+ row.name +'" class="download-attach mr10">下载</a>';
	                        	if(_editable){
	                        		str += '<a href="javascript:void(0)" class="delete-attach">删除</a>';
	                        	}	                        	
	                        	str += '</span>';
	                        	return str;
	                        }
	                    }
                	]
            	});

            	jTable.on('click', '.view-attach', function(){
            		var _id = $(this).parent().data("id");
            		var _url = $(this).parent().data("src");
            		_self.jViewImage.attr('src', _url);
            		_self.jViewImage.viewer('show');            		
            	});
            	jTable.on('click', '.delete-attach', function(){
            		var _id = $(this).parent().data("id");
            		_self._delAttach(_id);
            	});
			},
			_saveAttachData: function(param){
				var _self = this;
				$.ajax({
					url: "addContractAttachment.ajax",
					data: $.extend(param, {"contractId": this.baseInfo.contractId}, true),
					dataType: "json",
					type: "post"
				}).success(function(){
					_self.jPluginTable.ajax.reload();
				});
			},
			_delAttach: function(ids){
				var _self = this;
				var param = {"ids":ids + ""};
				utils.cem_alert("是否确认删除附件？",function(){
					$.ajax({
						url:"deleteContractAttachment.ajax",
						data:param,
						dataType:"json",
						type:"post"
					}).success(function(){
						utils.cem_message("删除成功！");
						_self.jPluginTable.ajax.reload();
					});
				});
			}
		}
	});

	return vmAttach;
});
define(['vue', 'utils', 'jq_uploadify', 'viewer'], function(Vue, utils){
	//附件处理
	var vmAttach = Vue.component('bill-attach', {
		template: "#bill-attach-template",
		data: function(){
			return {
				contents: [],
				ctrlstatus: {
					imgUpload: {
						show: false,
						progress: 0
					},
					fileUpload: {
						show: false,
						progress: 0,
						iconSrc: "",
						fielname: "",
						filesize: 0
					}
				},
				auth: {
					imgUpload: {
						show: true,
						enable: true
					},
					fileUpload: {
						show: true,
						enable: true
					}
				},
				jViewImage: $('#view-image')
			}			
		},
		computed: {
			attachCount: function(){
				return this.contents.length;
			},
			imageAtts: function(){
				var self = this;
				return this.contents.filter(function(a){
					return self._isImage(a);
				});
			},
			otherAtts: function(){
				var self = this;
				return this.contents.filter(function(a){
					return !self._isImage(a);
				});
			}
		},
		mounted: function(){
			this.jViewImage.viewer();
			this.loadAttachData();
			if(this.$store.getters.isCreatePage || this.getAttachAuth()){
				this.initImgUpload();
				this.initFileUpload();
			}			
		},
		methods: {
			getName: function(){
				return "img";
			},
			loadAttachData: function(){
				var self = this;
				var param = {billNo: this.$store.state.billNo, bustype:"000"};
				utils.get("getAttachmentAction.ajax", param, function(resList){
					self.contents = resList || [];
				});
			},
			getAttachAuth: function(){
				var pageStatus = this.$store.state.pageStatus;
				var billStatus = this.$store.state.billStatus;
				//读取附件操作权限,单据查询页面，并且单据状态为0
				//如果是代办任务页面，则去读附件操作权限
				if((pageStatus=="billquery" && billStatus=="0") || pageStatus=="flowtask" || pageStatus=="completeflowtask"){ 
					this._getAttachActionAuth();
					return true;
				}else{
					this.auth.imgUpload.enable = false;
					this.auth.fileUpload.enable = false;
					return false;
				}
			},
			_getAttachActionAuth: function(){
				var self = this;
				//单据操作权限控制 (允许操作附件 operateAttachment;允许查看附件 viewAttachment)
				var param = {
					nodeId: this.$store.state.currentNode, 
					baseId: this.$store.state.baseId,
					accessCode:"attachment"
				};
				//格式：[{accessCode: "operateAttachment", enable: "000"}, {accessCode: "viewAttachment", enable: "000"}]
				utils.post("billItemOperationAccessControlAction.ajax", param, function(data){
					for(var i = 0; i < data.length; i++){						
						var opEnable = (data[i].enable == "000");
						if(data[i].accessCode == "operateAttachment"){ //不允许操作附件
							self.auth.imgUpload.enable = opEnable;
							self.auth.fileUpload.enable = opEnable;
						}else if(data[i].accessCode == "viewAttachment"){ //不允许查看附件
							self.auth.imgUpload.show = opEnable;
							self.auth.fileUpload.show = opEnable;
						}
					}
				});
			},
			deleteAttach: function(attch){
				var self = this;
				if(attch.id){
					utils.post("deleteAttachmentById.ajax", {ids: attch.id}, function(){
						self._deleteAttachByProp("id", attch.id);	
					});					
				}else{
					this._deleteAttachByProp("name", attch.name);
				}								
			},
			viewImage: function(img){
				this.jViewImage.attr('src', img.url);
				this.jViewImage.viewer('show');   
			},
			getAreaData: function(){
				var resultData = [];
				this.contents.filter(function(a){
					if(!a.id){
						var item = {};
						item.name = a.name;
						item.filesize = a.filesize;
						item.code = a.code;
						item.url = a.fileCode;
						if(a.imgsrc){
							item.imgsrc = a.imgsrc;
						}
						resultData.push(item);
					}
				});
				return resultData;
			},
			initImgUpload: function(){
				var self = this;
				var img_upload = $("#img_upload", this.$el);
				this._upload(img_upload, {
			        url: this.$store.state.uploadUrl,
			        //limit: '2048',
			        callback: function (url, dom) {
			        	self.ctrlstatus.imgUpload.show = false;
			            /*$("img", dom).attr("src", url);
			            $("span", dom).hide();
			            $(".glyphicon-remove-circle", dom).removeClass("hide");
						$("#cur_plug_count").val(+$("#cur_plug_count").val() + 1);*/
			        },
			        onUploadStart: function (file) {
			        	self.ctrlstatus.imgUpload.show = true;
			        },
			        onUploadProgress: function (percent, dom) {
			        	self.ctrlstatus.imgUpload.progress = percent;
			        }
			    });
			},
			initFileUpload: function(){
				var self = this;
				var file_upload = $("#file_upload", this.$el);
				this._upload(file_upload, {
			        name: '<a href="javascript:void(0)" class="uploadify-button"><span class="glyphicon glyphicon-file"></span>添加附件</a>',
			        type: '*.doc; *.docx; *.ppt; *.pptx; *.pdf; *.rar; *.txt; *.xls; *.xlsx; *.zip',
			        //limit: '2048',
			        url: this.$store.state.uploadUrl,
			        callback: function (url, dom) {
			        	self.ctrlstatus.fileUpload.show = false;
			            /*var cur_file = dom;
			            $(">span, >font", cur_file).remove();
			            $("a", cur_file).removeClass("hide");
						$("#cur_plug_count").val(+$("#cur_plug_count").val() + 1);*/
			        },
			        onUploadStart: function (file) {
			        	self.ctrlstatus.fileUpload.fielname = file.name;
			        	self.ctrlstatus.fileUpload.filesize = file.size / 1024;
			            self.ctrlstatus.fileUpload.iconSrc = self._getIconByFilename(file.name);
			            self.ctrlstatus.fileUpload.show = true;
			        },
			        onUploadProgress: function (percent, dom) {
			            self.ctrlstatus.imgUpload.progress = percent;
			        }
			    });
			},
			_upload: function(element, opt){
				var self = this;
		        var default_opt = {
		            desc: 'Image Files',
		            type: '*.gif; *.jpg; *.png;*.jpeg',
		            limit: '5120',
		            objetName: "cem_storage_file",
		            name: '<span class="uploadify-button glyphicon glyphicon-plus"></span>',
		            callback: null
		        };
		        $.extend(default_opt, opt);
		        element.Huploadify({
		            'auto': true,
		            'fileObjName': default_opt.objetName,
		            'fileSizeLimit': default_opt.limit,
		            'fileTypeDesc': default_opt.desc,
		            'fileTypeExts': default_opt.type,
		            'uploader': default_opt.url,
		            'formData': default_opt.data,
		            'buttonText': default_opt.name,
		            'onUploadStart': opt.onUploadStart,
		            'onUploadSuccess': function (file, data, dom) {
		                var jsonData = eval("(" + data + ")");
		                //返回 0  代表上传文件服务器成功  其他 失败
		                if (jsonData.code == "0") {
		                    var url = jsonData.data.fileUrl;
		                    default_opt.callback(url, dom);
		                    //attachmentFlag = true;
		                    var imgParam = {};
		                    imgParam["name"] = file.name;
		                    imgParam["filesize"] = file.size;
		                    imgParam["code"] = file.type;
		                    var iconSrc = self._getIconByFilename(file.name);
		                    if(iconSrc){
								imgParam["imgsrc"] = iconSrc;
		                    }
		                    imgParam["fileCode"] = jsonData.data.fileCode;
		                    imgParam["url"] = url;
		                    self.contents.push(imgParam);
		                }else { //上传附件服务器失败
		                    //attachmentFlag = false;
		                }
		            },
		            onUploadProgress: default_opt.onUploadProgress,
		            onInit: function (obj) {
		                $(".uploadify-queue", element).remove();
		            }
		        });
		    },
		    _getIconByFilename: function(filename){
	            var fixArr = filename.split('.');
	            var fix = fixArr[fixArr.length - 1];
	            var imgSrc = null;
	            switch (fix) {
	                case "doc":
	                case "docx":
	                    imgSrc = "resource/images/doc.png";
	                    break;
	                case "ppt":
	                case "pptx":
	                    imgSrc = "resource/images/ppt.jpg";
	                    break;
	                case "pdf":
	                    imgSrc = "resource/images/pdf.jpg";
	                    break;
	                case "rar":
	                    imgSrc = "resource/images/rar.png";
	                    break;
	                case "txt":
	                    imgSrc = "resource/images/text.png";
	                    break;
	                case "xls":
	                case "xlsx":
	                    imgSrc = "resource/images/xls.jpg";
	                    break;
	                case "zip":
	                    imgSrc = "resource/images/zip.png";
	                    break;
	            }
	            return imgSrc;
		    },
		    _deleteAttachByProp: function(propName, propVal){
		   		var self = this;
		   		this.contents.filter(function(item, i){
					if(item[propName] == propVal){
						self.contents.splice(i, 1);
						return true;
					}
				});	
		   	},
			_isImage: function(data){
				return data.code && data.code.indexOf('image') >= 0;
			}
		}
	});
	return vmAttach;
});
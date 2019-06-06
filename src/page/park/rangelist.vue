<!-- 区层管理 -->
<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">区层名称</label>
                    <input v-model="search.areaName" class="form-control" id="" type="text" placeholder="" size="12">
                </div>
                <div class="form-group">
                    <label for="">区层类型</label>
                    <el-select style="width:145px;" v-model="search.areaType" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in options"
					      :key="index"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
                </div>
                <div class="form-group">
                    <label for="bdate">时间</label>
                    <el-date-picker
                    	value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
				      	v-model="search.beginTime"
				      	type="datetime"
				      	placeholder="选择日期时间">
				    </el-date-picker>
                </div>
                <div class="form-group">
                    <label for="edate">至</label>
                    <el-date-picker
                    	value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
				      	v-model="search.endTime"
				      	type="datetime"
				      	placeholder="选择日期时间">
				    </el-date-picker>
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <button @click="addSearch" type="button" class="btn btn-default" v-if="rangelist_btn_add">添加</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">创建时间</td>
                        <td width="80">区层名称</td>
                        <td width="100">区层类型</td>
                        <td width="100">车场名称</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crt_time}}</td>
                        <td>{{item.area_name}}</td>
                        <td>{{item.area_type == 1 ? '地上':'地下'}}</td>
                        <td>{{item.parking_name}}</td>
                        <td>
                            <a title="修改" href="javascript:;" v-if="rangelist_btn_edit">
                                <span @click="editRange(item)">修改区层&nbsp;&nbsp;</span> 
                            </a>
                            <a title="跳转" href="javascript:;" >
                                <span @click="jumpParkSet(item)">场内布局</span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>

        <!-- 添加/编辑区层 -->
		<el-dialog title="添加/编辑区层" :visible.sync="dialogFormVisibleArea" width="430px" @close="closeDialogArea">
			<el-form ref="formArea" label-position="right" :model="formArea" :rules="rulesArea" :label-width="formLabelWidth">
				
				<el-form-item label="车场名称" v-if="!searchFlag">
		    		<el-col :span="18">
		      			<el-input readonly v-model="park.parkingName" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

                <el-form-item label="车场名称" prop="parkingId" v-else> 
                    <el-col :span="18">
                        <el-select @change="changeCity" :remote-method="remoteMethod" remote filterable v-model="formArea.parkingId" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in parkList"
                                :key="index"
                                :label="item.parkingName"
                                :value="item.parkingId">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
				
				<el-form-item label="区层名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				<el-form-item label="区层类型" prop="type">
		    		<el-col :span="18">
		      			<el-select v-model="formArea.type" placeholder="请选择">
						    <el-option
						      v-for="item in areaAllType"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="布局长度" prop="width">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.width" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
		      				<template slot="append">最佳长度16</template>
		      			</el-input>
		      		</el-col>
		    	</el-form-item>
		      	<el-form-item label="布局宽度" prop="height">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.height" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
		      				<template slot="append">最佳宽度10</template>
		      			</el-input>
		      		</el-col>
		    	</el-form-item>

		      	<el-form-item label="布局底图" prop="bgImgUrl">
		    		<el-col :span="18">
		      			<el-input readonly v-model="formArea.bgImgUrl" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			<el-upload
						  class="upload-demo"
						  action="https://www.parking.dda-iot.com/img/oss/upload"
						  :on-error="handleError"
						  :on-success="handleSuccess"
						  :limit="3"
						  :show-file-list="false"
						  :auto-upload="true"
						  :data='{pathName:"itparking/web"}'
						  name="file">
						  <el-button size="small" type="primary">上传</el-button>
						</el-upload>
		      		</el-col>
		    	</el-form-item>
				
				<el-form-item label="显示底图">
		    		<el-col :span="18">
		      			<el-select v-model="formArea.bgImgType" placeholder="请选择">
						    <el-option
						      v-for="item in bgImgAllType"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditAreaTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleArea = false">取 消</el-button>
		  	</div>
		</el-dialog>
  	</div>
</template>

<script>
import {getQueryParkingAreaApi,getAreaSingleApi,editAreaApi,addAreaApi,getParkListApi} from '@/api/park/rangelist.js';
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            rangelist_btn_edit:false,
            rangelist_btn_add:false,

            search:{
                page:1,
                limit:15,
                areaName:"",
                areaType:"",
                beginTime:"",
                endTime:""
            },
            options:[{
                value: '',
                label: '请选择'
                }, {
                value: 1,
                label: '地上'
                }, {
                value: 2,
                label: '地下'
            }],
            dataList:[],
            total:0,
            dialogFormVisiblePhoto:false,
            dialogFormVisibleArea:false,
            searchFlag:true, //添加区层为true,修改区层为false
            formLabelWidth: '100px',
            rulesArea:{
                name: [
                    { required: true, message: '请填写区层名称', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                width:[
                    { 
                        required: true, 
                        trigger: 'blur',
                        type:'number',
                        validator:(rule,value,callback)=>{
                            // console.log(rule,value);
                            if(value != ""){
                                if((/^\d{1,3}$/).test(value) == false){
                                    callback(new Error("请填写1到3位数字"));
                                }else{
                                    callback();
                                }
                            }else{
                                callback(new Error("请填写长度"));
                            }
                        }
                    }
                ],
                height:[
                    { 
                        required: true, 
                        trigger: 'blur',
                        type:'number',
                        validator:(rule,value,callback)=>{
                            // console.log(rule,value);
                            if(value != ""){
                                if((/^\d{1,3}$/).test(value) == false){
                                    callback(new Error("请填写1到3位数字"));
                                }else{
                                    callback();
                                }
                            }else{
                                callback(new Error("请填写宽度"));
                            }
                        }
                    }
                ],
                bgImgUrl: [
                    { required: false}
                ],
                parkingId:[
                    { required: true, message: '请选择停车场', trigger: ['blur', 'change'] }
                ],
            },
            bgImgAllType:[
                {
                    label:'是',
                    value:'1'
                },
                {
                    label:'否',
                    value:'0'
                }
            ],
            areaAllType:[
                {
					label:'地上',
					value:'1'
				},{
					label:'地下',
					value:'0'
                }
            ],
            formArea: {
                id:'',
                name:'',
                type:'1',
                width:'',
                height:'',
                bgImgUrl:'',
                bgImgType:'1'
            },
            park:{
                parkingName:''
            },
            parkList:[],//停车场列表
            itemArea:{},
        };
    },
    created() {
        this.getQueryParkingArea()
        this.permiss
    },
    mounted() {
        this.getParkList(this.park.parkingName)
    },
    methods: {
        //翻页
        currentChange(curPage){
            this.search.page = curPage
            this.getQueryParkingArea()
        },
        //点击查询
        searchList(){
            this.search.page = 1
            var flTime=this.timeCompare(this.search.beginTime,this.search.endTime);
            // console.log(this.search.endTime)
            if(flTime){
                return this.$layer.msg('开始时间请勿大于结束时间', { time: 1});
            }else if(!Boolean(this.search.beginTime)&&Boolean(this.search.endTime)){
                return this.$layer.msg('请选择开始时间', { time: 1});
            }else if(Boolean(this.search.beginTime)&&!Boolean(this.search.endTime)){
                return this.$layer.msg('请选择结束时间', { time: 1});
            }
            this.getQueryParkingArea()
        },
        //时间限制(结束时间不能小于开始时间)
        timeCompare(bDateVal,eDateVal){
            if(!Boolean(bDateVal)||!Boolean(eDateVal)){
                return false;
            }
            var bdate = new Date(Date.parse(bDateVal.replace(/-/g, "/")));
            bdate = bdate.getTime();
            var edate = new Date(Date.parse(eDateVal.replace(/-/g, "/")));
            edate = edate.getTime();
            if(bdate-edate>0){
                return true;
            }else{
                return false;
            }
        },
        //清空
        clearSearch(){
            this.search.beginTime = ''
            this.search.endTime = ''
            this.search.areaName = ''
            this.search.areaType = ''
        },
        //添加区层
        addSearch(){
            this.dialogFormVisibleArea = true
            this.searchFlag = true
        },
        //修改区层
        editRange(item){
            this.searchFlag = false
            this.dialogFormVisibleArea = true
            this.getAreaSingle(item.area_id)
            this.itemArea = item
            this.park.parkingName = item.parking_name
        },
        //跳转场内布局
        jumpParkSet(item){
            this.$router.push({name:'设置',query:{id:item.parking_id,name:item.parking_name,areaId:item.area_id}})
        },
        //区层列表接口
        getQueryParkingArea(){
            //去除前后空格
            this.search.areaName = this.search.areaName.trim()
            getQueryParkingAreaApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                    this.total = res.data.total
                }
            })
        },
        //查询停车场列表
        getParkList(parkingName){
            let parkObj = {
                parkingName:parkingName,
                cityId:'',
                limit:15,
                page:1
            }
            getParkListApi(parkObj).then(res => {
                if(res.status == 200){
                    let data = res.data.rows
                    data.forEach(item => {
                        let obj = {
                            parkingId:item.parkingId,
                            parkingName:item.parkingName
                        }
                        this.parkList.push(obj)
                    })
                }
            })
        },
        remoteMethod(query) {
            if (query !== '') {
                this.parkList = []
                this.loading = true;
                this.getParkList(query)
            }else{
                this.getParkList()
            }
        },
        //查看区层
        getAreaSingle(id){
            getAreaSingleApi({areaId:id}).then(res => {
                if(res.status == 200){
                    this.formArea.id=res.data.areaId;
                    this.formArea.name=res.data.areaName;
                    this.formArea.type=res.data.areaType;
                    this.formArea.width=res.data.width;
                    this.formArea.height=res.data.height;
                    this.formArea.bgImgUrl=res.data.bgImg;
                    this.formArea.bgImgType=res.data.bgimgFlag;
                }
            })
        },
        //修改区层
        editArea(){
            let obj = {
                parkingId:this.itemArea.parking_id,
                areaId:this.formArea.id,
                areaName:this.formArea.name,
                areaType:this.formArea.type,
                bgImg:this.formArea.bgImgUrl,
                bgimgFlag:this.formArea.bgImgType,
                height:this.formArea.height,
                width:this.formArea.width
            }
            editAreaApi(obj,obj.areaId).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleArea = false
                    this.getQueryParkingArea()
                }
            })
        },
        //添加区层
        addArea(){
            let obj = {
                parkingId:this.formArea.parkingId,
                areaName:this.formArea.name,
                areaType:this.formArea.type,
                bgImg:this.formArea.bgImgUrl,
                bgimgFlag:this.formArea.bgImgType,
                height:this.formArea.height,
                width:this.formArea.width
            }
            addAreaApi(obj).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleArea = false
                    this.getQueryParkingArea()
                }
            })
        },
        //关闭弹窗
        closeDialogArea(){
            this.$refs['formArea'].resetFields();
        },
        //上传图片失败
        handleError(rr, file, fileList) {
            console.log(file, fileList);
        },
        //上传图片成功
        handleSuccess(response, file, fileList) {
            this.formArea.bgImgUrl=response.data;
        },
        //编辑区层点击确定
        addEditAreaTrue(){
            var _this=this;
            this.$refs['formArea'].validate(function(valid,noStri){
                if(valid){
                   if(_this.searchFlag){
                       _this.addArea()
                    }else{
                        _this.editArea()
                    }
                    console.log(_this.formArea);
                }
            });
            
        },
        changeCity(val){
            console.log(val,'val');
        }
    },
    computed:{
        ...mapGetters(['elements']),
        permiss(){
            this.rangelist_btn_edit = this.elements['rangelist:btn_edit'];
            this.rangelist_btn_add = this.elements['rangelist:btn_add'];
        },
    },
    components: {
        
    },
    watch:{
        elements: {
            handler: function (val, oldVal) {
                this.permiss;
            },
            deep: true 	//深度
        }
    }
};
</script>

<style scoped lang="less">

</style>

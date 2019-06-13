<!-- 月卡管理 -->
<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">标题</label>
                    <input v-model="search.title" class="form-control" id="" type="text" placeholder="" size="12">
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <button @click="addGuide" type="button" class="btn btn-default">添加</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">标题</td>
                        <td width="100">路径</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(data,index) in dataList" :key="index">
                        <td>{{data.title}}</td>
                        <td>{{data.url}}</td>
                        <td>
                            <a title="照片" href="javascript:;" @click="detail(data)"><span>详情</span></a>&nbsp;&nbsp;
                        	<a title="照片" href="javascript:;" @click="revise(data)"><span>修改</span></a>&nbsp;&nbsp;
                        	<a title="照片" href="javascript:;" @click="remove(data.instId)"><span>删除</span></a>&nbsp;&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
		</div>
		
        <el-dialog title="添加/编辑区层" :visible.sync="dialogFormVisibleArea" width="430px" @close="closeDialogArea">
			<el-form ref="formArea" label-position="right" :model="formArea" :rules="rulesArea" :label-width="formLabelWidth">
				
				<el-form-item label="标题" prop="title">
		    		<el-col :span="18">
		      			<el-input v-model="formArea.title" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
		      	<el-form-item label="布局底图" prop="bgImgUrl">
		    		<el-col :span="18">
		      			<el-input readonly v-model="formArea.url" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			<el-upload
						  class="upload-demo"
						  :action="action"
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
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditAreaTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleArea = false">取 消</el-button>
		  	</div>
		</el-dialog>

        <!-- 详情 -->
		<el-dialog title="详情" :visible.sync="dialogFormVisiblePhoto" width="550px">
            <el-row>
                <el-col :span="24">
                    <div class="dialog-top" >
                        <img :src="formArea.url" class="img-width">
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisiblePhoto = false">确 定</el-button>
		 	</div>
        </el-dialog>

		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
  	</div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getPageApi,instructionsAddApi,instructionsUpdateApi,instructionsRemoveApi} from '@/api/regulation/userGuide.js';
export default {
    data() {
        return {
            search:{
                page:1,
                limit:15,
                title:"",
            },
            formArea: {
                title:'',
                url:'',
            },
            rulesArea:{
                title: [
                    { required: true, message: '请填写图片标题', trigger: 'blur' },
                ],
                bgImgUrl: [
                    { required: false}
                ]
                
            },
            formLabelWidth: '100px',
            dataList:[],
            total:0,
            dialogFormVisibleArea:false,
            dialogFormVisiblePhoto:false,
            // action:"https://www.parking.dda-iot.com/img/oss/upload"
            action:"http://192.168.1.118:9992/oss/upload",
            guideFlag:null
        };
    },
    created() {
        this.getPage()
    },
    mounted() {
        
    },
    methods: {
        //翻页
        currentChange(curPage){
            this.search.page = curPage
            this.getPage()
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
            this.getPage()
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
            this.search.beginTime = '',
            this.search.endTime = '',
            this.search.title = ''
        },
        //请求操作说明查询接口
        getPage(){
            //去除前后空格
            this.search.title = this.search.title.trim()
            getPageApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                }
            })
        },
        //操作说明新增接口
        instructionsAdd(data){
            instructionsAddApi(data).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleArea = false;
                    this.getPage()
                    this.$message.success('新增成功');
                }
            })
        },
        //操作说明修改接口
        instructionsUpdate(data,id){
            instructionsUpdateApi(data,id).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleArea = false;
                    this.getPage()
                    this.$message.success('修改成功');
                }
            })
        },
        //操作说明删除接口
        instructionsRemove(id){
            instructionsRemoveApi(id).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleArea = false;
                    this.getPage()
                    this.$message.success('删除成功');
                }
            })
        },
        //关闭弹窗,清空表单
        closeDialogArea:function(){
            this.$refs['formArea'].resetFields();
        },
        //图片上传失败
        handleError(rr, file, fileList) {
            console.log(file, fileList)
        },
        //图片上传成功
        handleSuccess(response, file, fileList) {
            this.formArea.url=response.data
        },
        //点击详情按钮
        detail(data){
            this.dialogFormVisiblePhoto = true
            this.formArea.title = data.title
            this.formArea.url = data.url
        },
        //修改按钮
        revise(item){
            this.dialogFormVisibleArea = true
            this.formArea.title = item.title
            this.formArea.url = item.url
            this.formArea.instId = item.instId
            this.guideFlag = 'revise'
        },
        //删除按钮
        remove(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.instructionsRemove(id)
            })
        },

        addEditAreaTrue(){
            var _this=this;
            this.$refs['formArea'].validate(function(valid,noStri){
                if(valid){
                    // _this.dialogFormVisibleArea = false;
                    if(_this.guideFlag == 'add'){
                        _this.instructionsAdd(_this.formArea)
                    }else if(_this.guideFlag == 'revise'){
                        _this.instructionsUpdate(_this.formArea)
                    }
                }
            });
        },
        //添加按钮
        addGuide(){
            this.dialogFormVisibleArea = true
            this.guideFlag = 'add'
            this.formArea.title = ''
            this.formArea.url = ''
            this.formArea.instId = ''
        }
    },
    computed:{
        ...mapGetters(['elements']),
        permiss(){

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

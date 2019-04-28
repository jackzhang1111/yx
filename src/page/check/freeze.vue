<template>
    <div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				<div class="form-group">
                    <label for="">审核状态</label>
                    <el-select style="width:150px;" v-model="search.status" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in status"
					      :key="index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
					</el-select>
                </div>
                <div class="form-group">
                    <label for="">车位号</label>
                    <input v-model="search.spaceNum" class="form-control" id="" type="text" placeholder="" size="12">
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
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                    	<td width="100">申请时间</td>
                        <td width="100">车位号码</td>
                        <td width="100">停车场名称</td>
                        <td width="80">账户</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crtTime}}</td>
                        <td>{{item.spaceNum}}</td>
                        <td>{{item.parkingName}}</td>
                        <td>{{item.telephone}}</td>
                        <td>
                        	<a title="审核" href="javascript:;" @click="check(item.status,item)">
                                <span :class="{ 'fontgay': !freeze_btn_edit }">{{item.status == 0 ? '未审核': item.status == 1 ? '通过' : '拒绝'}}</span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="pagbox">
                <el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>

            <!-- 审核 -->
            <el-dialog :title="auditName" :visible.sync="dialogFormVisible" width="430px" >
                <el-form ref="currentItem" label-position="right" :model="currentItem" label-width="100px">
                    <el-form-item label="审核结果">
                        <el-select v-model="currentItem.status" placeholder="请选择" @change="statusChange">
                            <el-option
                            v-for="(item,index) in chkStatus"
                            :key="index"
                            :label="item.labelZhCh"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                    <el-form-item label="不通过理由" v-if="currentItem.status==2">
                        <el-input type="textarea" v-model="currentItem.remake"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="checkTrue">确 定</el-button>
                </div>
            </el-dialog>
		</div>
  	</div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getfreezeAuditApi,freezeAuditApi} from '@/api/check/freeze'
export default {
    data() {
        return {
            search:{
                page:1,
                limit:15,
                beginTime:"",
                endTime:"",
                status:'',
                spaceNum:''
            },
            dataList:[],
            currentItem:{//当前这条数据
                status:1,
                remake:'',
                userSpaceId:'',
                id:''
            },
            dialogFormVisible:false,
            freeze_btn_edit:false, //冻结权限按钮
            auditName:'冻结审核',
            total:0,
            status:[
                {
                    labelZhCh:'请选择',
                    value:''
                },
                {
                    labelZhCh:'审核中',
                    value:0
                },
                {
                    labelZhCh:'通过',
                    value:1
                },
                {
                    labelZhCh:'不通过',
                    value:2
                }
            ],
            chkStatus:[
                {
                    labelZhCh:'通过',
                    value:1
                },
                {
                    labelZhCh:'不通过',
                    value:2
                }
            ]
        };
    },
    created() {
        this.permiss
    },
    mounted() {
        this.getfreezeAudit()
        
    },
    methods: {
        //查询
        searchList(){
            this.getfreezeAudit()
        },
        //清空
        clearSearch(){
            this.search.beginTime = ''
            this.search.endTime = ''
            this.search.spaceNum = ''
            this.search.status = ''
        },
        //操作按钮
        check(status,item){
            if(status != 0) return 
            if(!this.freeze_btn_edit) return
            this.dialogFormVisible = true
            this.currentItem.userSpaceId = item.userSpaceId
            this.currentItem.id = item.id
        },
        //审核框点击确定
        checkTrue(){
            this.freezeAudit()
        },
         //翻页
        currentChange(val){
            this.search.page = val
            this.getfreezeAudit()
        },
        //审核结果发生变化
        statusChange(val){
            if(val == 1) this.currentItem.remake = ''
        },
        //冻结审核记录表
        getfreezeAudit(){
            getfreezeAuditApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                    this.total = res.data.total
                }
            })
        },
        //冻结审核提交
        freezeAudit(){
            freezeAuditApi(this.currentItem).then(res => {
                if(res.status == 200){
                    this.dialogFormVisible = false
                    this.getfreezeAudit()
                }
            })
        }
    },
    components: {

    },
    computed:{
        ...mapGetters(['elements']),
        permiss(){
            this.freeze_btn_edit = this.elements['freeze:btn_edit'];
        },
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

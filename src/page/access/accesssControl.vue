<!-- 室内出入口  -->
<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for=""> 内容</label>
                    <input v-model="search.details" class="form-control" id="" type="text" placeholder="" size="12">
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
                        <td width="100">创建时间</td>
                        <td width="80">车牌号</td>
                        <td width="100">进场时间</td>
                        <td width="100">出场时间</td>
                        <td width="100">停车场</td>
                        <td width="100">停车时长</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crtTime}}</td>
                        <td>{{item.plate.carNumber}}</td>
                        <td>{{item.accDate}}</td>
                        <td>{{item.gououtDate}}</td>
                        <td>{{item.parking.parkingName}}</td>
                        <td>{{getTime(item.accDate,item.gououtDate)}}</td>
                        <td>
                            <a title="查看" href="javascript:;" ><span @click="showDetails(item)">详情</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
        <!-- 出入口详情 -->
		<el-dialog title="详情" :visible.sync="dialogFormVisiblePhoto" width="500px">
            <div class="dialog-top" >
                <div class="entrance-name">
                    <span>入口名称:{{itemAccinId.parkingIoName}}</span>
                </div>
                <div class="entrance-img">
                    <span>入口照片</span>
                </div>
                <img :src="itemDetail.accPhoto" class="img-width">
            </div>
            <div class="dialog-top" v-if="itemDetail.gououtPhoto != 'null' && itemDetail.gououtPhoto">
                <div class="exit-name">
                    <span>出口名称:{{itemExitId.parkingIoName}}</span>
                </div>
                <div class="exit-phone">
                    <span>出口照片</span>
                </div>
                <img :src="itemDetail.gououtPhoto" class="img-width">
            </div>
            <div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisiblePhoto = false">确 定</el-button>
		 	</div>
        </el-dialog>
  	</div>
</template>

<script>
import Page from '../commons/page.vue';
import {getAccessApi} from '@/api/access/access.js';
import { getTime } from "@/utils/funciton.js"
export default {
    data() {
        return {
            search:{
                page:1,
                limit:15,
                details:"",
                beginTime:"",
                endTime:""
            },
            dataList:[],
            total:0,
            dialogFormVisiblePhoto:false,
            itemDetail:{},
            itemAccinId:{},
            itemExitId:{},
            getTime:getTime
        };
    },
    created() {
        this.getAccess()
    },
    mounted() {
        
    },
    methods: {
        //翻页
        currentChange(curPage){
            this.search.page = curPage
            this.getAccess()
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
            this.getAccess()
        },
        //时间限制(结束时间不能小于开始时间)
        timeCompare(bDateVal,eDateVal){
            // console.log(bDateVal,eDateVal);

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
            this.search.details = ''
        },
        //请求接口
        getAccess(){
            //去除前后空格
            this.search.details = this.search.details.trim()
            getAccessApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                    this.total = res.data.total
                    this.itemDetail = this.dataList.length > 0 ? this.dataList[0] : {}
                }
                
            })
        },
        //查看详情
        showDetails(item){
            this.dialogFormVisiblePhoto = true
            this.itemDetail = item
            this.itemAccinId = this.itemDetail.accinParkingIo
            this.itemExitId = this.itemDetail.exitId ? this.itemDetail.exitParkingIo:{}
        },
    },
    components: {
        Page
    },
};
</script>

<style scoped lang="less">
.modal-body .tab-img li{
    width:100px;
    height:100px;
    margin:10px 10px;
}
.dialog-top{
    width: 100%;
    color: #222222;
    font-size: 16px;
    .entrance-name,.entrance-img,.exit-name,.exit-phone{
        margin-bottom: 14px;
    }
}
.img-width{
    max-width: 450px;
    margin-bottom: 29px;
}
</style>

<!-- 路测出入口  -->
<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for=""> 车位号</label>
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
                        <td width="100">创建时间</td>
                        <td width="80">车牌号</td>
                        <td width="100">进场时间</td>
                        <td width="100">出场时间</td>
                        <td width="100">停车场</td>
                        <td width="100">停车时长</td>
                        <td width="80">车位号</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crt_time}}</td>
                        <td>{{(item.car_number)}}</td>
                        <td>{{item.begin_date}}</td>
                        <td>{{item.end_date}}</td>
                        <td>{{(item.parking_name)}}</td>
                        <td>{{getTime(item.begin_date,item.end_date)}}</td>
                        <td>{{item.space_num}}</td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
  	</div>
</template>

<script>
import Page from '../commons/page.vue';
import {getQeryLotMsgApi} from '@/api/access/roadside.js';
import { getTime } from "@/utils/funciton.js"
export default {
    data() {
        return {
            search:{
                page:1,
                limit:15,
                spaceNum:"",
                beginTime:"",
                endTime:""
            },
            dataList:[],
            total:0,
            dialogFormVisiblePhoto:false,
            getTime:getTime,
        };
    },
    created() {
        this.getQeryLotMsg()
    },
    mounted() {
        
    },
    methods: {
        //翻页
        currentChange(curPage){
            this.search.page = curPage
            this.getQeryLotMsg()
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
            this.getQeryLotMsg()
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
            this.search.spaceNum = ''
        },
        //请求接口
        getQeryLotMsg(){
            //去除前后空格
            this.search.spaceNum = this.search.spaceNum.trim()
            getQeryLotMsgApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                    this.total = res.data.total
                }
                
            })
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

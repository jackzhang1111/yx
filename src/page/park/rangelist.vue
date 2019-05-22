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
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crt_time}}</td>
                        <td>{{item.area_name}}</td>
                        <td>{{item.area_type == 1 ? '地上':'地下'}}</td>
                        <td>{{item.parking_name}}</td>
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
import {getQueryParkingAreaApi} from '@/api/park/rangelist.js';
export default {
    data() {
        return {
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
        };
    },
    created() {
        this.getQueryParkingArea()
    },
    mounted() {
        
    },
    methods: {
        //翻页
        currentChange(curPage){
            this.search.page = curPage
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
        //请求接口
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
    },
    components: {
        
    },
};
</script>

<style scoped lang="less">

</style>

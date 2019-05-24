<!-- 车位管理列表 -->
<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">车位号</label>
                    <input v-model="search.spaceNum" class="form-control" id="" type="text" placeholder="" size="12">
                </div>
                <div class="form-group">
                    <label for="">车位类型</label>
                    <el-select style="width:150px;" v-model="search.spaceType" placeholder="请选择">
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
                        <td width="100">车位号码</td>
                        <td width="100">车位类型</td>
                        <td width="100">车场名称</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crt_time}}</td>
                        <td>{{item.parking_name}}</td>
                        <td>{{item.space_num}}</td>
                        <td>{{getType('spaceAllType',item.space_type)}}</td>
                        <td>{{item.area_name}}</td>
                        <td>
                            <a title="审核" href="javascript:;" >
                                <span @click="bindEquip(item.space_id,item)">绑定设备</span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
		</div>
		
        <!-- 审核 -->
            <el-dialog title="绑定设备" :visible.sync="dialogFormVisible" width="900px" >
                <el-form ref="currentItem" label-position="right" :model="currentItem" label-width="180px">
                    <el-form-item v-for="(item,index) in spaceEquipList" :key="index">
                        <span slot="label">{{item.typeName}}&nbsp;&nbsp;</span>
                        <span slot="label">*SN</span>
                        <el-row :gutter="5">
                            <el-col :span="20">
                                <el-select v-model="bbb[index]" placeholder="请选择" style="width:100%;" @change="change" v-if="!ccc[index]"  @visible-change="ddd($event,item.typeCode)" :loading="loading"> 
                                    <el-option  v-for="(i,index) in aaa" :key="index" :value="i.onerankdevDevSn"  >
                                        <span style="float: left">设备ID:{{i.onerankdevTerminId}},&nbsp;&nbsp;</span>
                                        <span style="float: left">设备SN:{{i.onerankdevDevSn}}</span>
                                    </el-option>
                                </el-select>
                                <div class="el-input" v-else>
                                    <div v-for="(spa,index) in spaceBindedList" :key="index">
                                        <span v-if="item.typeCode == spa.onerankdevType" class="el-input__inner el-input-imitation">{{`设备ID:${spa.onerankdevTerminId},SN设备:${bbb[index]}`}}</span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <button type="button" class="btn btn-default" v-if="ccc[index]" @click="relieve(bbb[index])">解绑</button>
                            </el-col>
                         </el-row>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>

		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
  	</div>
</template>

<script>
import {getQueryParkingSpaceApi,getSpaceBindEquipApi,getSpaceEquipApi,addBatchOnerankdeApi,spaceUnbindEquipApi} from '@/api/park/carportlist.js';
export default {
    data() {
        return {
            aaa:[],
            bbb:[],
            ccc:[],//初始化设备
            search:{
                page:1,
                limit:15,
                spaceNum:"",
                spaceType:"",
                beginTime:"",
                endTime:""
            },
            options:[
                {
                    value: '',
                    label: '请选择'
                }, 
                {
                    value: 'common',
                    label: '普通车位'
                }, 
                {
                    value: 'vip',
                    label: 'vip车位'
                },
                {
                    value: 'temporary',
                    label: '临时车位'
                },
                {
                    value: 'private',
                    label: '私人车位'
                }
            ],
            spaceAllType:[
                {
                    labelZhCh:'普通车位',
                    value:'common'
                },
                {
                    labelZhCh:'vip车位',
                    value:'vip'
                },
                {
                    labelZhCh:'临时车位',
                    value:'temporary'
                },
                {
                    labelZhCh:'私人车位',
                    value:'private'
                }
            ],
            currentItem:{},
            dataList:[],
            spaceEquipList:[],
            spaceBindedList:[],
            total:0,
            dialogFormVisible:false,
            loading:false,
            atEquip:{},
            carId:''//当前车位ID
        };
    },
    created() {
        this.getQueryParkingSpace()
    },
    mounted() {
        
    },
    methods: {
        //设备绑定下拉框出现
        ddd(flag,typeCode){
            if(flag){
                this.getSpaceEquip(typeCode)
            }
        },
        change(value){
            // console.log(this.bbb,value);
        },
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
            this.getQueryParkingSpace()
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
            this.search.spaceType = ''
        },
        //请求接口
        getQueryParkingSpace(){
            //去除前后空格
            this.search.spaceNum = this.search.spaceNum.trim()
            getQueryParkingSpaceApi(this.search).then(res => {
                if(res.status == 200){
                    this.dataList = res.data.rows
                    this.total = res.data.total
                }
            })
        },
        //解析类型
        getType(list,type){
            let name = ''
            this[list].forEach(item => {
                if(item.value == type){
                    name = item.labelZhCh
                }
            });
            return name
        },
        //绑定设备按钮
        bindEquip(id,item){
            this.dialogFormVisible = true
            this.atEquip = item
            this.carId = id
            // console.log(this.atEquip);
            this.getSpaceBindEquip(id)
        },
        //设备列表
        getSpaceBindEquip(id){
            //先清空
            this.bbb = []
            getSpaceBindEquipApi(id).then(res => {
                if(res.status == 200){
                    this.spaceEquipList=res.data.sceneDevList;
                    this.spaceBindedList=res.data.onerankdevList;
                    this.toHeavy(this.spaceEquipList,this.spaceBindedList)
                    this.spaceEquipList.forEach((item,index) => {
                        this.spaceBindedList.forEach((space) => {
                            if(item.typeCode == space.onerankdevType){
                                this.bbb[index] = space.onerankdevDevSn
                            }
                        })
                    })
                    this.ccc = this.$fn.copy(this.bbb)
                }
            })
        },
        //车位设备绑定每样设备只能绑定一个设备
        toHeavy(listOne,listTwo){
            // console.log(listOne,listTwo,'listOne,listTwo');
            listOne.forEach(item => {
                listTwo.forEach(itemSub => {
                    if(itemSub.onerankdevType == item.typeCode){
                        item.flag = true
                    }
                })
            })
        },
        getSpaceEquip(id){
            this.loading = true
            getSpaceEquipApi({devType:id}).then(res => {
                if(res.status == 200){
                    this.aaa = res.data.rows
                }
                this.loading = false
            })
        },
        //点击确定
        submit(){
            let arr = []
            let arr1 = []
            function getArrDifference(arr1, arr2) {
                return arr1.concat(arr2).filter(function(v, i, arr) {
                    return arr.indexOf(v) === arr.lastIndexOf(v);
                });
            }
            arr1 = getArrDifference(this.ccc,this.bbb);
            arr1.forEach(item => {
                let obj = {
                    onerankdevSn:'',
                    spaceId:''
                }
                obj.onerankdevSn = item
                obj.spaceId = this.atEquip.space_id
                arr.push(obj)
            })
            console.log(arr);
            this.addBatchOnerankde(arr)
        },
        //批量绑定设备
        addBatchOnerankde(datas){
            addBatchOnerankdeApi(datas).then(res => {
                if(res.status == 200){
                    this.dialogFormVisible = false
                    this.$message.success({message: '绑定成功'})
                }
            })
        },
        //解除绑定设备
        spaceUnbindEquip(devSn){
            spaceUnbindEquipApi(devSn).then(res => {
                this.getSpaceBindEquip(this.carId)
                this.$message.success({message: '解绑成功'})
            })
        },
        //解绑按钮
        relieve(sn){
            this.spaceUnbindEquip(sn)
        }
    },
    computed:{
        
    },
    components: {
        
    },
};
</script>

<style scoped lang="less">
.el-input-imitation{
    line-height:34px;
    height:34px;
    margin-bottom:-12px
}
</style>

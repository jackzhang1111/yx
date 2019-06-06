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
                <!-- <button @click="addSearch" type="button" class="btn btn-default">添加</button> -->
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">创建时间</td>
                        <td width="100">停车场名称</td>
                        <td width="80">区层名称</td>
                        <td width="100">车位号码</td>
                        <td width="100">车位类型</td>
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody class="tbody">
                    <tr v-for="(item,index) in dataList" :key="index">
                        <td>{{item.crt_time}}</td>
                        <td>{{item.parking_name}}</td>
                        <td>{{item.area_name}}</td>
                        <td>{{item.space_num}}</td>
                        <td>{{getType('spaceAllType',item.space_type)}}</td>
                        <td>
                            <a title="审核" href="javascript:;" v-if="carportlist_btn_bind">
                                <span @click="bindEquip(item.space_id,item)">绑定设备&nbsp;&nbsp;</span>
                            </a>
                             <a title="审核" href="javascript:;" v-if="carportlist_btn_setcar">
                                <span @click="editCarport(item)">车位设置</span>
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
                                <el-select v-model="onerank[index]" placeholder="请选择" style="width:100%;" v-if="!statusList[index]"  @visible-change="change($event,item.typeCode)" :loading="loading"> 
                                    <el-option  v-for="(i,index1) in onerankdevList" :key="index1" :value="i.onerankdevDevSn"  >
                                        <span style="float: left">设备ID:{{i.onerankdevTerminId}},&nbsp;&nbsp;</span>
                                        <span style="float: left">设备SN:{{i.onerankdevDevSn}}</span>
                                    </el-option>
                                </el-select>
                                <div class="el-input" v-else>
                                    <div v-for="(spa,index2) in spaceBindedList" :key="index2">
                                        <span v-if="item.typeCode == spa.onerankdevType" class="el-input__inner el-input-imitation">{{`设备ID:${spa.onerankdevTerminId},SN设备:${onerank[index]}`}}{{index}}</span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <button type="button" class="btn btn-default" v-if="statusList[index]" @click="relieve(onerank[index])">解绑</button>
                            </el-col>
                         </el-row>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>

        <!-- 添加/编辑车位 -->
		<el-dialog title="添加/编辑车位" :visible.sync="dialogFormVisibleSpace" width="430px"  @close="closeDialogSpace">
			<el-form ref="formSpace" label-position="right" :model="formSpace" :rules="rulesSpace" :label-width="formLabelWidth">
				
				<el-form-item label="所属区层">
		    		<el-col :span="18">
		      			<el-input readonly v-model="mergeName" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="车位号码" prop="number">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formSpace.number" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				<el-form-item label="车位类型">
		    		<el-col :span="18">
		      			<el-select @change="changeSpaceType" v-model="formSpace.type" placeholder="请选择">
						    <el-option
						      v-for="item in spaceAllType"
						      :key="item.index"
						      :label="item.labelZhCh"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item v-if="userShow" label="用户手机" prop="userId">
		    		<el-col :span="18">
		      			<el-select filterable v-model="formSpace.userId" placeholder="请选择">
						    <el-option
						      v-for="item in allUser"
						      :key="item.id"
						      :label="item.mobile"
						      :value="item.id">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="占格方向">
		    		<el-col :span="18">
		      			<el-select v-model="formSpace.toward" placeholder="请选择">
						    <el-option
						      v-for="item in spaceAllToward"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditSpaceTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleSpace = false">取 消</el-button>
		  	</div>
		</el-dialog>
            

		<div class="pagbox">
			<el-pagination @current-change="currentChange" :current-page="search.page" :page-size="search.limit" :pager-count="5" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
  	</div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getQueryParkingSpaceApi,getSpaceBindEquipApi,getSpaceEquipApi,addBatchOnerankdeApi,spaceUnbindEquipApi,getSpaceSingleApi,editSpaceApi,addSpaceApi,getUserListApi} from '@/api/park/carportlist.js';
export default {
    data() {
        return {
            carportlist_btn_bind:false,
            carportlist_btn_setcar:false,

            onerankdevList:[],
            onerank:[],
            allUser:[],//用户手机列表
            statusList:[],//初始化设备
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
            spaceAllToward:[{
                label:'上',
                value:'1'
            },{
                label:'右',
                value:'2'
            },{
                label:'下',
                value:'3'
            },{
                label:'左',
                value:'4'
            }],
            formSpace: {
                id:'',
                userId:'',
                number:'',
                type:'common',
                toward:'1',

                angle:0,
                zoom:100,
                x:0,
                y:0,

                status:'normal',	//异常类型
                lotType:'n'		//有无车
            },
            rulesSpace:{
                number:[
                    {
                        required: true, 
                        trigger: 'blur',
                        type:'number',
                        validator:(rule,value,callback)=>{
                            // console.log(rule,value);
                            if(value != ""){
                                if((/^\d{6,6}$/).test(value) == false){
                                    callback(new Error("请填写6位数字"));
                                }else{
                                    callback();
                                }
                            }else{
                                callback(new Error("请填写车位号"));
                            }
                        }
                    }
                ],
                userId:[
                    { required: true, message: '请选择用户', trigger: ['blur', 'change'] }
                ]
            },
            currentItem:{},
            dataList:[],
            spaceEquipList:[],
            spaceBindedList:[],
            total:0,
            dialogFormVisible:false,
            dialogFormVisibleSpace:false,
            loading:false,
            userShow:false,
            isAddcar:false,
            atEquip:{},
            formLabelWidth: '100px',
            carId:''//当前车位ID
        };
    },
    created() {
        this.getQueryParkingSpace()
        this.getUserList()
        this.permiss
    },
    mounted() {
        
    },
    methods: {
        //设备绑定下拉框出现
        change(flag,typeCode){
            if(flag){
                this.getSpaceEquip(typeCode)
            }
        },
        //翻页
        currentChange(curPage){
            this.search.page = curPage
            this.getQueryParkingSpace()
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
        //车位管理列表接口
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
            this.onerank = []
            getSpaceBindEquipApi(id).then(res => {
                if(res.status == 200){
                    this.spaceEquipList=res.data.sceneDevList;
                    this.spaceBindedList=res.data.onerankdevList;
                    this.toHeavy(this.spaceEquipList,this.spaceBindedList)
                    this.spaceEquipList.forEach((item,index) => {
                        this.spaceBindedList.forEach((space) => {
                            if(item.typeCode == space.onerankdevType){
                                this.onerank[index] = space.onerankdevDevSn
                            }
                        })
                    })
                    this.statusList = this.$fn.copy(this.onerank)
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
        //查询可选设备接口
        getSpaceEquip(id){
            this.loading = true
            getSpaceEquipApi({devType:id}).then(res => {
                if(res.status == 200){
                    this.onerankdevList = res.data.rows
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
            arr1 = getArrDifference(this.statusList,this.onerank);
            arr1.forEach(item => {
                let obj = {
                    onerankdevSn:'',
                    spaceId:''
                }
                obj.onerankdevSn = item
                obj.spaceId = this.atEquip.space_id
                arr.push(obj)
            })
            if(arr.length == 0){
                this.dialogFormVisible = false
                return
            }
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
        },
        //更改车位类型
        changeSpaceType:function(val){
            if(val=="private"){
                this.userShow=true;
            }else{
                this.userShow=false;
            }
        },
        //关闭车位编辑弹窗
        closeDialogSpace:function(){
            this.$refs['formSpace'].resetFields();
            this.formSpace.type='common';
				
        },
        //车位点击确定按钮
        addEditSpaceTrue(){
            let obj = {
                parkingId:this.formSpace.parkingId,
                areaId:this.atEquip.area_id,
                spaceId:this.formSpace.id,
                spaceNum:this.formSpace.number,
                spaceType:this.formSpace.type,
                userId:this.formSpace.type=='private' ? this.formSpace.userId : '',
                abscissa:this.formSpace.x,
                ordinate:this.formSpace.y,
                toward:this.formSpace.toward,
                angle:this.formSpace.angle,
                zoom:this.formSpace.zoom,
                spaceStatus:this.formSpace.status,
                lotType:this.formSpace.lotType,
            }
            if(this.isAddcar){

            }else{
                this.editSpace(obj)
            }
            console.log(obj,'obj');
        },
        //车位设置
        editCarport(carport){
            this.dialogFormVisibleSpace = true
            this.isAddcar = false
            this.atEquip = carport
            this.getSpaceSingle(carport.space_id)
        },
        //添加
        addSearch(){
            this.dialogFormVisibleSpace = true
            this.isAddcar = true

        },
        //查看车位信息
        getSpaceSingle(id){
            getSpaceSingleApi({spaceId:id}).then(res => {
                if(res.status == 200){
                    this.formSpace.id = res.data.spaceId;
                    this.formSpace.number = res.data.spaceNum;
                    this.formSpace.type = res.data.spaceType;
                    this.formSpace.toward = res.data.toward;
                    this.formSpace.angle = res.data.angle;
                    this.formSpace.x = res.data.abscissa;
                    this.formSpace.y = res.data.ordinate;
                    this.formSpace.userId = res.data.userId;
                    this.formSpace.parkingId = res.data.parkingId
                    if(res.data.spaceType =="private"){
                        this.userShow = true;
                    }else{
                        this.userShow = false;
                    }
                }
            })
        },
        //修改车位
        editSpace(data){
            editSpaceApi(data,data.spaceId).then(res => {
                if(res.status == 200){
                    this.dialogFormVisibleSpace = false
                    this.$message.success('修改成功');
                    this.getQueryParkingSpace()
                }
            })
        },
        //新增车位
        addSpace(){
            addSpaceApi().then(res => {
                
            })
        },
        //用户手机列表
        getUserList(){
            getUserListApi({page:'1',limit:"200"}).then(res => {
                if(res.status == 200){
                    this.allUser=res.data.rows;
                }
            })
        }
    },
    computed:{
        ...mapGetters(['elements']),
        permiss(){
            this.carportlist_btn_setcar = this.elements['carportlist:btn_setcar'];
            this.carportlist_btn_bind = this.elements['carportlist:btn_bind'];
        },
        mergeName(){
            return this.atEquip.parking_name + '-' + this.atEquip.area_name
        } 
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
.el-input-imitation{
    line-height:34px;
    height:34px;
    margin-bottom:-12px
}
</style>

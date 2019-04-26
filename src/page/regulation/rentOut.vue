<template>
    <div class="rent-out">
        <el-row>
            <el-col :span="24">
                <div class="rent-con">
                    <el-row>
                        <el-col :span="12">
                            <div class="con-left">
                                <div class="title">
                                    <span>车位冻结</span>
                                </div>
                                <div class="con-content">
                                    <div class="margin-b-23">
                                        <span class="txt">冻结次数</span>
                                        <input v-model="form.freezingTimes" type="text" class="time-input"  @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">
                                        <span class="txt">次</span>
                                    </div>
                                    <div>
                                        <span class="txt">冻结提前时间</span>
                                        <input v-model="form.frozenLeadTime" type="text" class="time-input" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">
                                        <span class="txt">天</span>
                                    </div>
                                    <div class="con-bottom">
                                        <span>冻结条件</span><br/>
                                        <span>1.每月最多只能冻结{{freezingTimes}}次</span><br/>
                                        <span>2.再次点击我要冻结，可以解冻</span><br/>
                                        <span>3.冻结时间到后如果不解冻{{frozenLeadTime}}天后平台自动解冻</span><br/>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="con-right">
                                <div class="title">
                                    <span>车位注销</span>
                                </div>
                                <div class="con-content">
                                    <div class="margin-b-23">
                                        <span class="txt">注销次数</span>
                                        <input v-model="form.cancellationTimes" type="text" class="time-input" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">
                                        <span class="txt">次</span>
                                    </div>
                                    <div>
                                        <span class="txt">注销提前时间</span>
                                        <input v-model="form.cancellationLeadTime" type="text" class="time-input" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">
                                        <span class="txt">天</span>
                                    </div>
                                    <div class="con-bottom">
                                        <span>注销条件</span><br/>
                                        <span>1.每年注销、申请最多不能超过{{cancellationTimes}}次</span><br/>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-button type="success" class="rent-btn" :loading="loading" @click="submit">提交</el-button>
    </div>
</template>

<script>
import {getSharingRuleReApi,updateSharingRuleApi} from '@/api/regulation/rentOut'
export default {
    data() {
        return {
            form:{
                freezingTimes:'',//冻结次数
                frozenLeadTime:'',//冻结提前时间
                cancellationTimes:'',//注销次数
                cancellationLeadTime:''//注销提前时间
            },
            loading:false,
            freezingTimes:'',
            cancellationTimes:'',
            frozenLeadTime:'',
            cancellationLeadTime:''

        };
    },
    created() {

    },
    mounted() {
        this.getSharingRuleRe()
    },
    methods: {
        handleKeyupTime(e){
            e.target.value=e.target.value.replace(/\D/g,'')
        },
        handleAfterpasteTime:function(e){
            e.target.value=e.target.value.replace(/\D/g,'')
        },
        getSharingRuleRe(){
            getSharingRuleReApi().then(res => {
                if(res.status == 200){
                    this.form = Object.assign({},this.form,res.data.rows[0])
                    this.freezingTimes = res.data.rows[0].freezingTimes
                    this.cancellationTimes = res.data.rows[0].cancellationTimes
                    this.frozenLeadTime = res.data.rows[0].frozenLeadTime
                    this.cancellationLeadTime = res.data.rows[0].cancellationLeadTime
                }
            })
        },
        submit(){
            this.loading = true
            this.updateSharingRule()
        },
        updateSharingRule(){
            var _this=this;
            updateSharingRuleApi(this.form).then(res => {
                if(res.status == 200){
                    this.$message.success('提交成功！');
                    this.freezingTimes = res.data.freezingTimes
                    this.cancellationTimes = res.data.cancellationTimes
                    this.frozenLeadTime = res.data.frozenLeadTime
                    this.cancellationLeadTime = res.data.cancellationLeadTime
                }
                this.loading = false
            }).catch(function(error){
                _this.loading = false
            });
        }
    },
    components: {

    },
    computed: {

    },
};
</script>

<style scoped lang="less">
.rent-out{
    width: 100%;
    padding: 0 16px;
    margin-top: 20px;
    .rent-con{
        width: 100%;
        overflow: hidden;
        border:1px solid #D2D2D2;
        color: #3F3F3F;
    }
    .con-left{
        width: 100%;
        height:600px;
        float: left;
        border-right:1px solid #D2D2D2;
    }
    .con-right{
        width: 100%;
        height:600px;
        float: right;
    }
    .title{
        width: 100%;
        background-color: #02C1AF;
        height:44px;
        padding-left: 44px;
        line-height: 44px;
        font-size: 17px;
        color:#fff;
    }
    .con-content{
        position: relative;
        margin-top:49px;
        width: 100%;
        height:521px;
        padding-left: 44px;
        .con-bottom{
            position: absolute;
            bottom: 0;
            left:44px;;
            height:200px;
        }
    }
    .time-input{
		width: 69px;
	    height: 30px;
	    border-radius: 2px;
	    text-align: center;
        color: #02c1af;
        border: 1px solid #ccc;
        margin: 0 8px;
    }
    .form-label{
        /deep/ .el-form-item__label{
            line-height: 40px;
        }
        .txt{
            margin-left:12px;
        }

    }
    .rent-btn{
        width:88px;
        height:40px;
        background:rgba(2,193,175,1);
        border-radius:12px;
        margin: 50px 0 0 44px;
        text-align: center;
        color: #fff;
        font-size: 17px;
        border: 0
    }
    .margin-b-23{
        margin-bottom: 23px;
    }
}
</style>

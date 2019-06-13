import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/page/login.vue'
import Main from '@/page/main.vue'

import Home from '../page/home.vue'


//停车
import RouteTemp from '../page/commons/routeTemp.vue'

import ParkList from '../page/park/parklist.vue'
import ParkSet from '../page/park/parkset.vue'
import Staff from '../page/park/staff.vue'
//月卡列表
import Cardlist from '../page/park/cardlist.vue'
//区层列表
import Rangelist from '../page/park/rangelist.vue'
//车位列表
import Carportlist from '../page/park/carportlist.vue'
import PlateCheck from '../page/check/platecheck.vue'
import PrivateSpace from '../page/check/privatespace.vue'
import Freeze from '../page/check/freeze.vue'
import Eliminate from '../page/check/eliminate.vue'

import UserList from '../page/user/userlist.vue'
import Manager from '../page/user/manager.vue'

//反馈
import Handset from '../page/feedback/handset.vue'
import App from '../page/feedback/app.vue'
import Magnetic from '../page/feedback/magnetic.vue'

//订单
import Running from '../page/order/running.vue'

//咨询
import ConsultList from '../page/consult/consultlist.vue'
import Edit from '../page/consult/edit2.vue'

//室内出入口
import AccesssControl from '@/page/access/accesssControl.vue'
//路测出入口管理
import RoadsideControl from '@/page/access/roadsideControl.vue'

//出租规则
import RentOut from '../page/regulation/rentOut.vue'

//操作指南
import userGuide from '../page/regulation/userGuide.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
    	path: '/main',
    	name:'首页',
    	component:Main,
    	children:[{
            path: '/',
            name:'',
            component:Home
        },{
            path: '/main/park/parklist',
            name:'停车场',
            component:RouteTemp,
            children:[{
                path: '/',
                name:'',
                component:ParkList
            },{
                path: '/main/park/parkset',
                name:'设置',
                component:ParkSet
                
            },{
                path: '/main/park/staff',
                name:'人员',
                component:Staff
                
            },{
                path: '/main/park/cardlist',
                name:'月卡',
                component:Cardlist
                
            },{
                path: '/main/park/rangelist',
                name:'区层',
                component:Rangelist
                
            },{
                path: '/main/park/carportlist',
                name:'车位',
                component:Carportlist
                
            }]
        },{
            path: '/main/check/platecheck',
            name:'车牌',
            component:PlateCheck
        },{
            path: '/main/check/privatespace',
            name:'共享',
            component:PrivateSpace
        },{
            path: '/main/check/freeze',
            name:'冻结',
            component:Freeze
        },{
            path: '/main/check/eliminate',
            name:'注销',
            component:Eliminate
        },{
            path: '/main/user/userlist',
            name:'车主',
            component:UserList
        },{
            path: '/main/user/manager',
            name:'管理员',
            component:Manager
        },{
            path: '/main/feedback/handset',
            name:'手持机',
            component:Handset
        },{
            path: '/main/feedback/app',
            name:'手机',
            component:App
        },{
            path: '/main/feedback/magnetic',
            name:'地磁',
            component:Magnetic
        },{
            path: '/main/order/running',
            name:'进行',
            component:Running
        },{
            path: '/main/order/complete',
            name:'完成',
            component:Running
        },{
            path: '/main/order/unpay',
            name:'待付',
            component:Running
        },{
            path: '/main/consult/consultlist',
            name:'咨询',
            component:RouteTemp,
            children:[{
                path: '/',
                name:'',
                component:ConsultList
            },{
                path: '/main/consult/edit',
                name:'内容',
                component:Edit
                
            }]
        },{
            path: '/main/access/accesssControl',
            name:'室内出入口',
            component:AccesssControl
        },{
            path: '/main/access/roadsideControl',
            name:'路测出入口',
            component:RoadsideControl
        },{
            path: '/main/regulation/rentOut',
            name:'出租规则',
            component:RentOut
        },{
            path: '/main/regulation/userGuide',
            name:'操作说明',
            component:userGuide
        }]
    }
  ]
})

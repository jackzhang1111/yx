import {main, park} from '@/api/index'
//车位管理列表
export function getQueryParkingSpaceApi(params) {
  return main({
    url: 'parking/parkingSpace/queryParkingSpace',
    method: 'get',
    params
  })
}
//设备列表
export function getSpaceBindEquipApi(id) {
  return main({
    url: `parking/onerankdev/queryOnerankdevBySpaceid/${id}`,
    method: 'get',
  })
}
//可绑定设备列表
export function getSpaceEquipApi(params) {
  return main({
    url: `parking/onerankdev/querySpaceUnBindDev`,
    method: 'get',
    params
  })
}

//批量绑定设备
export function addBatchOnerankdeApi(params) {
  return park({
    responseType:'json',
    url: `parking/spaceOnerankde/addBatchOnerankde`,
    method: 'post',
    data:params
  })
}

//解除绑定设备
export function spaceUnbindEquipApi(params) {
  return park({
    url: `parking/onerankdev/deleteBindDev?devSn=${params}`,
    method: 'delete',
  })
}

//查看车位信息
export function getSpaceSingleApi(params) {
  return park({
    url: `parking/parkingSpace/one`,
    method: 'post',
    data:params
  })
}

//修改车位
export function editSpaceApi(params,id) {
  return park({
    responseType:'json',
    url: `parking/parkingSpace/${id}`,
    method: 'put',
    data:params
  })
}

//新增车位
export function addSpaceApi(params) {
  return park({
    responseType:'json',
    url: `parking/parkingSpace`,
    method: 'post',
    data:params
  })
}

//用户手机列表
export function getUserListApi(params) {
  return main({
    url: `parking/appUser/page`,
    method: 'get',
    params
  })
}
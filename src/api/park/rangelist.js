import {main, park} from '@/api/index'
//区层列表
export function getQueryParkingAreaApi(params) {
  return main({
    url: 'parking/parkingArea/queryParkingArea',
    method: 'get',
    params
  })
}
//查看区层
export function getAreaSingleApi(params) {
  return park({
    responseType:'json',
    url: `parking/parkingArea/one`,
    method: 'post',
    data:params
  })
}
//添加区层
export function addAreaApi(params) {
  return park({
    responseType:'json',
    url: `parking/parkingArea`,
    method: 'post',
    data:params
  })
}
//修改区层
export function editAreaApi(params,id) {
  return park({
    responseType:'json',
    url: `parking/parkingArea/${id}`,
    method: 'put',
    data:params
  })
}

//停车场列表
export function getParkListApi(params) {
  return main({
    url: 'parking/parking/queryParkingByRole',
    method: 'get',
    params
  })
}



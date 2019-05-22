import {main, park} from '@/api/index'
//区层列表
export function getQueryParkingAreaApi(params) {
  return main({
    url: 'parking/parkingArea/queryParkingArea',
    method: 'get',
    params
  })
}

import {main, park} from '@/api/index'
// 路测出入口列表
export function getQeryLotMsgApi(params) {
  return main({
    url: 'parking/lotMsg/queryLotMsg',
    method: 'get',
    params
  })
}
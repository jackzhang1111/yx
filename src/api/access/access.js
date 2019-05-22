import {main, park} from '@/api/index'
// 室内出入口列表
export function getAccessApi(params) {
  return main({
    url: 'parking/ioRecord/page',
    method: 'get',
    params
  })
}
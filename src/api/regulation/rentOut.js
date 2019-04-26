import {main, park} from '@/api/index'
//共享规则记录表
export function getSharingRuleReApi(params) {
  return main({
    url: 'parking/sharingRuleRecords/page',
    method: 'get',
    params
  })
}

//
export function updateSharingRuleApi(params) {
    return park({
        url: 'parking/sharingRuleRecords/update',
        method: 'put',
        data: params
    })
}
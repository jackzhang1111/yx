import {main, park} from '@/api/index'
//冻结审核记录表
export function getfreezeAuditApi(params) {
  return main({
    url: 'parking/freezeAuditRecords/page',
    method: 'get',
    params
  })
}

//冻结审核提交
export function freezeAuditApi(params) {
  return park({
    responseType: 'json',
    url: 'parking/freezeAuditRecords/freezeAudit',
    method: 'post',
    data:params
  })
}
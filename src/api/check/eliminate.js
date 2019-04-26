import {main, park} from '@/api/index'
//销审核记录表
export function getCancellationApi(params) {
  return main({
    url: 'parking/cancellationAuditRecords/page',
    method: 'get',
    params
  })
}

//注销审核提交
export function cancellationAuditApi(params) {
  return park({
    responseType: 'json',
    url: 'parking/cancellationAuditRecords/CancellationAudit',
    method: 'post',
    data:params
  })
}
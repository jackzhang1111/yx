import {main, park} from '@/api/index'
//月卡列表
export function getQueryMonthCardsApi(params) {
  return main({
    url: 'parking/userMoncards/queryMonthCards',
    method: 'get',
    params
  })
}

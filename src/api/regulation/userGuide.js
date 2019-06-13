import {main, park} from '@/api/index'
//操作说明查询
export function getPageApi(params) {
  return main({
    url: 'parking/instructions/page',
    method: 'get',
    params
  })
}

//操作说明增加
export function instructionsAddApi(params) {
    return park({
        url: 'parking/instructions/addInstructions',
        method: 'post',
        data: params
    })
}
//操作说明修改
export function instructionsUpdateApi(params) {
    return park({
        url: `parking/instructions/update`,
        method: 'put',
        data: params
    })
}
//操作说明删除
export function instructionsRemoveApi(id) {
    return park({
        url: `parking/instructions/${id}`,
        method: 'delete',
    })
}
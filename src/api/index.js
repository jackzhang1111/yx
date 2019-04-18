//基础api定义方式
import mainAxios from '@/api/http'
var protocol=window.location.protocol;
var host=window.location.host;
var urlHead=protocol+"//"+host;
var urlLogin=urlHead+'/login/';
console.log(urlLogin,'urlLogin');
function http(params){
    let base = {
        baseURL:urlLogin
    }
    let reqParam = Object.assign({}, base, params)
    return mainAxios(reqParam)
}
export default http
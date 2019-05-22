//深拷贝
export function objDeepCopy(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' && source[item] != null ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}
//结束时间和开始时间的时间差
export function getTime(startTime,endTime){
    if(!startTime || !endTime) return
    let date = startTime.substring(0,19);    
    let date2 = endTime.substring(0,19);  
    date = startTime.replace(/-/g,'/');   
    date2 = endTime.replace(/-/g,'/'); 
    let timestamp = new Date(date).getTime()/1000;
    let timestamp2 = new Date(date2).getTime()/1000;
    return showTime(timestamp,timestamp2)
    function showTime(startTime,endTime){
        let timeDiff = endTime - startTime
        let day = Math.floor(timeDiff / 86400);
        timeDiff = timeDiff % 86400;
        let hour = Math.floor(timeDiff / 3600);
        timeDiff = timeDiff % 3600;
        let minute = Math.floor(timeDiff / 60);
        timeDiff = timeDiff % 60;
        if(hour<10){
            hour = '0'+hour
        }
        if(minute<10){
            minute = '0'+minute
        }
        if(day<10){
            day = '0'+day
        }
        return day+ '天' + hour + '时' + minute + '分'
    }
}
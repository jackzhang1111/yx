export function objDeepCopy(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' && source[item] != null ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}
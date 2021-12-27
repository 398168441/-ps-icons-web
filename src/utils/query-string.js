/**
 * 解析query-string
 * 支持多个同名key的解析，解析为数组
 * 解析后的value是经过decode的
 * @param  {String} str       query字符串
 * @param  {String} [sep='&'] 参数组分隔符，默认是&
 * @param  {String} [eq='=']  key-value分隔符，默认是=
 * @return {Object}           返回解析后的query对象
 */
const parse = (str, sep = '&', eq = '=') => {
  if (!str || !Object.prototype.toString.call(str) === '[object String]') {
    return {}
  }

  str = str.replace(/.*?\?/, '')

  let obj = {}
  let groups = str.split(sep)

  for (let i = 0; i < groups.length; i++) {
    let group = groups[i]
    let keyValue = group.split(eq)
    let key = decodeURIComponent(keyValue[0])
    let value = decodeURIComponent(keyValue[1])

    // only key
    if (keyValue.length === 1) {
      obj[key] = false
      continue
    }

    // array
    if (obj[key]) {
      if (!Object.prototype.call(Array) === '[object Array]'(obj[key])) {
        obj[key] = [obj[key]]
      }
      obj[key].push(value)
      continue
    }

    obj[key] = value
  }

  return obj
}

module.exports = parse

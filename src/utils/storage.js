export const TOKEN = 'TOKEN'
export const LOGIN_INFO = 'LOGIN_INFO'
export const CHECK_PSWD = 'CHECK_PSWD'

const local = {
  setItem(key, val) {
    let strVal = val
    if (typeof val === 'object') {
      strVal = JSON.stringify(val)
    }
    window.localStorage.setItem(key, strVal)
  },
  getItem(key) {
    let val = window.localStorage.getItem(key)
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  },
  removeItem(key) {
    window.localStorage.removeItem(key)
  }
}

const session = {
  setItem(key, val) {
    let strVal = val
    if (typeof val === 'object') {
      strVal = JSON.stringify(val)
    }
    window.sessionStorage.setItem(key, strVal)
  },
  getItem(key) {
    let val = window.sessionStorage.getItem(key)
    return JSON.parse(val)
  },
  removeItem(key) {
    window.sessionStorage.removeItem(key)
  }
}

export { local, session }

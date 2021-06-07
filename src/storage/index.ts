function getStorage(type: 'sessionStorage' | 'localStorage') {
  return {
    get(key: string) {
      let value = window[type].getItem(key)
      if (value) {
        try {
          value = JSON.parse(value)
        } catch {}
      }
      return value
    },
    set(key: string, value: any) {
      try {
        window[type].setItem(key, JSON.stringify(value))
      } catch {}
    },
    has(key: string) {
      return !!window[type].getItem(key)
    },
    remove(key: string) {
      window[type].removeItem(key)
    },
    clear() {
      window[type].clear()
    },
  }
}

export const local = getStorage('localStorage')
export const session = getStorage('sessionStorage')

export default {
  local,
  session,
}

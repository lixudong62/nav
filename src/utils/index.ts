// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import qs from 'qs'
import config from '../../nav.config'
import Clipboard from 'clipboard'
import { INavProps, ISearchEngineProps } from '../types'
import * as db from '../../data/db.json'
import { Target } from '@angular/compiler'

export const websiteList = getWebsiteList()

let total = 0
const { lightThemeConfig, searchEngineList } = config
const { backgroundLinear } = lightThemeConfig

export function debounce(func, wait, immediate) {
  let timeout

  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function fuzzySearch(navList: INavProps[], keyword: string) {
  let searchResultList = [{ nav: [] }]

  function f(arr?: any[]) {
    arr = arr || navList

    for (let i = 0; i < arr.length; i++) {

      if (Array.isArray(arr[i].nav)) {
        f(arr[i].nav)
      }

      if (arr[i].name) {
        const name = arr[i].name.toLowerCase()
        const desc = arr[i].desc.toLowerCase()
        const search = keyword.toLowerCase()

        if (~name.indexOf(search) || ~desc.indexOf(search)) {
          try {
            let result = Object.assign({}, arr[i])
            const regex = new RegExp(`(${keyword})`, 'i')
            result.name = result.name.replace(regex, `$1`.bold())
            result.desc = result.desc.replace(regex, `$1`.bold())

            const idx = searchResultList[0].nav.findIndex(item => item.name === result.name)
            if (idx === -1) {
              searchResultList[0].nav.push(result)
            }
          } catch (err) {}
        }
      }
    }
  }

  f()

  if (searchResultList[0].nav.length <= 0) {
    return []
  }

  return searchResultList
}

export function totalWeb(): number {
  if (total) {
    return total
  }

  function r(nav) {
    if (!Array.isArray(nav)) return

    for (let i = 0; i < nav.length; i++) {
      if (nav[i].url) {
        total += 1
      } else {
        r(nav[i].nav)
      }
    }
  }
  r(websiteList)

  return total
}

let randomTimer
export function randomBgImg() {
  if (isDark()) return

  clearInterval(randomTimer)

  const el = document.createElement('div')
  el.id = 'random-light-bg'
  el.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage = backgroundLinear[randomInt(backgroundLinear.length)]
  document.body.appendChild(el)

  function setBg() {
    const randomBg = backgroundLinear[randomInt(backgroundLinear.length)]
    el.style.opacity = '.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  randomTimer = setInterval(setBg, 10000)
}

export function queryString() {
  const { href } = window.location
  const search = href.slice(href.indexOf('?') + 1)
  const parseQs = qs.parse(search)
  let id = parseInt(parseQs.id) || 0
  let page = parseInt(parseQs.page) || 0
  let localLocation = {}

  if (parseQs.id === undefined && parseQs.page === undefined) {
    try {
      const location = window.localStorage.getItem('location')
      if (location) {
        localLocation = JSON.parse(location)
      }
    } catch {}
  }

  if (page > websiteList.length - 1) {
    page = websiteList.length - 1;
    id = 0;
  } else {
    page = page;
    if (id <= websiteList[page].nav.length - 1) {
      id = id;
    } else {
      id = websiteList[page].nav.length - 1;
    }
  }

  return {
    ...parseQs,
    q: parseQs.q || '',
    id,
    page,
    ...localLocation
  }
}

export function adapterWebsiteList(websiteList: any[], parentItem?: any) {
  const now = new Date()

  for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]
    item.createdAt ||= now.toISOString()

    if (Array.isArray(item.nav)) {
      adapterWebsiteList(item.nav, item)
    }

    if (item.url) {
      if (!item.icon && parentItem?.icon) {
        item.icon = parentItem.icon
      }

      item.urls ||= {}
    }
  }

  return websiteList;
}

export function getWebsiteList() {
  let webSiteList = adapterWebsiteList((db as any).default)
  const scriptElAll = document.querySelectorAll('script')
  const scriptUrl = scriptElAll[scriptElAll.length - 1].src
  const storageScriptUrl = window.localStorage.getItem('s_url')

  // 检测到网站更新，清除缓存
  if (storageScriptUrl !== scriptUrl) {
    const whiteList = ['token', 'IS_DARK']
    const len = window.localStorage.length
    for (let i = 0; i < len; i++) {
      const key = window.localStorage.key(i)
      if (whiteList.includes(key)) {
        continue
      }
      window.localStorage.removeItem(key)
    }
    window.localStorage.setItem('s_url', scriptUrl)
    return webSiteList
  }

  try {
    const w = window.localStorage.getItem('website')
    const json = JSON.parse(w)
    if (Array.isArray(json)) {
      webSiteList = json
    }
  } catch {}

  return webSiteList
}

export function setWebsiteList(v?: INavProps[]) {
  v = v || websiteList

  window.localStorage.setItem('website', JSON.stringify(v))
}

export function toggleCollapseAll(wsList?: INavProps[]): boolean {
  wsList = wsList || websiteList

  const { page, id } = queryString()
  const collapsed = !websiteList[page].nav[id].collapsed

  websiteList[page].nav[id].collapsed = collapsed

  websiteList[page].nav[id].nav.map(item => {
    item.collapsed = collapsed
    return item
  })

  setWebsiteList(websiteList)

  return collapsed
}

export function setLocation() {
  const { page, id } = queryString()

  window.localStorage.setItem('location', JSON.stringify({
    page,
    id
  }))
}

export function getDefaultSearchEngine(): ISearchEngineProps {
  let DEFAULT = (searchEngineList[0] || {}) as ISearchEngineProps
  try {
    const engine = window.localStorage.getItem('engine');
    if (engine) {
      DEFAULT = JSON.parse(engine)
    }
  } catch {}
  return DEFAULT
}

export function setDefaultSearchEngine(engine: ISearchEngineProps) {
  window.localStorage.setItem('engine', JSON.stringify(engine))
}

export function isDark(): boolean {
  const storageVal = window.localStorage.getItem('IS_DARK')
  const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches

  if (!storageVal && darkMode) {
    return darkMode
  }

  return Boolean(Number(storageVal))
}

export async function getLogoUrl(url: string): Promise<boolean|string> {
  try {
    const c = ['/favicon.png', '/favicon.svg', '/favicon.jpg', '/favicon.ico', '/logo.png']
    const { origin } = new URL(url)

    const promises = c.map(url => {
      const iconUrl = origin + url
      return new Promise(resolve => {
        try {
          const img = document.createElement('img')
          img.src = iconUrl
          img.style.display = 'none'
          img.onload = () => {
            img.parentNode.removeChild(img)
            resolve(iconUrl)
          }
          img.onerror = () => {
            img.parentNode.removeChild(img)
            resolve(false)
          }
          document.body.append(img)
        } catch (error) {
          resolve(false)
        }
      }) 
    })

    const all = await Promise.all<any>(promises)
    for (let i = 0; i < all.length; i++) {
      if (all[i]) {
        return all[i]
      }
    }
    
  } catch {
    return null
  }
}

export function copyText(el: any, text: string): Promise<boolean> {
  const target = el.target
  const ranId = 'copy-' + randomInt(99999999)
  target.id = ranId
  target.setAttribute('data-clipboard-text', text)

  return new Promise(resolve => {
    const clipboard = new Clipboard(`#${ranId}`)
    clipboard.on('success', function() {
      clipboard?.destroy?.()
      target.removeAttribute('id')
      resolve(true)
    });
  
    clipboard.on('error', function() {
      clipboard?.destroy?.()
      target.removeAttribute('id')
      resolve(false)
    });
  })
}

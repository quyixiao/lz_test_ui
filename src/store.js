import Vue from 'vue'

export const store = Vue.observable({
  menuList: [],
  curClickMenuNum: 0,
  spaceList: [],
  spaceName: localStorage.getItem('spaceName')
})

export const mutations = {
  updateMenuList(list) {
    store.menuList = list
  },
  updateSpaceList(list) {
    store.spaceList = list
  },
  updateSpaceName(name) {
    store.spaceName = name
    localStorage.setItem('spaceName', name)
  },
  updateClickMenuNum() {
    store.curClickMenuNum++
  }
}

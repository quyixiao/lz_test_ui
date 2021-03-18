<template>
  <div class="layout-index">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        active-text-color="#333333"
        text-color="#3b73af"
        background-color="#f5f5f5"
        class="el-menu-wrap"
      >
        <sub-sidebar v-for="menu in menuList" :key="menu.id" :item="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import subSidebar from './subSidebar'
import { store } from '@/store'

export default {
  components: { subSidebar },
  computed: {
    menuList() {
      return store.menuList
    }
  }
}
</script>

<style lang="less">
.el-menu-wrap {
  padding: 90px 0 0 0;
  height: 100%;
  border-right: none;
  &.el-menu {
    border-right: none;
  }
}
.el-scrollbar {
  height: 100%;
}
</style>

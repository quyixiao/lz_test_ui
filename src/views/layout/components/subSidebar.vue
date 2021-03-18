<template>
  <div class="sidebarContent">
    <!--只有一级菜单-->
    <template v-if="!item.list || item.list.length === 0">
      <router-link :to="item.path" style="display: block; width: 100%">
        <el-menu-item
          :index="item.path"
          :class="{ 'nosubmenu-arrow': !isNest }"
          @click="handleChooseMenu(item)"
        >
          <template slot="title">
            <span slot="title">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </template>

    <!--二级菜单-->
    <el-submenu v-else :index="String(item.id)">
      <template slot="title">
        <router-link
          slot="title"
          :to="item.path"
          style="display: block; width: 100%"
        >
          <span
            style="display: block; width: 100%"
            @click="handleChooseMenu(item)"
            >{{ item.title }}</span
          >
        </router-link>
      </template>

      <template v-for="child in item.list">
        <subSidebar
          v-if="child.list && child.list.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="child.path"
          class="nest-menu"
        />
        <router-link v-else :to="child.path" :key="child.title">
          <el-menu-item :index="child.path" @click="handleChooseMenu(child)">
            <template slot="title">
              <span slot="title">{{ child.title }}</span>
            </template>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mutations } from '@/store'
export default {
  name: 'subSidebar',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 点击菜单清空缓存
    handleChooseMenu(val) {
      sessionStorage.setItem('curMenuId', val.id)
      mutations.updateClickMenuNum()
    }
  }
}
</script>

<style lang="less">
.sidebarContent {
  a {
    color: #3b73af;
    &:active,
    &:hover {
      color: #333;
    }
  }
  .router-link-exact-active.router-link-active {
    font-weight: bold;
    span {
      color: #333 !important;
    }
  }
  .el-submenu__title {
    font-size: 13px;
  }
  .el-menu-item,
  .el-submenu__title,
  .el-submenu__title .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>

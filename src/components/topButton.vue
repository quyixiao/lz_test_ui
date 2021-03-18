<template>
  <div id="top-button">
    <el-button
      v-for="(item, i) in list"
      v-show="item.isShow"
      :key="i"
      type="text"
      :icon="item.icon"
      @click="item.click"
      >{{ item.label }}</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  }
}
</script>

<style lang="less">
#top-button {
  position: absolute;
  right: 30px;
  top: 10px;
  z-index: 10;
  .el-button--text {
    color: #707070;
  }
}
</style>

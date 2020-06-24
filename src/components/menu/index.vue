<template>
  <div class="body-menu">
    <el-menu :default-active="activePath" @select="changMenu">
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">我的</span>
      </el-menu-item>
      <el-menu-item index="/tentVideo">
        <i class="el-icon-document"></i>
        <span slot="title">腾讯视频签到</span>
      </el-menu-item>
      <el-menu-item index="/netdisc">
        <i class="el-icon-setting"></i>
        <span slot="title">天翼云签到</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activePath: "/home"
    };
  },
  methods: {
    changMenu(val) {
      if (this.activePath == val) return;
      this.$router.push({ path: val });
    }
  },
  mounted() {
    this.activePath = this.$route.path;
  },
  watch: {
    $route(val) {
      this.activePath = val.path;
    }
  }
};
</script>
<style scoped lang="scss">
.body-menu {
  .is-active {
    background: #ecf5ff;
  }
}
</style>
<template>
  <div class="vw-100 vh-100">
    <el-container>
      <!-- 左侧(菜单) -->
      <el-aside width="180px" class="vh-100">
        <div
          class="pt-3 border-end text-center text-uppercase fs-4"
          style="font-family: YouSheBiaoTiHei">
          <span style="color: var(--theme-color)">S</span>hao<span
            style="color: var(--theme-color)"
            >S</span
          >hop
        </div>
        <el-menu :default-active="active" router>
          <template v-for="i in userInfoStore.authMenuList">
            <!-- 多层级菜单 -->
            <el-sub-menu
              :index="'/main/' + i.path"
              v-if="i.children.length > 0">
              <!-- 一级菜单标题 -->
              <template #title>
                <FontIcon :icon="i.icon" style="font-size: 18px"></FontIcon>
                <span class="ms-2">{{ i.menuName }}</span>
              </template>
              <!-- 一级菜单内容 -->
              <el-menu-item
                v-for="j in i.children"
                :index="'/main/' + j.path"
                >{{ j.menuName }}</el-menu-item
              >
            </el-sub-menu>
            <!-- 单层级菜单 -->
            <el-menu-item :index="'/main/' + i.path" v-else>
              <FontIcon :icon="i.icon" style="font-size: 18px"></FontIcon>
              <span class="ms-2">{{ i.menuName }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header>
          <div class="w-100 h-100 d-flex align-items-center">
            <!-- 历史路由 -->
            <div class="flex-grow-1 bg-danger">1</div>
            <!-- 右侧控件 -->
            <div class="flex-shrink-0 bg-warning d-flex align-items-center">
              <!-- 退出登录 -->
              <div @click="logoutFun">退出登录</div>
              <!-- 暗色/亮色 -->
              <darkThemeSwitch />
            </div>
          </div>
        </el-header>
        <!-- 右侧内容 -->
        <el-main class="border border-danger">
          中间
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
  import router from "../router";
  import { useUserInfoStore } from "../stores/userInfo";
  import { logout } from "../api/logout";
  import { ElMessage } from "element-plus";
  import { ref } from "vue";

  // 页面渲染所需数据------------------------
  let userInfoStore = useUserInfoStore();

  // 自动调整左侧路由激活项为当前页面url(将el-menu设置为router模式)-------------
  let active = ref(window.location.pathname);
  //点击退出登录-------------------------------
  let logoutFun = async () => {
    let logoutResult = await logout();
    if (logoutResult.code == 200) {
      ElMessage.success("退出成功");
      localStorage.removeItem("token");
      router.replace({ name: "login" });
    } else ElMessage.success("网络异常");
  };
</script>

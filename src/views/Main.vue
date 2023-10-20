<template>
  <div class="vw-100 vh-100">
    <el-container>
      <el-aside width="180px" class="vh-100">
        <div
          class="pt-3 border-end text-center text-uppercase fs-4"
          style="font-family: YouSheBiaoTiHei">
          <span style="color">S</span>hao<span>S</span>hop
        </div>
        <el-menu
          :default-active="userInfoStore.authMenuList[0].children[0].path"
          :default-openeds="[userInfoStore.authMenuList[0].path]"
          @select="selectMenu">
          <!-- <el-menu router> -->
          <template v-for="i in userInfoStore.authMenuList">
            <!-- 多层级菜单 -->
            <el-sub-menu :index="i.menuName" v-if="i.children.length > 0">
              <!-- 一级菜单标题 -->
              <template #title>
                <FontIcon :icon="i.icon" style="font-size: 18px"></FontIcon>
                <span class="ms-2">{{ i.menuName }}</span>
              </template>
              <!-- 一级菜单内容 -->
              <el-menu-item v-for="j in i.children" :index="j.menuName">{{
                j.menuName
              }}</el-menu-item>
            </el-sub-menu>
            <!-- 单层级菜单 -->
            <el-menu-item :index="i.menuName" v-else>
              <FontIcon :icon="i.icon" style="font-size: 18px"></FontIcon>
              <span class="ms-2">{{ i.menuName }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
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
  let userInfoStore = useUserInfoStore();
  // console.log(authMenuList.value);
  let selectMenu = (
    index: string,
    indexPath: object,
    item: { index: string }
  ) => {
    // index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项, routeResult: vue-router 的返回值（如果 router 为 true）
    console.log(`即将跳转菜单=>'${index}',`, indexPath, item);
    router.push({ name: index });
  };
</script>

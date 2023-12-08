<template>
  <el-container>
    <!-- 左侧(菜单) -->
    <el-aside width="180px" class="d-flex flex-column">
      <div
        class="flex-shrink-0 pt-3 border-end text-center text-uppercase fs-4"
        style="font-family: YouSheBiaoTiHei">
        <span style="color: var(--bs-ShaoShop)">S</span>hao<span
          style="color: var(--bs-ShaoShop)"
          >S</span
        >hop
      </div>
      <el-menu
        :default-active="active"
        router
        @select="menuSelect"
        class="overflow-scroll">
        <template v-for="i in userInfoStore.authMenuList">
          <!-- 多层级菜单 -->
          <el-sub-menu :index="'/main/' + i.path" v-if="i.children.length > 0">
            <!-- 一级菜单标题 -->
            <template #title>
              <FontIcon :icon="i.icon" style="font-size: 18px"></FontIcon>
              <span class="ms-2">{{ i.menuName }}</span>
            </template>
            <!-- 一级菜单内容 -->
            <el-menu-item v-for="j in i.children" :index="'/main/' + j.path">{{
              j.menuName
            }}</el-menu-item>
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
          <div
            class="position-relative flex-grow-1 me-3 overflow-x-hidden"
            style="padding: 7px 0">
            <!-- BS滚动条会自动附着在最近的相对定位父元素，为了避免BS滚动条覆盖历史路由item，外面套一层 -->
            <div
              ref="historicalNavigationScroll"
              class="scroll-wrapper"
              style="white-space: nowrap">
              <!-- 横向滚动必须要内容元素为inline -->
              <div
                class="scroll-content d-inline-flex"
                style="
                  min-width: calc(100% + 1px) !important;
                  padding: 0 1px !important;
                ">
                <div
                  v-for="(
                    i, index
                  ) in historicalNavigationStore.historicalNavigation"
                  :key="i.path"
                  role="button"
                  class="historicalNavigation border rounded-top p-1 d-flex align-items-center position-relative text-nowrap"
                  :class="[
                    {
                      'me-2':
                        index <
                        historicalNavigationStore.historicalNavigation.length -
                          1,
                      active: active == i.path,
                    },
                    'Btn-' + i.path.replace('/main/', ''),
                  ]"
                  @click="historicalNavigationClick($event, i)">
                  <div>{{ i.name }}</div>
                  <!-- 历史路由关闭按钮 -->
                  <div
                    class="historicalNavigationClose position-absolute end-0">
                    <FontIcon icon="bi bi-x fs-5"></FontIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧控件 -->
          <div class="flex-shrink-0 d-flex align-items-center">
            <!-- 用户 -->
            <el-dropdown>
              <div class="d-flex align-items-center me-3">
                <el-avatar
                  :size="38"
                  shape="square"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <div class="ms-1">Admin</div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logoutFun">
                    <span class="me-1">退出登录</span>
                    <FontIcon
                      icon="fa-solid fa-arrow-right-from-bracket"></FontIcon>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- 暗色/亮色 -->
            <darkThemeSwitch />
          </div>
        </div>
      </el-header>
      <!-- 右侧内容 -->
      <el-main class="p-0 overflow-hidden position-relative bg-body-secondary">
        <router-view v-slot="{ Component }">
          <transition name="slide-right" mode="out-in">
            <!-- <transition name="slide-right"> -->
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
  import router from "../router";
  import { useUserInfoStore } from "../stores/userInfo";
  import { useHistoricalNavigationStore } from "../stores/historicalNavigation";
  import { logout } from "../api/logout";
  import { ElMessage } from "element-plus";
  import { nextTick, onMounted, ref } from "vue";
  import BScroll from "@better-scroll/core"; //bs核心
  import MouseWheel from "@better-scroll/mouse-wheel"; //引入鼠标滚动插件
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条插件
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //betterscroll的TS类型

  // better scroll----------------------
  const historicalNavigationScroll = ref();
  let bs: BScrollConstructor<{}> | null = null;
  BScroll.use(MouseWheel);
  BScroll.use(ScrollBar);
  onMounted(() => {
    bs = new BScroll(historicalNavigationScroll.value, {
      scrollX: true,
      mouseWheel: true,
      // probeType: 3, // listening scroll event
      scrollbar: {
        fade: true,
        interactive: true,
      },
    });
  });
  // 页面加载时就检查历史路由导航条是否存在当前路由,若不存在则表明是首次进入页面,需添加进顶部历史路由导航条
  const historicalNavigationStore = useHistoricalNavigationStore();
  const routerList = router.getRoutes();
  let hasThisRouter = historicalNavigationStore.historicalNavigation.some(
    (i) => i.path == window.location.pathname
  );
  if (!hasThisRouter) {
    let routerItem = routerList.find((i) => i.path == window.location.pathname);
    historicalNavigationStore.historicalNavigation.push({
      name: routerItem!.name,
      path: routerItem!.path,
    });
  }
  // 页面渲染所需数据------------------------
  let userInfoStore = useUserInfoStore();
  /* history.replaceState和pushState不会触发popstate事件
那么如何监听这两个行为呢。可以通过在方法里面主动的去触发popstate事件。另一种就是在方法中创建一个新的全局事件
https://segmentfault.com/a/1190000022822185 */
  const _historyWrap = function (type: any) {
    const orig = history[type];
    const e = new Event(type) as any;
    return function () {
      const rv = orig.apply(this, arguments);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.replaceState = _historyWrap("replaceState");
  window.addEventListener("replaceState", (e: any) => {
    // console.log("change replaceState", e);
    active.value = e.arguments[0].forward;
  });

  // 自动调整左侧路由激活项为当前页面url(将el-menu设置为router模式)-------------
  let active = ref(window.location.pathname);
  /* 菜单点击回调
  (index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项, routeResult: vue-router 的返回值（如果 router 为 true）) */
  let menuSelect = async (index: string) => {
    let routerItem = routerList.find((i) => i.path == index);
    if (
      !historicalNavigationStore.historicalNavigation.some(
        (i) => i.path == index
      )
    ) {
      historicalNavigationStore.historicalNavigation.push({
        name: routerItem!.name,
        path: routerItem!.path,
      });
    }
    await nextTick();
    bs?.refresh();
    bs?.scrollToElement(".Btn-" + index.replace("/main/", ""), 500, true, true);
  };

  // 历史路由点击事件----------------------
  let historicalNavigationClick = async (
    e: MouseEvent,
    item: { path: string }
  ) => {
    // 如果点击了关闭按钮,就删除并且跳转第一个，同时重新实例化BS
    if (
      /.*bi-x.*/.test((e.target as HTMLElement).className) ||
      /.*historicalNavigationClose.*/.test((e.target as HTMLElement).className)
    ) {
      historicalNavigationStore.historicalNavigation =
        historicalNavigationStore.historicalNavigation.filter(
          (i) => i.path != item.path
        );
      // 如果关闭的是当前路由，
      if (active.value == item.path) {
        // 判断路由是否只剩一个
        if (historicalNavigationStore.historicalNavigation.length == 1) {
          router.push({ path: "/main" });
        } else {
          // 跳转至第一个路由
          router.push({
            path: historicalNavigationStore.historicalNavigation[0].path,
          });
        }
      }
      await nextTick();
      bs?.refresh(); //同时重新实例化BS
      // console.log(item.path, active.value);
    }
    // 点击的不是关闭按钮,就跳转点击项
    else {
      router.push({ path: item.path });
    }
  };

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

<style lang="scss">
  .historicalNavigation {
    transition: all 0.5s;
    &::after {
      display: block;
      content: "";
      width: 0%;
      position: absolute;
      height: 3px;
      left: 0;
      bottom: 0;
      background-color: var(--bs-ShaoShop);
      transition: all 0.5s;
    }
    &:hover,
    &.active {
      padding-right: 1.25rem !important;
      &::after {
        width: 100%;
      }
      .historicalNavigationClose {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
  .historicalNavigationClose {
    transform: scale(0);
    opacity: 0.2;
    transition: all 0.5s;
    &:hover {
      color: var(--bs-ShaoShop);
      transform: scale(1.1) rotate(90deg) !important;
    }
  }
  .custom-horizontal-scrollbar {
    position: absolute;
    left: 0%;
    bottom: 0px;
    width: 100%;
    height: 7px;
    border-radius: 6px;
    transform: translateZ(0);
    background-color: rgb(200, 200, 200, 0.3);
  }
  .custom-horizontal-indicator {
    height: 100%;
    // width: 20px;
    border-radius: 6px;
    background-color: #db8090;
  }
</style>

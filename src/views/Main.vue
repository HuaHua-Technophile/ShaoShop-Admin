<template>
  <el-container class="vw-100 vh-100 overflow-x-hidden">
    <!-- 左侧(菜单) -->
    <el-aside width="150px" class="d-flex flex-column">
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
      <el-header class="px-0 px-sm-1 px-md-2 px-lg-3">
        <div class="w-100 h-100 d-flex align-items-center">
          <!-- 历史路由 -->
          <div
            class="position-relative flex-grow-1 me-0 me-sm-1 me-md-2 me-lg-3 overflow-x-hidden"
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
                      'me-0 me-md-1 me-lg-2':
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
            <!-- 站内信未读消息数量 -->
            <routerLink
              to="/main/SystemMessage"
              class="text-decoration-none text-body me-2 me-md-3 me-lg-4">
              <el-badge
                :value="unReadMessage"
                :type="unReadMessage == 0 ? 'info' : 'danger'">
                <fontIcon icon="fa-regular fa-bell fs-4"></fontIcon>
              </el-badge>
            </routerLink>
            <!-- 用户退出登录 -->
            <el-dropdown>
              <div
                class="d-flex align-items-center me-0 me-sm-1 me-md-2 me-lg-3">
                <el-avatar
                  :size="38"
                  shape="square"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <div class="ms-1">{{ userInfoStore.userName }}</div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showUserInfo">
                    <span class="me-1">个人信息</span>
                  </el-dropdown-item>
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
            <!-- <transition
              
            appear
            enter-active-class="animate__animated animate__fadeInLeft animate__faster"
            leave-active-class="animate__animated animate__fadeOutRight animate__faster"
            mode="out-in"> -->
            <!-- <transition name="slide-right"> -->
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- 个人信息 -->
  <el-drawer
    v-model="drawerVisible"
    direction="rtl"
    class="rounded-start-5 bg-body 个人信息"
    :before-close="closeDrawerFun">
    <template #header>
      <h2 class="text-body">账号信息</h2>
    </template>
    <el-form
      ref="personalInfoFormRef"
      :model="EPersonalInfoFrom"
      :rules="EPersonalInfoRules">
      <el-form-item
        label="用户账号"
        prop="userName"
        style="padding-left: 10.18px">
        {{ EPersonalInfoFrom.userName || "暂无" }}
      </el-form-item>
      <el-form-item
        label="注册时间"
        prop="createTime"
        style="padding-left: 10.18px">
        {{ EPersonalInfoFrom.createTime || "暂无" }}
      </el-form-item>
      <el-form-item
        label="绑定商户"
        prop="businessId"
        style="padding-left: 10.18px">
        {{ EPersonalInfoFrom.businessId || "暂无" }}
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName" class="overflow-hidden">
        <Transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutUp">
          <el-input
            clearable
            maxlength="12"
            v-model="EPersonalInfoFrom.nickName"
            placeholder="用户昵称"
            :prefix-icon="renderFontIcon('bi bi-people')"
            v-if="isEditPersonalInfo" />
          <span style="padding-bottom: 2px" v-else>{{
            EPersonalInfoFrom.nickName || "暂无"
          }}</span>
        </Transition>
      </el-form-item>
      <el-form-item label="绑定电话" prop="phoneNumber" class="overflow-hidden">
        <Transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutUp">
          <el-input
            clearable
            maxlength="11"
            v-model="EPersonalInfoFrom.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')"
            v-if="isEditPersonalInfo" />
          <span style="padding-bottom: 2px" v-else>{{
            EPersonalInfoFrom.phoneNumber || "暂无"
          }}</span>
        </Transition>
      </el-form-item>
      <el-form-item label="绑定邮箱" prop="email" class="overflow-hidden">
        <Transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutUp">
          <el-input
            clearable
            maxlength="20"
            v-model="EPersonalInfoFrom.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')"
            v-if="isEditPersonalInfo" />
          <span style="padding-bottom: 2px" v-else>{{
            EPersonalInfoFrom.email || "暂无"
          }}</span>
        </Transition>
      </el-form-item>
    </el-form>
    <!-- 密码 -->
    <Transition
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutRight">
      <el-form
        ref="EPasswordFormRef"
        :model="EPasswordForm"
        :rules="EPasswordRules"
        v-if="isEditPassword">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            clearable
            maxlength="16"
            v-model="EPasswordForm.oldPassword"
            placeholder="当前旧密码"
            :prefix-icon="renderFontIcon('fa-solid fa-key')" />
        </el-form-item>
        <el-form-item label="新的密码" prop="newPassword">
          <el-input
            clearable
            maxlength="16"
            v-model="EPasswordForm.newPassword"
            placeholder="新的密码(6~16位,不能含有中文与空格)"
            :prefix-icon="renderFontIcon('fa-solid fa-unlock')" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            clearable
            maxlength="16"
            v-model="EPasswordForm.confirmPassword"
            placeholder="请再次输入新的密码(6~16位,不能含有中文与空格)"
            :prefix-icon="renderFontIcon('fa-solid fa-lock')" />
        </el-form-item>
      </el-form>
    </Transition>
    <template #footer>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <Transition
            mode="out-in"
            enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutUp">
            <Transition
              v-if="isEditPersonalInfo"
              mode="out-in"
              enter-active-class="animate__animated animate__fadeInUp"
              leave-active-class="animate__animated animate__fadeOutUp">
              <el-button @click="cencelEdit" :loading="loading"
                >取消修改</el-button
              >
            </Transition>
            <Transition
              v-else
              mode="out-in"
              enter-active-class="animate__animated animate__fadeInUp"
              leave-active-class="animate__animated animate__fadeOutUp">
              <el-button @click="EPasswordFun" v-if="isEditPassword"
                >确认修改</el-button
              >
              <el-button @click="toEditPassword" v-else>修改密码</el-button>
            </Transition>
          </Transition>
        </div>
        <div>
          <Transition
            mode="out-in"
            enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutUp">
            <Transition
              v-if="isEditPassword"
              mode="out-in"
              enter-active-class="animate__animated animate__fadeInUp"
              leave-active-class="animate__animated animate__fadeOutUp">
              <el-button @click="cencelEdit" :loading="loading"
                >取消修改</el-button
              >
            </Transition>
            <Transition
              v-else
              mode="out-in"
              enter-active-class="animate__animated animate__fadeInUp"
              leave-active-class="animate__animated animate__fadeOutUp">
              <el-button
                @click="savePersonalInfo"
                v-if="isEditPersonalInfo"
                :loading="loading"
                >确认保存修改</el-button
              >
              <el-button @click="toEditUserInfo" v-else>修改个人信息</el-button>
            </Transition>
          </Transition>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import router from "@/router/index";
  import { useUserInfoStore } from "@/stores/userInfo";
  import { useHistoricalNavigationStore } from "@/stores/historicalNavigation";
  import { logout } from "@/api/logout";
  import { getUnReadMessage } from "@/api/SystemMessageAPI";
  import {
    getUserInfo,
    updateUserInfo,
    updateUserPassword,
  } from "@/api/UserManagementAPI";
  import { userType } from "@/type";
  import { reLogIn } from "@/utils/reLogIn/reLogIn";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import {
    phoneNumberValidator,
    emailValidator,
    passwordValidator,
  } from "@/utils/elFromValidator/elFromValidator";
  import { ElMessage, FormInstance } from "element-plus";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core"; //bs核心
  import MouseWheel from "@better-scroll/mouse-wheel"; //引入鼠标滚动插件
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条插件
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //betterscroll的TS类型
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";

  // better scroll----------------------
  const historicalNavigationScroll = ref();
  let bs: BScrollConstructor<{}>;
  BScroll.use(MouseWheel);
  BScroll.use(ScrollBar);
  BScroll.use(ObserveDOM);
  onMounted(() => {
    bs = new BScroll(historicalNavigationScroll.value, {
      scrollX: true,
      mouseWheel: true,
      // probeType: 3, // listening scroll event
      scrollbar: {
        fade: true,
        interactive: true,
      },
      observeDOM: true,
    });
  });

  // 页面加载时就检查历史路由导航条是否存在当前路由,若不存在则表明是首次进入页面,需添加进顶部历史路由导航条
  const historicalNavigationStore = useHistoricalNavigationStore();
  const routerList = router.getRoutes();
  const hasThisRouter = historicalNavigationStore.historicalNavigation.some(
    (i) => i.path == window.location.pathname
  );
  console.log("历史路由中存在当前windowPath", hasThisRouter);
  if (!hasThisRouter) {
    const routerItem = routerList.find(
      (i) => i.path == window.location.pathname
    );
    historicalNavigationStore.historicalNavigation.push({
      name: routerItem!.name,
      path: routerItem!.path,
    });
  }
  // 页面渲染所需数据(左侧菜单、站内未读消息数量)----------------
  const userInfoStore = useUserInfoStore();
  const unReadMessage = ref(0);
  const getUnReadMessageFun = async () => {
    const res = await getUnReadMessage();
    console.log(`未读系统消息${res.data}条`);
    unReadMessage.value = res.data;
  };
  getUnReadMessageFun();
  // 自动调整左侧路由激活项为当前页面url(将el-menu设置为router模式)-------------
  const active = ref(window.location.pathname);
  /* history.replaceState和pushState不会触发popstate事件
      那么如何监听这两个行为呢。可以通过在方法里面主动的去触发popstate事件。另一种就是在方法中创建一个新的全局事件
      https://segmentfault.com/a/1190000022822185 */
  const _historyWrap = (type: keyof History) => {
    const orig = history[type];
    const e = new Event(type) as any;
    return function (this: History) {
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
  const menuSelect = async (index: string) => {
    /* 菜单点击回调(index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项, routeResult: vue-router 的返回值（如果 router 为 true）) */
    const routerItem = routerList.find((i) => i.path == index);
    // 如果不在历史路由里就加进去
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
    bs?.scrollToElement(".Btn-" + index.replace("/main/", ""), 500, true, true);
  };

  // 历史路由点击事件----------------------
  const historicalNavigationClick = async (
    e: MouseEvent,
    item: { path: string }
  ) => {
    // 如果点击了关闭按钮,就删除并且跳转第一个,同时重新实例化BS
    if (
      /.*bi-x.*/.test((e.target as HTMLElement).className) ||
      /.*historicalNavigationClose.*/.test((e.target as HTMLElement).className)
    ) {
      historicalNavigationStore.historicalNavigation =
        historicalNavigationStore.historicalNavigation.filter(
          (i) => i.path != item.path
        );
      // 如果关闭的是当前路由,
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
      // console.log(item.path, active.value);
    }
    // 点击的不是关闭按钮,就跳转点击项
    else {
      router.push({ path: item.path });
    }
  };

  //点击退出登录-------------------------------
  const logoutFun = async () => {
    const res = await logout();
    if (res.code == 200) reLogIn(res.message);
  };

  // 个人信息----------------------
  const drawerVisible = ref(false);
  const closeDrawerFun = (done: () => void) => {
    if (isEditPersonalInfo.value)
      elMessageBoxConfirm(`放弃修改个人信息`, () => {
        done();
        ElMessage.info(`放弃放弃修改个人信息`);
        isEditPersonalInfo.value = false;
      });
    else if (isEditPassword.value)
      elMessageBoxConfirm(`放弃修改密码`, () => {
        done();
        ElMessage.info(`放弃修改密码`);
        isEditPassword.value = false;
        EPasswordFormRef.value!.clearValidate();
        EPasswordFormRef.value!.resetFields();
      });
    else done();
  };
  let EPersonalInfoFrom = reactive<userType>({
    businessId: undefined,
    createTime: "",
    nickName: "",
    phoneNumber: "",
    roleName: [],
    email: "",
  });
  const EPersonalInfoRules = reactive({
    email: [
      { required: true, message: "请输入绑定邮箱", trigger: "blur" },
      { validator: emailValidator, trigger: "blur" },
    ],
    phoneNumber: [
      { required: true, message: "请输入绑定手机号", trigger: "blur" },
      { validator: phoneNumberValidator, trigger: "blur" },
    ],
    nickName: [
      {
        required: true,
        message: "请输入部门主体名称(账号名称)",
        trigger: "blur",
      },
    ],
  });
  const personalInfoFormRef = ref<FormInstance>();
  const isEditPersonalInfo = ref(false);
  const loading = ref(false);
  const showUserInfo = async () => {
    const res = await getUserInfo();
    console.log("个人信息=>", res.data);
    if (res.code == 200) {
      drawerVisible.value = true;
      EPersonalInfoFrom = reactive(res.data);
    }
  };
  const cencelEdit = () => {
    isEditPersonalInfo.value = isEditPassword.value = false;
    EPasswordFormRef.value?.clearValidate();
    EPasswordFormRef.value?.resetFields();
  };
  const toEditUserInfo = () => {
    isEditPersonalInfo.value = true;
  };
  const savePersonalInfo = () => {
    personalInfoFormRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res = await updateUserInfo(EPersonalInfoFrom);
        if (res.code === 200) {
          ElMessage.success("修改成功");
          showUserInfo();
          isEditPersonalInfo.value = false;
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  // 修改密码---------------
  const EPasswordForm = reactive({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const EPasswordFormRef = ref<FormInstance>();
  const EPasswordRules = reactive({
    oldPassword: [
      { required: true, message: "请输入旧密码", trigger: "blur" },
      { validator: passwordValidator, trigger: "blur" },
    ],
    newPassword: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      { validator: passwordValidator, trigger: "blur" },
    ],
    confirmPassword: [
      { required: true, message: "请重复输入新密码", trigger: "blur" },
      {
        validator: (
          rule: any,
          value: string,
          callback: (arg0?: Error) => void
        ) => {
          rule;
          if (value == EPasswordForm.newPassword) callback();
          else callback(new Error("两次输入密码不一致!"));
        },
        trigger: "blur",
      },
    ],
  });
  const isEditPassword = ref(false);
  const toEditPassword = () => {
    isEditPassword.value = true;
  };
  const EPasswordFun = () => {
    EPasswordFormRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res = await updateUserPassword(EPasswordForm);
        if (res.code === 200) {
          isEditPassword.value = false;
          reLogIn("修改成功,请重新登录");
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };
</script>
<style lang="scss">
  //顶部历史路由
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
      color: var(--theme-color);
      transform: scale(1.1) rotate(90deg) !important;
    }
  }
  .个人信息 {
    --animate-duration: 350ms;
  }
  /* .custom-horizontal-scrollbar {
    position: absolute;
    left: 0%;
    bottom: 0px;
    width: 100%;
    height: 7px;
    border-radius: 6px;
    transform: translateZ(0);
    background-color: rgb(255, 0, 0, 1);
  }
  .custom-horizontal-indicator {
    height: 100%;
    // width: 20px;
    border-radius: 6px;
    background-color: #db8090;
  } */
</style>

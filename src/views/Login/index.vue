<template>
  <!-- 右上角主题切换按钮 -->
  <div class="position-absolute top-0 end-0 mt-3 me-3">
    <darkThemeSwitch />
  </div>
  <div class="container vh-100 d-flex align-items-center">
    <div class="row w-100 justify-content-center">
      <div class="col-10 d-flex align-items-center">
        <!-- 随机的登录页图片 -->
        <div class="fs-1 flex-grow-1" v-html="loginSvg"></div>
        <!-- 右侧登录表单 -->
        <div class="flex-shrink-0 ms-5">
          <div class="text-uppercase text-center fs-1 fw-bold">ShaoShop</div>
          <el-form
            :model="loginForm"
            size="large"
            ref="ruleFormRef"
            :rules="rules"
            style="width: 300px">
            <el-form-item prop="userName">
              <el-input
                v-model="loginForm.userName"
                maxlength="12"
                placeholder="账号"
                clearable
                @keydown="enterLogin"
                :prefix-icon="renderFontIcon('bi bi-person')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                maxlength="16"
                placeholder="密码"
                clearable
                show-password
                @keydown="enterLogin"
                :prefix-icon="renderFontIcon('bi  bi-shield-lock')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="w-100"
                @click="loginFun(ruleFormRef!)"
                :loading="waitLogin">
                <span class="me-2">登录</span>
                <FontIcon icon="fa-solid fa-arrow-right-to-bracket"></FontIcon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { login, getImage, getAuthMenuList } from "@/api/login";
  import { addMenuRouter } from "@/utils/addMenuRouter/addMenuRouter";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { ElMessage } from "element-plus";
  import type { FormInstance } from "element-plus";
  import { useUserInfoStore } from "@/stores/userInfo";
  import { loginFormType } from "@/type";
  import router from "@/router";
  import { passwordValidator } from "@/utils/elFromValidator/elFromValidator";

  // 获取登录图片--------------------------------
  let loginSvg = ref();
  let getImageFun = async () => {
    let svgFixedSize = (await getImage()) + "";
    let FixedSize = svgFixedSize.slice(
      svgFixedSize.indexOf("width"),
      svgFixedSize.indexOf("viewBox")
    );
    loginSvg.value = svgFixedSize.replace(FixedSize, "");
  };
  getImageFun();

  // 登录信息表单---------------------------------
  const ruleFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const loginForm = reactive<loginFormType>({
    userName: "test",
    password: "123456",
  });
  const rules = reactive({
    userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        validator: passwordValidator,
        trigger: "blur",
      },
    ],
  });
  let waitLogin = ref(false); //是否处于等待登陆状态

  // 表单提交前验证,验证不通过不发送请求-----------------
  const userInfoStore = useUserInfoStore();

  const loginFun = async (formEl: FormInstance) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitLogin.value = true;
        let loginRes = await login({
          userName: loginForm.userName,
          password: loginForm.password,
        });
        console.log("Login返回数据=>", loginRes);
        waitLogin.value = false;
        if (loginRes.code == 200) {
          localStorage.setItem("token", loginRes.data.authentication); //token放入本地存储
          userInfoStore.userName = loginRes.data.username;
          userInfoStore.userId = loginRes.data.userId; //userName和Id存入pinia跨组件通讯
          let res = await getAuthMenuList();
          console.log(`${loginRes.data.username}用户的路由列表=>`, res);
          if (res.code == 200 && res.data.length > 0) {
            let { firstRoute, removeRouterArr } = addMenuRouter(res.data);
            userInfoStore.authMenuList = res.data; //赋值进入pinia
            userInfoStore.removeRouterArr = removeRouterArr; //将所有动态路由暂存,在退出登录时清除动态路由
            router.replace(firstRoute);
          } else if (!(res.data.length > 0))
            ElMessage.error("该用户无权限路由，请核查是否授予相应角色");
        } else ElMessage.error(loginRes.message);
      } else console.log("error submit!", fields);
    });
  };

  // 回车登录
  const enterLogin = (e: KeyboardEvent) => {
    if (e.key === "Enter") loginFun(ruleFormRef.value!);
    // 处理回车事件
  };
</script>
@/utils/addMenuRouter/addMenuRouter2

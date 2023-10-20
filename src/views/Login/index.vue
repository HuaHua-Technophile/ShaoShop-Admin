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
            :model="form"
            size="large"
            ref="ruleFormRef"
            :rules="rules"
            style="width: 300px">
            <el-form-item prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="账号"
                clearable
                :prefix-icon="renderFontIcon('bi bi-person')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                placeholder="账号"
                clearable
                show-password
                :prefix-icon="
                  renderFontIcon('bi bi bi-shield-lock')
                "></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="w-100"
                @click="submitForm(ruleFormRef)"
                :loading="waitLogin"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { login, getImage, getAuthMenuList } from "../../api/login";
  import { useTokenStore } from "../../stores/token";
  import { useUserInfoStore } from "../../stores/userInfo";
  import { renderFontIcon } from "../../utils/fontIcon/renderFontIcon";
  import { ElMessage } from "element-plus";
  import type { FormInstance } from "element-plus";
  import router from "../../router";
  // import { authMenuListType } from "../../type/index";
  // 获取登录图片-------------------------------------------------------
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
  // 信息输入--------------------------------------------------------
  const ruleFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const form = reactive({
    userName: "admin",
    password: "123456",
  });
  // 表单验证规则
  const rules = reactive({
    userName: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, max: 12, message: "密码为6~12位", trigger: "blur" },
      {
        validator: (rule: any, value: any, callback: any) => {
          rule; //不用一下会提示报错,看着红色就烦
          if (!/^[^\u4e00-\u9fa5 ]{6,16}$/.test(value)) {
            callback(new Error("不能含有中文与空格"));
          } else callback();
        },
        trigger: "blur",
      },
    ],
  });
  // 表单提交前验证,验证不通过不发送请求
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        getLoginInfo();
      } else console.log("error submit!", fields);
    });
  };
  // 登录--------------------------------------------------------
  let waitLogin = ref(false);
  let tokenStore = useTokenStore();
  let userInfoStore = useUserInfoStore();
  let getLoginInfo = async () => {
    waitLogin.value = true;
    let loginInfo = await login({
      userName: form.userName,
      password: form.password,
    });
    console.log("getLoginInfo获取到了登陆数据=>", loginInfo);
    if (loginInfo.data) {
      tokenStore.token = loginInfo.data?.authentication;
      let authMenuList = await getAuthMenuList();
      userInfoStore.isLogged = true;
      userInfoStore.authMenuList = authMenuList.data;
      console.log("getAuthMenuList获取到了用户菜单=>", authMenuList.data);
      waitLogin.value = false;
      if (authMenuList.data) {
        authMenuList.data.forEach(
          (i: { children: any[]; path: string; menuName: string }) => {
            // 如果有子菜单说明是个空壳二级菜单,需要遍历子菜单添加路由
            if (i.children.length > 0) {
              i.children.forEach((j) => {
                router.addRoute("main", {
                  path: `${j.path}`,
                  name: j.path,
                  component: () => {
                    import(`../${j.path}/index.vue`);
                  },
                });
              });
            }
            // 否则是个一级菜单,直接添加路由
            else {
              router.addRoute("main", {
                path: `${i.path}`,
                name: i.path,
                component: () => import(`../${i.path}/index.vue`),
              });
            }
          }
        );
        ElMessage.success("登陆成功");
        router.push({ path: "/main" });
        console.log("所有路由=》", router.getRoutes());
      } else ElMessage.error(authMenuList.message);
    } else ElMessage.error(loginInfo.message);
  };
</script>

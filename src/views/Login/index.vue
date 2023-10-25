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
  import { login, getImage } from "../../api/login";
  import { addMenuRouter } from "../../utils/addMenuRouter/addMenuRouter";
  import { renderFontIcon } from "../../utils/fontIcon/renderFontIcon";
  // import { useRouter } from "vue-router";
  import { ElMessage } from "element-plus";
  import type { FormInstance } from "element-plus";
  // const router = useRouter();
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
  let getLoginInfo = async () => {
    waitLogin.value = true;
    let loginInfo = await login({
      userName: form.userName,
      password: form.password,
    });
    console.log("getLoginInfo获取到了登陆数据=>", loginInfo);
    if (loginInfo.data) {
      localStorage.setItem("token", loginInfo.data?.authentication);
      // 固定写死登陆后首屏的模块
      addMenuRouter({ path: "/main/UserManagement" });
    } else ElMessage.error(loginInfo.message);
  };
</script>

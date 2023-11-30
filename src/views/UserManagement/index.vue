<template>
  <div class="w-100 h-100">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="rules"
      class="d-flex flex-nowrap align-items-center justify-content-around px-3">
      <el-form-item
        label="商户名称"
        prop="companyName"
        class="flex-grow-1 noLabelPadding">
        <el-input
          clearable
          v-model="form.companyName"
          placeholder="每商户唯一名称"
          :prefix-icon="renderFontIcon('bi bi-shop-window')"
          style="min-width: 100px">
        </el-input>
      </el-form-item>
      <el-form-item
        label="用户账号"
        prop="userName"
        class="flex-grow-1 noLabelPadding">
        <el-input
          clearable
          v-model="form.userName"
          placeholder="每个后台主体唯一ID"
          :prefix-icon="renderFontIcon('bi bi-123')"
          style="min-width: 100px">
        </el-input>
      </el-form-item>
      <el-form-item
        label="绑定邮箱"
        prop="email"
        class="flex-grow-1 noLabelPadding">
        <el-input
          clearable
          v-model="form.email"
          placeholder="每个后台主体唯一邮箱"
          :prefix-icon="renderFontIcon('bi bi-envelope')"
          style="min-width: 100px">
        </el-input>
      </el-form-item>
      <el-form-item
        label="绑定电话"
        prop="phoneNumber"
        class="flex-grow-1 noLabelPadding">
        <el-input
          clearable
          v-model="form.phoneNumber"
          placeholder="每个后台主体唯一手机号"
          :prefix-icon="renderFontIcon('bi bi-telephone')"
          style="min-width: 100px">
        </el-input>
      </el-form-item>
      <el-form-item
        label="部门主体"
        prop="nickName"
        class="flex-grow-1 noLabelPadding">
        <el-input
          clearable
          v-model="form.nickName"
          placeholder="运营部/物流部/..."
          :prefix-icon="renderFontIcon('bi bi-people')"
          style="min-width: 100px">
        </el-input>
      </el-form-item>
      <el-form-item
        ><el-button :loading="waitQueryUser" @click="queryUserFun"
          >查询</el-button
        ></el-form-item
      >
      <el-form-item>
        <el-button :loading="waitAddUser" @click="addUserFun(ruleFormRef)"
          >添加账号</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 用户列表模块 -->
    <div class="w-100 h-100 bg-body-secondary p-3">
      <div class="bg-body rounded p-3">
        <!-- 数据说明顶栏 -->
        <div class="d-flex align-items-center">
          <div>用户编号</div>
        </div>
        <!-- 用户列表 -->
        <div v-for="i in allUserList" class="d-flex align-items-center">
          <div class="col-2">{{ i.companyName }}</div>
          <div class="col-2">{{ i.userName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getUserList, addUser } from "@/api/UserManagementAPI.ts";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { ElMessage, FormInstance } from "element-plus";
  import { reactive, ref } from "vue";

  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  let allUserList = ref();
  const getUserListFun = async () => {
    let res = await getUserList();
    console.log(res.data);
    allUserList.value = res.data.records;
  };
  getUserListFun();

  // 表单部分，用于查询/添加后台管理系统的用户-------------
  const ruleFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const form = reactive({
    companyName: "", //商户名称
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    password: "123456", //密码。注册时默认填入123456
  });
  // ElementPlus 表单验证规则
  const rules = reactive({
    companyName: [
      { required: true, message: "请输入商户名称", trigger: "blur" },
      { min: 0, max: 8, message: "长度在8位以内", trigger: "blur" },
    ],
    userName: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
    email: [
      { required: true, message: "请输入绑定邮箱", trigger: "blur" },
      // { min: 0, max: 12, message: "密码为6~12位", trigger: "blur" },
      {
        validator: (rule: any, value: any, callback: any) => {
          rule; //不用一下会Eslint提示报错,看着红色就烦
          if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) {
            callback(new Error("不符合邮箱规范"));
          } else callback();
        },
        trigger: "blur",
      },
    ],
    phoneNumber: [
      { required: true, message: "请输入绑定手机号", trigger: "blur" },
      { min: 0, max: 15, message: "长度在15位以内", trigger: "blur" },
      {
        validator: (rule: any, value: any, callback: any) => {
          rule; //不用一下会Eslint提示报错,看着红色就烦
          if (
            !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
              value
            )
          ) {
            callback(new Error("不符合手机号规范"));
          } else callback();
        },
        trigger: "blur",
      },
    ],
    nickName: [
      {
        required: true,
        message: "请输入部门主体名称(账号名称)",
        trigger: "blur",
      },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
  });
  let waitAddUser = ref(false);
  const addUserFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitAddUser.value = true;
        let res = await addUser(form);
        if (res.code === 200) ElMessage.success("添加成功");
        else ElMessage.error(res.message);
        waitAddUser.value = false;
      } else console.log("error submit!", fields);
    });
  };
  //查询用户-----------------------
  let waitQueryUser = ref(false);
  let queryUserFun = () => {
    waitQueryUser.value = true;
    let res = getUserList();
    console.log(res);
    allUserList.value = res;
    waitQueryUser.value = false;
  };
</script>
<style lang="scss">
  .noLabelPadding {
    &:not(:last-child) {
      margin-right: 4px !important;
    }
    label {
      padding-right: 4px !important;
    }
  }
</style>

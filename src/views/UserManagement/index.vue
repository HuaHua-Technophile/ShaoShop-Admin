<template>
  <div class="w-100 h-100">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="form"
      ref="ruleFormRef"
      class="d-flex flex-wrap align-items-center justify-content-around">
      <el-form-item label="商户名称">
        <el-input
          clearable
          v-model="form.companyName"
          placeholder="每商户唯一名称"
          :prefix-icon="renderFontIcon('bi bi-shop-window')"
          style="min-width: 100px; max-width: 175px">
        </el-input>
      </el-form-item>
      <el-form-item label="用户账号">
        <el-input
          clearable
          v-model="form.email"
          placeholder="每个后台主体唯一ID"
          :prefix-icon="renderFontIcon('bi bi-123')"
          style="min-width: 100px; max-width: 175px">
        </el-input>
      </el-form-item>
      <el-form-item label="绑定邮箱">
        <el-input
          clearable
          v-model="form.email"
          placeholder="每个后台主体唯一邮箱"
          :prefix-icon="renderFontIcon('bi bi-envelope')"
          style="min-width: 100px; max-width: 175px">
        </el-input>
      </el-form-item>
      <el-form-item label="绑定电话">
        <el-input
          clearable
          v-model="form.email"
          placeholder="每个后台主体唯一手机号"
          :prefix-icon="renderFontIcon('bi bi-telephone')"
          style="min-width: 100px; max-width: 175px">
        </el-input>
      </el-form-item>
      <el-form-item label="部门主体">
        <el-input
          clearable
          v-model="form.email"
          placeholder="运营部/物流部/..."
          :prefix-icon="renderFontIcon('bi bi-people')"
          style="min-width: 100px; max-width: 175px">
        </el-input>
      </el-form-item>
      <el-form-item><el-button>查询</el-button></el-form-item>
      <el-form-item>
        <el-button @click="addUserFun">添加账号</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户列表 -->
    <div>
      <div v-for="i in allUserList">{{ i }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getUserList, addUser } from "@/api/UserManagementAPI.ts";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { FormInstance } from "element-plus";
  import { reactive, ref } from "vue";

  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  let allUserList = ref();
  const getUserListFun = async () => {
    allUserList.value = await getUserList();
    console.log(allUserList.value);
  };
  getUserListFun();

  // 表单部分，用于查询/添加后台管理系统的用户-------------
  const ruleFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const form = reactive({
    companyName: "", //商户名称
    email: "", //绑定邮箱
    nickName: "", //部门主体名称(账号名称)
    password: 123456, //密码。注册时默认填入123456
    phoneNumber: "", //绑定手机号
    userName: "", //账号
  });
  const addUserFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        // getLoginInfo();
      } else console.log("error submit!", fields);
    });
  };
</script>

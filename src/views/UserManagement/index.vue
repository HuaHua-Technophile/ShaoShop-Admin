<template>
  <div class="w-100 h-100 overflow-hidden d-flex flex-column">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="userQueryFrom"
      ref="userQueryFromRef"
      :rules="queryRules"
      class="d-flex flex-nowrap align-items-center justify-content-around px-3">
      <el-form-item label="用户账号" prop="userName">
        <el-input
          clearable
          v-model="userInfoForm.userName"
          placeholder="每个后台主体唯一名称"
          :prefix-icon="renderFontIcon('bi bi-123')">
        </el-input>
      </el-form-item>
      <el-form-item label="绑定邮箱" prop="email">
        <el-input
          clearable
          v-model="userInfoForm.email"
          placeholder="每个后台主体唯一邮箱"
          :prefix-icon="renderFontIcon('bi bi-envelope')">
        </el-input>
      </el-form-item>
      <el-form-item label="绑定电话" prop="phoneNumber">
        <el-input
          clearable
          v-model="userInfoForm.phoneNumber"
          placeholder="每个后台主体唯一手机号"
          :prefix-icon="renderFontIcon('bi bi-telephone')">
        </el-input>
      </el-form-item>
      <el-form-item label="部门主体" prop="nickName">
        <el-input
          clearable
          v-model="userInfoForm.nickName"
          placeholder="运营部/物流部/..."
          :prefix-icon="renderFontIcon('bi bi-people')">
        </el-input>
      </el-form-item>
      <el-form-item label="帐号状态" prop="status">
        <el-select
          v-model="userInfoForm.status"
          placeholder="正常/停用"
          clearable>
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="waitQueryUser"
          @click="queryUserFun(userQueryFromRef)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 用户列表模块 -->
    <div class="flex-grow-1 overflow-hidden bg-body-secondary p-3">
      <div class="bg-body rounded px-3 py-2 w-100 h-100 d-flex flex-column">
        <!-- 数据说明顶栏 -->
        <div class="d-flex align-items-center">
          <div>用户编号</div>
          <div>
            <el-button :loading="waitAddUser" @click="addUserDialog"
              >添加账号</el-button
            >
          </div>
        </div>
        <!-- 用户列表 -->
        <div
          class="pullup-wrapper flex-grow-1 overflow-hidden position-relative"
          ref="userListDom">
          <div
            class="pullup-content"
            style="
              min-height: calc(100% + 1px) !important;
              padding: 1px 0 !important;
            ">
            <div v-for="i in allUserList" class="d-flex align-items-center">
              <div class="flex-grow-1">{{ i.userId }}</div>
              <div class="flex-grow-1">{{ i.userName }}</div>
              <div class="flex-grow-1">{{ i.email }}</div>
              <div class="flex-grow-1">{{ i.phoneNumber }}</div>
              <div class="flex-grow-1">{{ i.nickName }}</div>
              <div class="flex-grow-1">{{ i.createTime }}</div>
              <div class="flex-shrink-0">
                <fontIcon icon="bi bi-pencil-square  fs-4 me-2"></fontIcon>
              </div>
              <div class="flex-shrink-0">
                <fontIcon icon="bi bi-trash fs-4 text-danger"></fontIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="450px"
      :before-close="closeConfirm">
      <el-form :model="userInfoForm" ref="dialogFromRef" :rules="rules">
        <el-form-item label="用户账号" prop="userName">
          <el-input
            clearable
            v-model="userInfoForm.userName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
        <el-form-item label="绑定邮箱" prop="email">
          <el-input
            clearable
            v-model="userInfoForm.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')">
          </el-input>
        </el-form-item>
        <el-form-item label="绑定电话" prop="phoneNumber">
          <el-input
            clearable
            v-model="userInfoForm.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')">
          </el-input>
        </el-form-item>
        <el-form-item label="部门主体" prop="nickName">
          <el-input
            clearable
            v-model="userInfoForm.nickName"
            placeholder="运营部/物流部/..."
            :prefix-icon="renderFontIcon('bi bi-people')">
          </el-input>
        </el-form-item>
        <el-form-item label="账号密码" prop="password">
          <el-input
            clearable
            v-model="userInfoForm.password"
            placeholder="6~20位密码,不能含有中文与空格"
            :prefix-icon="renderFontIcon('bi-shield-lock')">
          </el-input>
        </el-form-item>
        <div class="d-flex justify-content-center">
          <el-button
            v-if="dialogTitle == '添加用户'"
            @click="addUserFun(dialogFromRef)"
            >确认添加</el-button
          >
          <el-button v-else>确认修改</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { getUserList, addUser } from "@/api/UserManagementAPI.ts";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
  import { onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  let allUserList = ref();
  const getUserListFun = async () => {
    let res = await getUserList();
    // console.log(res.data);
    allUserList.value = res.data.records;
  };
  getUserListFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const userListDom = ref();
  let bs = null;
  onMounted(() => {
    bs = new BScroll(userListDom.value, {
      pullUpLoad: true,
      scrollbar: true,
      mouseWheel: true,
    });
  });

  //dialog弹出框--------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("添加用户");
  const dialogCloseConfirm = ref("确认放弃当前添加用户吗?所填内容将会被清空");
  let closeConfirm = (done: () => void) => {
    ElMessageBox.confirm(dialogCloseConfirm.value, {
      confirmButtonText: "是的",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        done();
        ElMessage({
          type: "success",
          message: "确认关闭",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消关闭",
        });
      });
  };

  // 添加/修改-------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const userInfoForm = reactive({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    password: "", //密码。
  });
  const rules = reactive({
    userName: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
    email: [
      { required: true, message: "请输入绑定邮箱", trigger: "blur" },
      // { min: 0, max: 12, message: "密码为6~12位", trigger: "blur" },
      {
        validator: (rule: any, value: string, callback: Function) => {
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
      { min: 0, max: 11, message: "长度在11位以内", trigger: "blur" },
      {
        validator: (rule: any, value: string, callback: Function) => {
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
    password: [
      {
        required: true,
        message: "请输入密码",
        trigger: "blur",
      },
      { min: 6, max: 20, message: "密码长度在20位以内", trigger: "blur" },
      {
        validator: (rule: any, value: string, callback: Function) => {
          rule; //不用一下会Eslint提示报错,看着红色就烦
          if (/^[^\u4e00-\u9fa5 ]$/.test(value)) {
            callback(new Error("不能含有中文或空格"));
          } else callback();
        },
        trigger: "blur",
      },
    ],
  });

  //添加用户-------------------------------------
  let addUserDialog = () => {
    dialogVisible.value = true;
    dialogTitle.value = "添加用户";
    dialogCloseConfirm.value = "确认放弃当前添加用户吗?所填内容将会被清空";
  };
  let waitAddUser = ref(false);
  const addUserFun = async (formEl: FormInstance) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitAddUser.value = true;
        let res = await addUser(userInfoForm);
        if (res.code === 200) {
          ElMessage.success("添加成功");
          getUserListFun(); //重新请求数据进行用户列表渲染
          dialogVisible.value = false; //隐藏弹出框
          formEl.resetFields(); //重置表单
        } else ElMessage.error(res.message);
        waitAddUser.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //修改用户--------------------------------------

  //查询用户-------------------------------------
  const userQueryFrom = reactive({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "131", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    status: null, //状态
  });
  const userQueryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryRules = reactive({
    userName: [
      { min: 0, max: 12, message: "长度在12位以内", trigger: "change" },
    ],
    phoneNumber: [
      { min: 0, max: 11, message: "长度在11位以内", trigger: "change" },
    ],
    nickName: [
      { min: 0, max: 12, message: "长度在12位以内", trigger: "change" },
    ],
  });
  const waitQueryUser = ref(false);
  let queryUserFun = async (formEl: FormInstance) => {
    // 先验证表单
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitQueryUser.value = true;
        console.log(userQueryFrom);
        let res = await getUserList(userQueryFrom);
        console.log("查询结果=>", res);
        if (res.code === 200) {
          ElMessage.success("查询成功");
          allUserList.value = res.data.records;
        } else ElMessage.error(res.message);
        waitQueryUser.value = false;
      } else console.log("error submit!", fields);
    });
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

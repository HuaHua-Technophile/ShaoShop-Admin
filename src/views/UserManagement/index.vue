<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="userQueryFrom"
      ref="userQueryFromRef"
      :rules="queryRules"
      class="flex-shrink-0 d-flex flex-nowrap align-items-center px-4">
      <div class="flex-grow-1 d-flex align-items-center">
        <el-form-item class="col-3 pe-3" label="用户账号" prop="userName">
          <el-input
            clearable
            v-model="userQueryFrom.userName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="绑定邮箱" prop="email">
          <el-input
            clearable
            v-model="userQueryFrom.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')">
          </el-input>
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="绑定电话" prop="phoneNumber">
          <el-input
            clearable
            v-model="userQueryFrom.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')">
          </el-input>
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="部门主体" prop="nickName">
          <el-input
            clearable
            v-model="userQueryFrom.nickName"
            placeholder="运营部/物流部/..."
            :prefix-icon="renderFontIcon('bi bi-people')">
          </el-input>
        </el-form-item>
      </div>
      <el-form-item class="flex-shrink-0 pe-3" label="帐号状态" prop="status">
        <el-select
          v-model="userQueryFrom.status"
          placeholder="正常/停用"
          clearable
          style="width: 113px">
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
      <div
        ref="userListWrapper"
        class="userListWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <el-table
          ref="userTableRef"
          :data="allUserList"
          header-cell-class-name="text-center"
          row-class-name="bg-body"
          cell-class-name="text-center"
          class="bg-body rounded-4"
          empty-text="暂无符合查询条件的系统账户"
          row-key="userName"
          @cell-click="cellClickFun"
          @selection-change="selectionChange"
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="userName" label="账号名称" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phoneNumber" label="电话" />
          <el-table-column prop="nickName" label="部门主体" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <span
                :class="[
                  'rounded-1 border px-1',
                  scope.row.status == 0
                    ? 'border-success text-success'
                    : 'border-danger text-danger',
                ]">
                {{ scope.row.status == 0 ? "正常" : "停用" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="index">
            <template #header>
              <div class="d-flex align-items-center">
                跳至<el-input-number
                  :disabled="pagesNum === -1"
                  size="small"
                  v-model="page"
                  :min="1"
                  :max="pagesNum === -1 ? 1 : pagesNum"
                  @change="jumpPage"
                  style="width: 75px" />/{{ pagesNum }}页
              </div>
            </template>
            <template #default>
              <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
            </template>
          </el-table-column>
          <el-table-column prop="index">
            <template #header>
              <el-button @click="addUserDialog">添加账号</el-button>
            </template>
            <template #default>
              <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹出对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="450px"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center>
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
        <el-form-item label="商户(可空)" prop="businessId">
          <el-input
            clearable
            v-model="userInfoForm.businessId"
            placeholder="留空则表示为系统管理员"
            :prefix-icon="renderFontIcon('bi bi-shop-window')"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            v-if="dialogTitle == '添加用户'"
            @click="addUserFun(dialogFromRef)"
            :loading="waitAddUser"
            >确认添加</el-button
          >
          <el-button
            v-else
            @click="editUserFun(dialogFromRef)"
            :loading="waitEditUser"
            >确认修改</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 右下角悬浮跳页 -->
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut">
      <div
        class="position-absolute align-items-center p-2 rounded-pill me-3 mb-3"
        style="background: #141414; display: flex; right: 0; bottom: 0"
        v-show="pagesNum != -1 && hoverBtnVisible">
        跳至<el-input-number
          :disabled="pagesNum === -1"
          size="small"
          v-model="page"
          :min="1"
          :max="pagesNum === -1 ? 1 : pagesNum"
          style="width: 75px"
          @change="jumpPage" />/{{ pagesNum }}页
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
  import {
    getUserList,
    addUser,
    editUser,
    deleteUser,
  } from "@/api/UserManagementAPI.ts";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
  import { onMounted, reactive, ref, nextTick } from "vue";
  import { userType } from "@/type/index";
  import throttle from "lodash/throttle"; //lodash节流，按需引入减少打包体积
  import { ceil } from "lodash"; //lodash节流，按需引入减少打包体积
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  let allUserList = ref();
  let pagesNum = ref(-1); //总的页数
  let total = ref(-1); //总用户数量
  let page = ref(1); // 当前页数
  let itemHeight = ref<number | undefined>(-1);
  let trHeight = ref<number | undefined>(-1);
  const userQueryFrom = reactive({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    status: null, //状态
    currentPage: 1, //页码
    pageSize: 20, //每页返回的数量
  });
  const getUserListFun = async () => {
    let res = await getUserList(userQueryFrom);
    console.log("用户列表=>", res);
    allUserList.value = res.data.records;
    pagesNum.value = res.data.pages;
    total.value = res.data.total;
    await nextTick();
    bs?.refresh();
    itemHeight.value = document.querySelector(".el-table__row")?.clientHeight;
    trHeight.value = document.querySelector("tr")?.clientHeight;
  };
  getUserListFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const userListWrapper = ref();
  let bs: BScrollConstructor<{}> | null = null;
  onMounted(() => {
    bs = new BScroll(userListWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
    });
    bs?.on("pullingUp", async () => {
      userQueryFrom.currentPage++;
      let res = await getUserList(userQueryFrom);
      console.log(
        `第${userQueryFrom.currentPage}页=>`,
        res.data.records.length,
        res.data.records
      );
      if (res.data.records.length < userQueryFrom.pageSize) bs?.closePullUp();
      else bs?.finishPullUp();
      allUserList.value.push(...res.data.records);
      await nextTick();
      bs?.refresh();
    });
    bs.on(
      "scroll",
      throttle((e: { x: number; y: number }) => {
        if (-e.y > trHeight.value!) hoverBtnVisible.value = true;
        else hoverBtnVisible.value = false;
        let pages = ceil(-e.y / (itemHeight.value! * 20));
        console.log(-e.y, itemHeight.value! * 20, pages);
      }, 400)
    );
  });

  //页面跳转
  let hoverBtnVisible = ref(false);
  let jumpPage = () => {
    // 如果已经加载出的数据量小于要跳转的,则直接滚动
    if (userQueryFrom.currentPage >= page.value) {
      bs?.scrollTo(0, itemHeight.value! * (page.value - 1));
    }
    // 否则先请求数据
    else {
    }
  };

  //dialog弹出框--------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("添加用户");
  const isAddUser = ref(true);
  let closeConfirm = (done: () => void) => {
    ElMessageBox.confirm(
      `"确认放弃${dialogTitle.value}吗?所填内容将会被清空"`,
      {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        customClass: "rounded",
      }
    )
      .then(() => {
        dialogFromRef.value?.resetFields();
        done();
        ElMessage({
          type: "info",
          message: `放弃${dialogTitle.value.slice(0, 2)}`,
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: `继续${dialogTitle.value.slice(0, 2)}`,
        });
      });
  };

  //表格点击回调
  let cellClickFun = (
    row: userType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      editUserDialog(row);
    if (event.target.className.includes("bi-trash")) deleteUserFun(row);
  };

  // 添加/修改-------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const userInfoForm = reactive({
    businessId: "", //商户
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    password: "", //密码。
    userId: -1,
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
    businessId: [
      {
        min: 0,
        max: 12,
        message: "长度在12位以内",
        trigger: "blur",
      },
    ],
  });

  //添加用户-------------------------------------
  let addUserDialog = () => {
    dialogVisible.value = true;
    isAddUser.value = true;
    dialogTitle.value = "添加用户";
  };
  let waitAddUser = ref(false);
  const addUserFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitAddUser.value = true;
        let res = await addUser(userInfoForm);
        if (res.code === 200) {
          ElMessage.success("添加成功");
          getUserListFun(); //重新请求数据进行用户列表渲染
          // dialogVisible.value = false; //隐藏弹出框
          // formEl.resetFields(); //重置表单
        } else ElMessage.error(res.message);
        waitAddUser.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //修改用户--------------------------------------
  let editUserDialog = (user: userType) => {
    dialogVisible.value = true;
    isAddUser.value = false;
    dialogTitle.value = "修改用户";
    userInfoForm.userName = user.userName;
    userInfoForm.businessId = user.businessId + "";
    userInfoForm.email = user.email;
    userInfoForm.nickName = user.nickName;
    userInfoForm.phoneNumber = user.phoneNumber;
    userInfoForm.password = user.password + "";
    userInfoForm.userId = user.userId! + 0;
  };
  let waitEditUser = ref(false);
  let editUserFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitEditUser.value = true;
        let res = await editUser(userInfoForm);
        if (res.code === 200) {
          ElMessage.success("修改成功");
          getUserListFun(); //重新请求数据进行用户列表渲染
          dialogVisible.value = false; //隐藏弹出框
          formEl.resetFields(); //重置表单
        } else ElMessage.error(res.message);
        waitEditUser.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //查询用户-------------------------------------
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
  let queryUserFun = async (formEl: FormInstance | undefined) => {
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
          await nextTick();
          bs?.refresh();
        } else ElMessage.error(res.message);
        waitQueryUser.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //删除用户------------------------------------
  const userTableRef = ref();
  const userIdList = ref<(number | undefined)[]>([]);
  let selectionChange = (val: userType[]) => {
    userIdList.value = val.map((i) => {
      return i.userId;
    });
  };
  let deleteUserFun = (user: userType) => {
    userTableRef.value.toggleRowSelection(user, true);
    ElMessageBox.confirm(
      `确认要删除勾选的${userIdList.value.length}个用户吗?`,
      {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true,
        customClass: "rounded",
      }
    )
      .then(async () => {
        let res = await deleteUser(userIdList.value);
        if (res.code === 200) {
          ElMessage.success("删除成功");
          getUserListFun(); //重新请求数据进行用户列表渲染
        } else ElMessage.error(res.message);
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
</script>
<style lang="scss">
  .el-table__header-wrapper {
    position: sticky !important;
    top: 0 !important;
  }
</style>

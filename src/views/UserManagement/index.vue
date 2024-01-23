<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="userQueryFrom"
      ref="userQueryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4">
      <div class="flex-grow-1 d-flex align-items-center">
        <el-form-item class="col-3 pe-3" label="用户账号" prop="userName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="userQueryFrom.userName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-person')" />
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="绑定邮箱" prop="email">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="userQueryFrom.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')" />
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="绑定电话" prop="phoneNumber">
          <el-input
            clearable
            maxlength="11"
            v-model.trim="userQueryFrom.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')" />
        </el-form-item>
        <el-form-item class="col-3 pe-3" label="部门主体" prop="nickName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="userQueryFrom.nickName"
            placeholder="运营部/物流部/..."
            :prefix-icon="renderFontIcon('bi bi-people')" />
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
        <el-button :loading="loading" @click="queryUserFun"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 用户列表模块 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="userListWrapper"
        class="userListWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            v-loading="loading"
            ref="userTableRef"
            :data="allUserList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="userId"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的系统账户"
            @cell-click="cellClickFun"
            @selection-change="selectionChange">
            <el-table-column type="selection" width="30" />
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="userId" label="ID" />
            <el-table-column prop="userName" label="账号名称" />
            <el-table-column prop="nickName" label="部门主体" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                  scope.row.status == 0 ? "正常" : "停用"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phoneNumber" label="电话" />
            <el-table-column prop="updateBy" label="更新者" />
            <el-table-column prop="updateTime" label="更新时间">
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.updateTime"
                  effect="light"
                  placement="left">
                  <el-text style="max-width: 100px" truncated>
                    {{ scope.row.updateTime }}
                  </el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="remark">
              <template #header>
                <jumpPageBtn
                  :queryFun="getUserListFun"
                  :allPageCount="allPageCount"
                  :nowPage="nowPage"
                  :visible="true"
                  :bs="bs"
                  :tableItemHeight="tableItemHeight"
                  :tableHeaderHeight="tableHeaderHeight"
                  :queryFrom="userQueryFrom"
                  :defaultPageSize="defaultPageSize" />
              </template>
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.remark"
                  effect="light"
                  placement="left">
                  <el-text style="max-width: 80px" truncated>
                    {{ scope.row.remark }}
                  </el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-button @click="addUserDialog">添加账号</el-button>
              </template>
              <template #default>
                <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
                <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 添加/修改用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <el-form :model="userInfoForm" ref="dialogFromRef" :rules="rules">
        <el-form-item label="用户账号" prop="userName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="userInfoForm.userName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-person')" />
        </el-form-item>
        <el-form-item label="绑定邮箱" prop="email">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="userInfoForm.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')" />
        </el-form-item>
        <el-form-item label="绑定电话" prop="phoneNumber">
          <el-input
            clearable
            maxlength="11"
            v-model.trim="userInfoForm.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')" />
        </el-form-item>
        <el-form-item label="部门主体" prop="nickName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="userInfoForm.nickName"
            placeholder="运营部/物流部/..."
            :prefix-icon="renderFontIcon('bi bi-people')" />
        </el-form-item>
        <el-form-item label="账号密码" prop="password" v-if="isAddUser">
          <el-input
            clearable
            maxlength="16"
            v-model.trim="userInfoForm.password"
            placeholder="6~16位密码,不能含有中文与空格"
            :prefix-icon="renderFontIcon('bi-shield-lock')" />
        </el-form-item>
        <el-form-item label="商户(可空)" prop="businessId">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="userInfoForm.businessId"
            placeholder="填写以绑定对应商户"
            :prefix-icon="renderFontIcon('bi bi-shop-window')" />
        </el-form-item>
        <el-form-item
          label="用户备注"
          prop="remark"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model.trim="userInfoForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')" />
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-center">
        <el-button @click="addOrEditUserFun" :loading="loading"
          >确认{{ dialogTitle
          }}<span v-if="!isAddUser"
            >ID: {{ userInfoForm.userId }}</span
          ></el-button
        >
      </div>
    </el-dialog>
    <!-- 右下角悬浮跳页按钮 -->
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut">
      <jumpPageBtn
        class="position-absolute p-2 rounded-pill me-3 mb-3"
        style="background: #141414; right: 0; bottom: 0"
        :queryFun="getUserListFun"
        :allPageCount="allPageCount"
        :nowPage="nowPage"
        :visible="jumpPageBtnVisible"
        :bs="bs"
        :tableItemHeight="tableItemHeight"
        :tableHeaderHeight="tableHeaderHeight"
        :queryFrom="userQueryFrom"
        :defaultPageSize="defaultPageSize" />
    </Transition>
  </div>
</template>
<script lang="ts" setup>
  import {
    getUserList,
    addUser,
    editUser,
    delUser,
  } from "@/api/UserManagementAPI.ts";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import {
    phoneNumberValidator,
    emailValidator,
    passwordValidator,
  } from "@/utils/elFromValidator/elFromValidator";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { userType } from "@/type/index";

  import { ElMessage, FormInstance } from "element-plus";
  import { onMounted, reactive, ref, nextTick } from "vue";
  import { ceil, throttle, cloneDeep } from "lodash"; //lodash按需引入减少打包体积(_.ceil(number, [precision=0])根据 precision（精度） 向上舍入 number。（注： precision（精度）可以理解为保留几位小数。）)
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";

  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  const allUserList = ref<userType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const loading = ref(false);
  const userQueryFrom = reactive({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    status: null, //状态
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const getUserListFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getUserList(userQueryFrom);
    console.log(
      `查询条件`,
      userQueryFrom,
      `\n第${userQueryFrom.currentPage}页用户列表(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      allUserList.value.push(...res.data.records);
      await nextTick();
      // 每次请求都重新赋值总页数
      allPageCount.value = ceil(Number(res.data.total) / defaultPageSize);
      // 如果是页面初次加载,则获取元素高度
      if (!tableItemHeight)
        tableItemHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__row")!)
            .height.replace("px", "")
        );
      if (!tableHeaderHeight)
        tableHeaderHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__body-header")!)
            .height.replace("px", "")
        );
      if (allUserList.value.length >= res.data.total) {
        bs.closePullUp();
        closePullUp = true;
      }
    } else bs.closePullUp();
    loading.value = false;
    return { closePullUp };
  };
  getUserListFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const userListWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(userListWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
    bs.on("pullingUp", async () => {
      userQueryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", userQueryFrom.currentPage);
      const { closePullUp } = await getUserListFun();
      if (!closePullUp) bs!.finishPullUp();
    });
    bs.on(
      "scroll",
      // 使用节流,实时刷新当前页面
      throttle((e: { x: number; y: number }) => {
        if (-e.y + 1 > tableHeaderHeight!) jumpPageBtnVisible.value = true;
        else jumpPageBtnVisible.value = false;
        // 滚动高度-表头高度=实际滚动内容
        nowPage.value = ceil(
          (-e.y - tableHeaderHeight! + userListWrapper.value.clientHeight) /
            (tableItemHeight! * userQueryFrom.pageSize)
        );
        /* console.log(
            `视窗高${userListWrapper.value.clientHeight}px,表头高${
              tableHeaderHeight
            }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
            nowPage.value
          ); */
      }, 400)
    );
  });

  //表格点击回调-------------
  const cellClickFun = (
    row: userType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      editUserDialog(row);
    if (event.target.className.includes("bi-trash")) delUserFun(row);
  };

  //表单-----------------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultUserInfo: userType = {
    businessId: null, //商户id
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    password: "", //密码。
    userId: -1,
    remark: "", //备注
  };
  let userInfoForm = reactive(defaultUserInfo);
  const rules = reactive({
    userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
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
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { validator: passwordValidator, trigger: "blur" },
    ],
  });

  //dialog弹出框-----------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("添加用户");
  const isAddUser = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${dialogTitle.value}`, () => {
      done();
      ElMessage.info(`放弃${dialogTitle.value}`);
    });
  };

  // 添加/修改用户--------------------------------
  const addUserDialog = () => {
    userInfoForm = reactive(cloneDeep(defaultUserInfo));
    dialogVisible.value = true;
    isAddUser.value = true;
    dialogTitle.value = "添加用户";
  };
  const editUserDialog = (user: userType) => {
    userInfoForm = reactive(cloneDeep(user));
    dialogVisible.value = true;
    isAddUser.value = false;
    dialogTitle.value = "修改用户";
  };
  const addOrEditUserFun = async () => {
    dialogFromRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAddUser.value) res = await addUser(userInfoForm);
        else res = await editUser(userInfoForm);
        if (res.code === 200) {
          ElMessage.success("添加成功");
          allUserList.value = [];
          userQueryFrom.currentPage = 1;
          getUserListFun(); //重新请求数据进行用户列表渲染
          // dialogVisible.value = false; //隐藏弹出框
        } else ElMessage.error(res.message);
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //查询用户-------------------------------------
  const userQueryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryRules = reactive({
    phoneNumber: [{ validator: phoneNumberValidator, trigger: "change" }],
    email: [{ validator: emailValidator, trigger: "change" }],
  });
  const queryUserFun = async () => {
    userQueryFromRef.value!.validate(async (valid, fields) => {
      if (valid) {
        allUserList.value = [];
        userQueryFrom.currentPage = 1;
        await getUserListFun();
      } else console.log("error submit!", fields);
    });
  };

  //删除用户------------------------------------
  const userTableRef = ref();
  const userIdList = ref<(number | undefined)[]>([]);
  const selectionChange = (val: userType[]) => {
    userIdList.value = val.map((i) => {
      return i.userId;
    });
  };
  const delUserFun = (user: userType) => {
    userTableRef.value.toggleRowSelection(user, true);
    elMessageBoxConfirm(
      `删除勾选的${userIdList.value.length}个用户`,
      async () => {
        const res = await delUser(userIdList.value);
        if (res.code == 200) {
          ElMessage.success("删除用户成功");
          allUserList.value = [];
          userQueryFrom.currentPage = 1;
          getUserListFun(); //重新请求数据进行用户列表渲染
        } else ElMessage.error(res.message);
      }
    );
  };
</script>
<style lang="scss">
  .el-table__header-wrapper {
    position: sticky !important;
    top: 0 !important;
  }
</style>

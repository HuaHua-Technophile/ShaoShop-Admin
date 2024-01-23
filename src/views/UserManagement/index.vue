<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="queryFrom"
      ref="queryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-0 px-sm-1 px-md-2 px-lg-3">
      <el-form-item
        label="用户账号"
        prop="userName"
        class="flex-grow-1 overflow-hidden me-0 me-md-1 me-lg-2">
        <el-input
          clearable
          maxlength="12"
          v-model.trim="queryFrom.userName"
          placeholder="每个后台主体唯一名称"
          :prefix-icon="renderFontIcon('bi bi-person')" />
      </el-form-item>
      <el-form-item
        label="绑定邮箱"
        prop="email"
        class="flex-grow-1 overflow-hidden me-0 me-md-1 me-lg-2">
        <el-input
          clearable
          maxlength="20"
          v-model.trim="queryFrom.email"
          placeholder="每个后台主体唯一邮箱"
          :prefix-icon="renderFontIcon('bi bi-envelope')" />
      </el-form-item>
      <el-form-item
        label="绑定电话"
        prop="phoneNumber"
        class="flex-grow-1 overflow-hidden me-0 me-md-1 me-lg-2">
        <el-input
          clearable
          maxlength="11"
          v-model.trim="queryFrom.phoneNumber"
          placeholder="每个后台主体唯一手机号"
          :prefix-icon="renderFontIcon('bi bi-telephone')" />
      </el-form-item>
      <el-form-item
        label="部门主体"
        prop="nickName"
        class="flex-grow-1 overflow-hidden me-0 me-md-1 me-lg-2">
        <el-input
          clearable
          maxlength="12"
          v-model.trim="queryFrom.nickName"
          placeholder="运营部/物流部/..."
          :prefix-icon="renderFontIcon('bi bi-people')" />
      </el-form-item>
      <el-form-item
        label="帐号状态"
        prop="status"
        class="flex-shrink-0 me-0 me-md-1 me-lg-2">
        <el-select
          v-model="queryFrom.status"
          placeholder="正常/停用"
          clearable
          style="width: 106px">
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="queryFun">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户列表模块 -->
    <div class="flex-grow-1 overflow-hidden p-0 p-sm-1 p-md-2 p-lg-3">
      <div
        ref="bsWrapper"
        class="bsWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            v-loading="loading"
            ref="tableRef"
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
                  :queryFun="getFun"
                  :allPageCount="allPageCount"
                  :nowPage="nowPage"
                  :visible="true"
                  :bs="bs"
                  :tableItemHeight="tableItemHeight"
                  :tableHeaderHeight="tableHeaderHeight"
                  :queryFrom="queryFrom"
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
                <el-button @click="toAdd">添加账号</el-button>
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
      v-model="A_EVisible"
      :title="A_ETitle"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <template #header>
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle
          }}<span v-if="!isAdd">ID: {{ A_EFrom.userId }}</span></el-button
        >
      </template>
      <el-form :model="A_EFrom" ref="A_EFromRef" :rules="A_ERules">
        <el-form-item label="用户账号" prop="userName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="A_EFrom.userName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-person')" />
        </el-form-item>
        <el-form-item label="绑定邮箱" prop="email">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="A_EFrom.email"
            placeholder="每个后台主体唯一邮箱"
            :prefix-icon="renderFontIcon('bi bi-envelope')" />
        </el-form-item>
        <el-form-item label="绑定电话" prop="phoneNumber">
          <el-input
            clearable
            maxlength="11"
            v-model.trim="A_EFrom.phoneNumber"
            placeholder="每个后台主体唯一手机号"
            :prefix-icon="renderFontIcon('bi bi-telephone')" />
        </el-form-item>
        <el-form-item label="部门主体" prop="nickName">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="A_EFrom.nickName"
            placeholder="运营部/物流部/..."
            :prefix-icon="renderFontIcon('bi bi-people')" />
        </el-form-item>
        <el-form-item label="账号密码" prop="password" v-if="isAdd">
          <el-input
            clearable
            maxlength="16"
            v-model.trim="A_EFrom.password"
            placeholder="6~16位密码,不能含有中文与空格"
            :prefix-icon="renderFontIcon('bi-shield-lock')" />
        </el-form-item>
        <el-form-item label="商户(可空)" prop="businessId">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="A_EFrom.businessId"
            placeholder="填写以绑定对应商户"
            :prefix-icon="renderFontIcon('bi bi-shop-window')" />
        </el-form-item>
        <el-form-item
          label="用户备注"
          prop="remark"
          style="padding-left: 10.18px"
          class="mb-0">
          <el-input
            clearable
            v-model.trim="A_EFrom.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 右下角悬浮跳页按钮 -->
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut">
      <jumpPageBtn
        class="position-absolute p-2 rounded-pill me-3 mb-3"
        style="background: #141414; right: 0; bottom: 0"
        :queryFun="getFun"
        :allPageCount="allPageCount"
        :nowPage="nowPage"
        :visible="jumpPageBtnVisible"
        :bs="bs"
        :tableItemHeight="tableItemHeight"
        :tableHeaderHeight="tableHeaderHeight"
        :queryFrom="queryFrom"
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
  const queryFrom = reactive({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    status: undefined, //状态
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const getFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getUserList(queryFrom);
    console.log(
      `查询条件`,
      queryFrom,
      `\n第${queryFrom.currentPage}页用户列表(${res.data?.records?.length})=>`,
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
  getFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const bsWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(bsWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
    bs.on("pullingUp", async () => {
      queryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", queryFrom.currentPage);
      const { closePullUp } = await getFun();
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
          (-e.y - tableHeaderHeight! + bsWrapper.value.clientHeight) /
            (tableItemHeight! * queryFrom.pageSize)
        );
        /* console.log(
            `视窗高${bsWrapper.value.clientHeight}px,表头高${
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
    if (event.target.className.includes("bi-pencil-square")) toEdit(row);
    if (event.target.className.includes("bi-trash")) delFun(row);
  };

  //表单-----------------------
  const A_EFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultA_EInfo: userType = {
    businessId: undefined, //商户id
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    password: "", //密码。
    userId: undefined,
    remark: "", //备注
  };
  let A_EFrom = reactive(defaultA_EInfo);
  const A_ERules = reactive({
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
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加用户");
  const isAdd = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };

  // 添加/修改用户--------------------------------
  const toAdd = () => {
    A_EFrom = reactive(cloneDeep(defaultA_EInfo));
    A_EVisible.value = true;
    isAdd.value = true;
    A_ETitle.value = "添加用户";
  };
  const toEdit = (user: userType) => {
    A_EFrom = reactive(cloneDeep(user));
    A_EVisible.value = true;
    isAdd.value = false;
    A_ETitle.value = "修改用户";
  };
  const A_EFun = async () => {
    A_EFromRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAdd.value) res = await addUser(A_EFrom);
        else res = await editUser(A_EFrom);
        if (res.code === 200) {
          allUserList.value = [];
          queryFrom.currentPage = 1;
          getFun(); //重新请求数据进行用户列表渲染
          ElMessage.success("添加成功");
          // dialogVisible.value = false; //隐藏弹出框
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //查询用户-------------------------------------
  const queryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryRules = reactive({
    phoneNumber: [{ validator: phoneNumberValidator, trigger: "change" }],
    email: [{ validator: emailValidator, trigger: "change" }],
  });
  const queryFun = async () => {
    queryFromRef.value!.validate(async (valid, fields) => {
      if (valid) {
        allUserList.value = [];
        queryFrom.currentPage = 1;
        await getFun();
      } else console.log("error submit!", fields);
    });
  };

  //删除用户------------------------------------
  const tableRef = ref();
  const userIdList = ref<(number | undefined)[]>([]);
  const selectionChange = (val: userType[]) => {
    userIdList.value = val.map((i) => {
      return i.userId;
    });
  };
  const delFun = (user: userType) => {
    tableRef.value.toggleRowSelection(user, true);
    elMessageBoxConfirm(
      `删除勾选的${userIdList.value.length}个用户`,
      async () => {
        loading.value = true;
        const res = await delUser(userIdList.value);
        if (res.code == 200) {
          ElMessage.success(`删除勾选的${userIdList.value.length}个用户成功`);
          allUserList.value = [];
          queryFrom.currentPage = 1;
          getFun(); //重新请求数据进行用户列表渲染
        }
        loading.value = false;
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

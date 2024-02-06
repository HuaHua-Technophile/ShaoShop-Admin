<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索用户 -->
    <listQueryForm
      ref="queryFormRef"
      :form="queryForm"
      :rules="queryRules"
      :inputInfo="listQueryFormInput"
      :selectInfo="listQueryFormSelect"
      :loading="loading"
      :reQueryFun="reQueryFun">
      <el-form-item class="me-0 me-md-1 me-lg-2">
        <jumpPageBtn
          v-model:nowPage="nowPage"
          :allPageCount="allPageCount"
          :visible="true"
          :bs="bsRef?.bs"
          :tableItemHeight="tableItemHeight"
          :tableHeaderHeight="tableHeaderHeight"
          :queryForm="queryForm"
          :queryFun="queryFun" />
      </el-form-item>
    </listQueryForm>
    <!-- 用户列表模块 -->
    <bsWrapper
      ref="bsRef"
      class="flex-grow-1"
      :pullingUp="true"
      :scroll="true"
      :form="queryForm"
      :queryFun="queryFun"
      :tableHeaderHeight="tableHeaderHeight"
      :tableItemHeight="tableItemHeight"
      v-model:nowPage="nowPage">
      <customTable
        v-model:loading="loading"
        :data="allUserList"
        rowKey="userId"
        emptyText="暂无符合查询条件的系统账户"
        :hasSelection="true"
        delId="userId"
        :hasSerialNum="true"
        :hasStatus="true"
        :hasUpdateBy="true"
        :hasUpdateTime="true"
        :hasRemark="true"
        v-model:A_EVisible="A_EVisible"
        v-model:isAdd="isAdd"
        v-model:A_ETitle="A_ETitle"
        A_E_Dkeyword="用户"
        @toAdd="toAdd"
        @toEdit="toEdit"
        :delFun="delUser"
        :reQueryFun="reQueryFun">
        <el-table-column prop="userId" label="ID" />
        <el-table-column prop="userName" label="账号" />
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phoneNumber" label="电话" />
      </customTable>
    </bsWrapper>
    <!-- 添加/修改用户弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      v-model:loading="loading"
      :A_ETitle="A_ETitle"
      :isAdd="isAdd"
      :id="A_EForm.userId"
      :A_EForm="A_EForm"
      :A_ERules="A_ERules"
      :A_EFormInput="A_EFormInput"
      :addFun="addUser"
      :editFun="editUser"
      :reQueryFun="reQueryFun">
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    getUserList,
    addUser,
    editUser,
    delUser,
  } from "@/api/UserManagementAPI.ts";
  import {
    phoneNumberValidator,
    emailValidator,
    passwordValidator,
  } from "@/utils/elFromValidator/elFromValidator";
  import {
    elInputItemInfoType,
    elSelectItemInfoType,
    userQueryType,
    userType,
  } from "@/type/index";
  import { query } from "@/utils/query/query";

  import { FormInstance } from "element-plus";
  import { reactive, ref } from "vue";
  import { cloneDeep } from "lodash"; //lodash按需引入减少打包体积(_.ceil(number, [precision=0])根据 precision（精度） 向上舍入 number。（注： precision（精度）可以理解为保留几位小数。）)
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";

  // 不传参数的情况下，就是获取所有用户。传参数的情况下可用作搜索
  const bsRef = ref<{ r: HTMLElement; bs: BScrollConstructor }>();
  const allUserList = ref<userType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  const tableItemHeight = ref<number>(); //每一项高度
  const tableHeaderHeight = ref<number>(); //表头高度
  const loading = ref(false);
  const queryForm = reactive<userQueryType>({
    userName: "", //账号
    email: "", //绑定邮箱
    phoneNumber: "", //绑定手机号
    nickName: "", //部门主体名称(账号名称)
    status: undefined, //状态
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryFun = query({
    loading,
    queryStr: "用户列表",
    data: allUserList,
    queryForm,
    allPageCount,
    tableItemHeight,
    tableHeaderHeight,
    bs: bsRef.value?.bs,
    queryListFun: getUserList,
  });
  queryFun();
  const reQueryFun = async () => {
    allUserList.value = [];
    queryForm.currentPage = 1;
    await queryFun(); //重新请求数据进行用户列表渲染
  };

  // A_E表单-----------------------
  const isAdd = ref(true);
  const userNameInput: elInputItemInfoType = {
    disabledOnEdit: true,
    label: "用户账号",
    prop: "userName",
    maxlength: 12,
    placeholder: "账号",
    prefixIcon: "fa-regular fa-id-card",
  };
  const nickNameInput: elInputItemInfoType = {
    label: "用户昵称",
    prop: "nickName",
    maxlength: 12,
    placeholder: "昵称",
    prefixIcon: "bi bi-person",
  };
  const emailInput: elInputItemInfoType = {
    label: "用户邮箱",
    prop: "email",
    maxlength: 20,
    placeholder: "每个后台主体唯一邮箱",
    prefixIcon: "bi bi-envelope",
  };
  const phoneNumberInput: elInputItemInfoType = {
    label: "用户电话",
    prop: "phoneNumber",
    maxlength: 11,
    placeholder: "每个后台主体唯一手机号",
    prefixIcon: "bi bi-telephone",
  };
  const passwordInput: elInputItemInfoType = {
    label: "账号密码",
    prop: "password",
    maxlength: 16,
    placeholder: "6~16位密码,不能含有中文与空格",
    prefixIcon: "bi-shield-lock",
    hiddenOnEdit: true,
  };
  const businessIdInput: elInputItemInfoType = {
    label: "商户(可空)",
    prop: "businessId",
    maxlength: 12,
    placeholder: "填写以绑定对应商户",
    prefixIcon: "bi bi-shop-window",
  };
  const remarkInput: elInputItemInfoType = {
    label: "用户备注",
    prop: "remark",
    placeholder: "备注",
    prefixIcon: "bi bi-shop-window",
    notRequired: true,
  };
  const A_EFormInput: elInputItemInfoType[] = [
    userNameInput,
    nickNameInput,
    emailInput,
    phoneNumberInput,
    passwordInput,
    businessIdInput,
    remarkInput,
  ];
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
  let A_EForm = reactive(defaultA_EInfo);
  const A_ERules = {
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
  };

  //dialog弹出框-----------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加用户");

  // 添加/修改用户--------------------------------
  const toAdd = () => {
    A_EForm = reactive(cloneDeep(defaultA_EInfo));
  };
  const toEdit = (user: userType) => {
    A_EForm = reactive(cloneDeep(user));
  };

  //查询用户-------------------------------------
  const queryFormRef = ref<{ r: FormInstance }>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const statusSelect: elSelectItemInfoType = {
    prop: "status",
    label: "状态",
    placeholder: "正常/停用",
    option: [
      { label: "正常", value: 0 },
      { label: "停用", value: 1 },
    ],
  };
  const listQueryFormInput: elInputItemInfoType[] = [
    userNameInput,
    emailInput,
    phoneNumberInput,
  ];
  const listQueryFormSelect: elSelectItemInfoType[] = [statusSelect];
  const queryRules = {
    phoneNumber: [{ validator: phoneNumberValidator, trigger: "change" }],
    email: [{ validator: emailValidator, trigger: "change" }],
  };
</script>

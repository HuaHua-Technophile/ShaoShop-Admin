<template>
  <div class="w-100 h-100">
    <!-- 角色列表 -->
    <bsWrapper :nestedScroll="1">
      <customTable
        v-model:loading="loading"
        :data="roleList"
        rowKey="roleId"
        emptyText="查询角色异常"
        :hasUpdateBy="true"
        :hasUpdateTime="true"
        :hasRemark="true"
        :hasStatus="true"
        v-model:A_EVisible="A_EVisible"
        v-model:isAdd="isAdd"
        v-model:A_ETitle="A_ETitle"
        A_E_Dkeyword="角色"
        @toAdd="toAdd"
        @toEdit="toEdit"
        :delFun="delRole"
        delName="menuName"
        selectionId="menuId"
        :reQueryFun="queryFun"
        :expandChange="expandChangeFun">
        <!-- 外层表格扩展 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="px-3">
              <div
                class="d-flex align-items-center justify-content-around mb-2">
                <el-button
                  @click="
                    revokeUserDrawer(props.row.roleId, props.row.roleName)
                  "
                  >授权用户</el-button
                >
                <div class="d-flex align-items-center">
                  菜单树选择项是否关联显示:<el-tag
                    :type="props.row.menuCheckStrictly ? 'success' : 'info'"
                    class="ms-3"
                    >{{ props.row.menuCheckStrictly ? "是" : "否" }}</el-tag
                  >
                </div>
                <div class="d-flex align-items-center">
                  公司树选择项是否关联显示:<el-tag
                    :type="props.row.companyCheckStrictly ? 'success' : 'info'"
                    class="ms-3"
                    >{{ props.row.companyCheckStrictly ? "是" : "否" }}</el-tag
                  >
                </div>
              </div>
              <!-- 绑定的用户 -->
              <bsWrapper :bsInner="true" maxHeight="600px" :nestedScroll="1">
                <customTable
                  :level="2"
                  v-model:loading="loading"
                  :data="props.row.userList"
                  rowKey="userId"
                  emptyText="暂未查询到绑定该角色的用户"
                  :hasStatus="true"
                  :hasSelection="true"
                  selectionId="userId"
                  :delFun="cancelUser"
                  :customDel="true"
                  @customDelFun="cancelUserFun"
                  v-model:isAdd="isAdd"
                  A_E_Dkeyword="用户"
                  :hiddenA="true"
                  A_E_DTitle="取消授权"
                  :hiddenE="true">
                  <el-table-column prop="userId" label="ID" />
                  <el-table-column prop="userName" label="账号名称" />
                  <el-table-column prop="nickName" label="部门主体" />
                  <el-table-column prop="email" label="邮箱" />
                  <el-table-column prop="phoneNumber" label="电话" />
                </customTable>
              </bsWrapper>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="roleId" label="角色ID" />
        <el-table-column prop="roleKey" label="权限字符" />
        <el-table-column prop="dataScope" label="权限范围" />
        <el-table-column prop="roleSort" label="角色排序" />
      </customTable>
    </bsWrapper>
    <!-- 添加/修改角色弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      v-model:loading="loading"
      :A_ETitle="A_ETitle"
      :isAdd="isAdd"
      :id="A_EForm.roleId"
      :A_EForm="A_EForm"
      :A_ERules="A_ERules"
      :A_EFormInput="A_EFormInput"
      :A_EFormInputNum="A_EFormInputNum"
      :A_EFormRadio="A_EFormRadio"
      :addFun="addRole"
      :editFun="editRole"
      :reQueryFun="queryFun">
      <el-form-item label="关联菜单" style="padding-left: 10.18px">
        <el-tree-select
          v-model="A_EForm.menuIds"
          :data="A_EForm.menuTreeList"
          show-checkbox
          multiple
          check-strictly
          collapse-tags
          collapse-tags-tooltip />
      </el-form-item>
    </A_EDialog>
    <!-- 授权用户抽屉 -->
    <customDrawer v-model:visible="drawerVisible" :title="drawerTitle">
      <template #header>
        <div class="d-flex align-items-center">
          <span class="text-body">{{ drawerTitle }}</span>
          <el-button
            @click="revokeUserFun"
            class="ms-3"
            :disabled="revokeUserSelectList.length == 0"
            :loading="loading"
            >确认授权{{ revokeUserSelectList.length }}个用户</el-button
          >
        </div>
      </template>
      <customTable
        v-model:loading="loading"
        :data="UnallocatedList"
        rowKey="userId"
        emptyText="暂无用户未授权"
        :hasStatus="true"
        :hiddenA_E_D="true"
        :hasSelection="true"
        v-model:idList="revokeUserSelectList"
        selectionId="userId">
        <el-table-column prop="userId" label="ID" />
        <el-table-column prop="userName" label="账号名称" />
        <el-table-column prop="nickName" label="部门主体" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phoneNumber" label="电话" />
      </customTable>
    </customDrawer>
  </div>
</template>
<script lang="ts" setup>
  import {
    getRoleList,
    delRole,
    addRole,
    editRole,
    getAllocatedList,
    getUnallocatedList,
    cancelUser,
    revokeUser,
  } from "@/api/RoleManagementAPI";
  import {
    getMenuTreeList,
    getRoleMenuTreeSelect,
  } from "@/api/MenuManagementAPI";
  import {
    elInputItemInfoType,
    elInputNumItemInfoType,
    elRadioItemInfoType,
    roleType,
    userType,
  } from "@/type";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { query } from "@/utils/query/query";
  import { ElMessage } from "element-plus";
  import { nextTick, onUnmounted, reactive, ref } from "vue";
  import { cloneDeep } from "lodash";

  //获取数据-----------------------
  const roleList = ref<roleType[]>([]);
  const loading = ref(false);
  const queryFun = query({
    loading,
    queryStr: "角色",
    data: roleList,
    queryFun: getRoleList,
  });
  queryFun();

  const timeOutArr: NodeJS.Timeout[] = [];
  const expandChangeFun = async (row: roleType, expandedRows: roleType[]) => {
    loading.value = true; //禁止操作,以防在一次性重载大量数据时页面卡顿,而多次点击展开收起
    // 如果是展开就重载数据,并且禁用表格一段时间，避免频繁展开导致BS重新实例化增加页面负载
    if (expandedRows.includes(row)) {
      timeOutArr.push(
        setTimeout(() => {
          loading.value = false;
        }, 200)
      );
      if (!row.userList) getAllocatedListFun(row.roleId!);
    }
    // 如果是收起，就不用增加禁用时间
    else loading.value = false;
  };
  onUnmounted(() => {
    timeOutArr.forEach((i) => clearTimeout(i));
  });

  //表单----------------------
  const isAdd = ref(true);
  const roleNameInput: elInputItemInfoType = {
    prop: "roleName",
    label: "角色称呼",
    placeholder: "角色称呼",
    maxlength: 10,
    prefixIcon: "fa-solid fa-quote-left",
  };
  const roleKeyInput: elInputItemInfoType = {
    prop: "roleKey",
    label: "权限字符",
    placeholder: "权限标识/权限字符",
    maxlength: 20,
    prefixIcon: "fa-solid fa-code",
  };
  const remarkInput: elInputItemInfoType = {
    prop: "remark",
    label: "角色备注",
    placeholder: "角色备注",
    notRequired: true,
    prefixIcon: "fa-solid fa-marker",
  };
  const A_EFormInput: elInputItemInfoType[] = [
    roleNameInput,
    roleKeyInput,
    remarkInput,
  ];
  const dataScopeInputNum: elInputNumItemInfoType = {
    prop: "dataScope",
    label: "权限范围",
    min: 1,
    max: 5,
  };
  const roleSortInputNum: elInputNumItemInfoType = {
    prop: "roleSort",
    label: "角色排序",
  };
  const A_EFormInputNum: elInputNumItemInfoType[] = [
    dataScopeInputNum,
    roleSortInputNum,
  ];
  const companyCheckStrictlyRadioItem: elRadioItemInfoType = {
    prop: "companyCheckStrictly",
    label: "公司树选择项关联显示",
    radio: [
      { l: true, v: "是" },
      { l: false, v: "否" },
    ],
  };
  const menuCheckStrictlyRadioItem: elRadioItemInfoType = {
    prop: "menuCheckStrictly",
    label: "菜单树选择项关联显示",
    radio: [
      { l: true, v: "是" },
      { l: false, v: "否" },
    ],
  };
  const statusRadioItem: elRadioItemInfoType = {
    prop: "status",
    label: "角色状态",
    radio: [
      { l: 0, v: "正常" },
      { l: 1, v: "停用" },
    ],
  };
  const A_EFormRadio: elRadioItemInfoType[] = [
    companyCheckStrictlyRadioItem,
    menuCheckStrictlyRadioItem,
    statusRadioItem,
  ];
  const defaultE_EInfo: roleType = {
    roleName: "",
    companyCheckStrictly: false,
    dataScope: 5,
    menuCheckStrictly: false,
    remark: "",
    roleSort: 0,
    status: 0,
    menuIds: [],
  };
  let A_EForm = reactive(defaultE_EInfo);
  const A_ERules = {
    roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    roleKey: [{ required: true, message: "请输入权限字符", trigger: "blur" }],
  };

  //dialog对话框-----------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加角色");

  //添加/修改角色-----------------------
  const toAdd = async (cb: () => void) => {
    A_EForm = reactive(cloneDeep(defaultE_EInfo));
    if (!A_EForm.menuTreeList) {
      const res = await getMenuTreeList();
      if (res.code == 200) {
        console.log("获取的菜单树=>", res.data);
        A_EForm.menuTreeList = res.data;
      }
    }
    cb();
  };
  const toEdit = async (row: roleType, cb: () => void) => {
    const index = roleList.value.findIndex((i) => i.roleId == row.roleId);
    if (!row.menuTreeList) {
      const res = await getRoleMenuTreeSelect(row.roleId);
      if (res.code == 200) {
        console.log(`id${row.roleId}的菜单树=>`, res.data);
        roleList.value[index].menuTreeList = res.data.menus;
        roleList.value[index].menuIds = res.data.checkedKeys;
      }
    }
    A_EForm = reactive(cloneDeep(roleList.value[index]));
    cb();
  };

  // 抽屉---------------------------------
  const drawerVisible = ref(false);
  const drawerTitle = ref("");

  //查询授权用户------------------------------

  const getAllocatedListFun = async (roleId: number) => {
    const res = await getAllocatedList(roleId);
    console.log(`ID${roleId}已挂载用户=>`, res);
    if (res.code === 200) {
      const index = roleList.value?.findIndex((i) => i.roleId === roleId);
      roleList.value![index!].userList = res.data;
    }
    await nextTick();
  };

  // 授权用户-----------------------------
  const revokeUserSelectList = ref<number[]>([]);
  const UnallocatedList = ref<userType[]>([]);
  const revokeUserForRoleId = ref(-1);
  const revokeUserDrawer = async (roleId: number, roleName: string) => {
    drawerTitle.value = `为'${roleName}'授权用户`;
    revokeUserForRoleId.value = roleId;
    const res = await getUnallocatedList(roleId);
    console.log(`'${roleName}'未分配用户=>`, res);
    UnallocatedList.value = res.data;
    drawerVisible.value = true;
  };
  const revokeUserFun = async () => {
    loading.value = true;
    const res = await revokeUser({
      roleId: revokeUserForRoleId.value,
      userIds: revokeUserSelectList.value,
    });
    if (res.code === 200) {
      ElMessage.success(`授权${revokeUserSelectList.value.length}个用户成功`);
      getAllocatedListFun(revokeUserForRoleId.value);
      drawerVisible.value = false;
    }
    loading.value = false;
  };

  // 取消授权用户----------------
  const cancelUserFun = ({
    row,
    idList,
  }: {
    row: roleType;
    idList?: number[];
  }) => {
    elMessageBoxConfirm(`取消授权勾选的${idList?.length}个用户`, async () => {
      loading.value = true;
      const res = await cancelUser({
        roleId: row.roleId!,
        userIds: idList!,
      });
      if (res.code === 200) {
        ElMessage.success(`取消授权${idList?.length}个用户成功`);
        getAllocatedListFun(row.roleId!);
      }
      loading.value = false;
    });
  };
</script>

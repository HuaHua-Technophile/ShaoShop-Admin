<template>
  <div class="w-100 h-100 p-3 position-relative">
    <!-- 角色列表 -->
    <div ref="bsWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <el-table
          v-loading="loading"
          ref="roleTableRef"
          :data="roleList"
          table-layout="auto"
          class="bg-body rounded-4"
          header-cell-class-name="text-center"
          row-key="roleId"
          row-class-name="bg-body"
          cell-class-name="text-center"
          empty-text="接口错误,查询角色失败"
          @cell-click="cellClickFun"
          @expand-change="expandChangeFun">
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
                      :type="
                        props.row.companyCheckStrictly ? 'success' : 'info'
                      "
                      class="ms-3"
                      >{{
                        props.row.companyCheckStrictly ? "是" : "否"
                      }}</el-tag
                    >
                  </div>
                </div>
                <!-- 绑定的用户 -->
                <div
                  style="max-height: 600px !important"
                  class="overflow-hidden"
                  :id="`BSRef${props.row.roleId}`">
                  <div
                    class="内层BS"
                    style="
                      min-height: calc(100% + 1px) !important;
                      padding: 1px 0 !important;
                    ">
                    <el-table
                      :ref="(el: TableInstance) => {
                      userTableRefs[props.row.roleId] = el;}"
                      :data="props.row.userList"
                      table-layout="auto"
                      class="bg-body rounded-4"
                      header-cell-class-name="text-center text-body"
                      :header-cell-style="{
                        background:
                          'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                      }"
                      row-key="userName"
                      :row-class-name="
                        darkTheme ? 'bg-black' : 'bg-body-secondary'
                      "
                      cell-class-name="text-center"
                      empty-text="暂未查询到绑定该角色的用户"
                      @selection-change="
                        cancelUserSelectionChange($event, props.row.roleId)
                      ">
                      <el-table-column type="selection" width="30" />
                      <el-table-column label="序号" type="index" width="55" />
                      <el-table-column prop="userId" label="ID" />
                      <el-table-column prop="userName" label="账号名称" />
                      <el-table-column prop="nickName" label="部门主体" />
                      <el-table-column prop="status" label="状态">
                        <template #default="scope">
                          <el-tag
                            :type="scope.row.status == 0 ? 'success' : 'danger'"
                            >{{
                              scope.row.status == 0 ? "正常" : "停用"
                            }}</el-tag
                          >
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
                      <el-table-column prop="remark" label="备注">
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
                      <el-table-column label="取消授权">
                        <template #default="scope">
                          <fontIcon
                            icon="bi bi-trash fs-6 text-danger"
                            role="button"
                            @click="
                              cancelUserFun(props.row.roleId, scope.row)
                            " />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" />
          <el-table-column prop="roleId" label="角色ID" />
          <el-table-column prop="roleKey" label="权限字符" />
          <el-table-column prop="dataScope" label="权限范围" />
          <el-table-column prop="roleSort" label="角色排序" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                scope.row.status == 0 ? "正常" : "停用"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="businessId" label="所属商户id" />
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
          <el-table-column prop="remark" label="备注">
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
              <el-button @click="toAdd">添加角色</el-button>
            </template>
            <template #default>
              <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
              <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加/修改角色弹窗 -->
    <el-dialog
      :title="A_ETitle"
      v-model="A_EVisible"
      width="445px"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center>
      <el-form :model="A_EForm" ref="A_EFormRef" :rules="A_ERules">
        <el-form-item label="角色称呼" prop="roleName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="A_EForm.roleName"
            placeholder="角色称呼"
            :prefix-icon="renderFontIcon('fa-solid fa-quote-left')">
          </el-input>
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="A_EForm.roleKey"
            placeholder="权限标识/权限字符"
            :prefix-icon="renderFontIcon('fa-solid fa-code')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="对应商户"
          prop="businessId"
          maxlength="12"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model.trim="A_EForm.businessId"
            placeholder="商户ID,不填写则为管理员角色"
            :prefix-icon="renderFontIcon('bi bi-shop-window')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="角色备注"
          prop="remark"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model.trim="A_EForm.remark"
            placeholder="角色备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
        <el-form-item label="关联菜单" style="padding-left: 10.18px">
          <el-tree-select
            v-model="A_EForm.menuIds"
            :data="A_EForm.menuTreeList"
            show-checkbox
            multiple
            check-strictly
            collapse-tags
            collapse-tags-tooltip>
          </el-tree-select>
        </el-form-item>
        <el-form-item
          label="权限范围"
          prop="dataScope"
          style="padding-left: 10.18px">
          <el-input-number v-model="A_EForm.dataScope" :min="1" :max="5" />
        </el-form-item>
        <el-form-item
          label="角色排序"
          prop="roleSort"
          style="padding-left: 10.18px">
          <el-input-number v-model="A_EForm.roleSort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item
          label="公司树选择项关联显示"
          style="padding-left: 10.18px"
          class="align-items-center">
          <el-radio-group v-model="A_EForm.companyCheckStrictly">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="菜单树选择项关联显示"
          style="padding-left: 10.18px"
          class="align-items-center">
          <el-radio-group v-model="A_EForm.menuCheckStrictly">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="角色状态"
          style="padding-left: 10.18px"
          class="align-items-center">
          <el-radio-group v-model="A_EForm.status">
            <el-radio :label="0" size="large">正常</el-radio>
            <el-radio :label="1" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-center">
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle
          }}<span v-if="!isAdd">ID: {{ A_EForm.roleId }}</span></el-button
        >
      </div>
    </el-dialog>
    <!-- 授权用户抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      direction="rtl"
      size="50%"
      class="bg-body-secondary rounded-start-5"
      :before-close="closeConfirm">
      <template #header>
        <div class="d-flex align-items-center">
          <span class="text-body">{{ `为'${drawerTitle}'授权用户` }}</span>
          <el-button
            @click="revokeUserFun"
            class="ms-3"
            :disabled="revokeUserSelectList.length == 0"
            :loading="loading"
            >确认授权{{ revokeUserSelectList.length }}个用户</el-button
          >
        </div>
      </template>
      <el-table
        :data="UnallocatedList"
        empty-text="暂无用户未授权"
        table-layout="auto"
        header-cell-class-name="text-center"
        row-class-name="bg-body"
        cell-class-name="text-center"
        class="bg-body rounded-4"
        row-key="userId"
        @selection-change="revokeUserSelectionChange">
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
      </el-table>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
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
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import NestedScroll from "@better-scroll/nested-scroll";
  //嵌套滚动
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //bs类型
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { roleType, userType } from "@/type";
  import { ElMessage, FormInstance, TableInstance } from "element-plus";
  import { cloneDeep } from "lodash";
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";

  //修改主题-----------------------------------------
  const { darkTheme } = storeToRefs(useDarkThemeStore());
  //获取数据-----------------------
  const roleList = ref<roleType[]>();
  const loading = ref(false);
  const getFun = async () => {
    loading.value = true;
    const res = await getRoleList();
    console.log("获取的角色列表=>", res);
    roleList.value = res.data;
    loading.value = false;
  };
  getFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(NestedScroll);
  BScroll.use(ObserveDOM);
  const bsWrapper = ref();
  let bs: BScrollConstructor<{}>;
  const bsInners = ref<{ [key: number]: BScrollConstructor }>({}); //内层bs实例
  onMounted(() => {
    bs = new BScroll(bsWrapper.value, {
      scrollbar: true,
      mouseWheel: true,
      nestedScroll: {
        groupId: 1, // string or number
      },
      observeDOM: true,
    });
  });
  const expandChangeFun = async (row: roleType, expandedRows: roleType[]) => {
    // 如果是展开就重载数据
    loading.value = true; //禁止操作,以防在一次性重载大量数据时页面卡顿,而多次点击展开收起
    if (expandedRows.includes(row))
      getAllocatedListFun(row.roleId!, Boolean(row.userList));
    else {
      bsInners.value[row.roleId!]?.destroy();
      loading.value = false;
    }
  };

  //表格点击回调-------------
  const cellClickFun = (
    row: roleType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      toEdit(row.roleId!, !Boolean(row.menuTreeList));
    if (event.target.className.includes("bi-trash"))
      delFun(row.roleId!, row.roleName);
  };

  //表单----------------------
  const A_EFormRef = ref<FormInstance>();
  const defaultE_EInfo: roleType = {
    roleName: "",
    businessId: "",
    companyCheckStrictly: false,
    dataScope: 5,
    menuCheckStrictly: false,
    remark: "",
    roleSort: 0,
    status: 0,
    menuIds: [],
  };
  let A_EForm = reactive(defaultE_EInfo);
  const A_ERules = reactive({
    roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    roleKey: [{ required: true, message: "请输入权限字符", trigger: "blur" }],
  });

  //dialog对话框-----------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加角色");
  const isAdd = ref(true);
  const closeConfirmTitle = ref("");
  const closeConfirm = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };

  //添加/修改角色-----------------------
  const toAdd = async () => {
    A_EForm = reactive(cloneDeep(defaultE_EInfo));
    if (!A_EForm.menuTreeList) {
      const res = await getMenuTreeList();
      if (res.code == 200) {
        console.log("获取的菜单树=>", res.data);
        A_EForm.menuTreeList = res.data;
      }
    }
    isAdd.value = true;
    A_ETitle.value = closeConfirmTitle.value = "添加角色";
    A_EVisible.value = true;
  };
  const toEdit = async (id: number, needLoad: boolean) => {
    const index = roleList.value?.findIndex((i) => i.roleId == id);
    if (needLoad) {
      const res = await getRoleMenuTreeSelect(id);
      if (res.code == 200) {
        console.log(`id${id}的菜单树=>`, res.data);
        roleList.value![index!].menuTreeList = res.data.menus;
        roleList.value![index!].menuIds = res.data.checkedKeys;
      }
    }
    A_EForm = reactive(cloneDeep(roleList.value![index!]));
    isAdd.value = false;
    A_ETitle.value = closeConfirmTitle.value = "修改角色";
    A_EVisible.value = true;
  };
  const A_EFun = async () => {
    A_EFormRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAdd.value) res = await addRole(A_EForm);
        else res = await editRole(A_EForm);
        // console.log("添加/编辑角色结果=>", res);
        if (res.code == 200) {
          getFun();
          A_EVisible.value = false; //隐藏弹出框
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  // 删除角色---------------------------------
  const delFun = (roleId: number, roleName: string) => {
    elMessageBoxConfirm(`删除ID为 ${roleId} 的角色"${roleName}"`, async () => {
      const res = await delRole(roleId);
      if (res.code == 200) {
        ElMessage.success(`删除ID为 ${roleId} 的角色"${roleName}"成功`);
        getFun();
      }
    });
  };

  // 抽屉---------------------------------
  const drawerVisible = ref(false);
  const drawerTitle = ref("");
  const UnallocatedList = ref<userType[]>([]);
  const revokeUserSelectList = ref<(number | undefined)[]>([]);
  const revokeUserForRoleId = ref(-1);
  const revokeUserSelectionChange = (val: userType[]) => {
    revokeUserSelectList.value = val.map((i) => {
      return i.userId;
    });
  };

  //查询授权用户------------------------------
  const getAllocatedListFun = async (roleId: number, dontLoad?: boolean) => {
    if (!dontLoad) {
      const res = await getAllocatedList(roleId!);
      console.log(`ID${roleId}已挂载用户=>`, res);
      if (res.code === 200) {
        const index = roleList.value?.findIndex((i) => i.roleId === roleId);
        roleList.value![index!].userList = res.data;
      }
    }
    await nextTick();
    bsInners.value[roleId] = new BScroll(`#BSRef${roleId}`, {
      scrollbar: true,
      mouseWheel: true,
      nestedScroll: {
        groupId: 1, // string or number
      },
      observeDOM: true,
    });
    loading.value = false;
  };

  // 授权用户-----------------------------
  const revokeUserDrawer = async (roleId: number, roleName: string) => {
    drawerVisible.value = true;
    drawerTitle.value = roleName;
    revokeUserForRoleId.value = roleId;
    closeConfirmTitle.value = `为'${roleName}'授权用户`;
    const res = await getUnallocatedList(roleId);
    console.log(`'${roleName}'未分配用户=>`, res);
    UnallocatedList.value = res.data;
  };
  const revokeUserFun = async () => {
    loading.value = true;
    const res = await revokeUser(
      revokeUserForRoleId.value,
      revokeUserSelectList.value
    );
    if (res.code === 200) {
      ElMessage.success(`授权${revokeUserSelectList.value.length}个用户成功`);
      getAllocatedListFun(revokeUserForRoleId.value);
      drawerVisible.value = false;
    }
    loading.value = false;
  };

  // 取消授权用户----------------
  const userTableRefs = ref<{ [key: number]: TableInstance }>({});
  const cancelUserSelectionChange = (val: userType[], roleId: number) => {
    const index = roleList.value?.findIndex((i) => i.roleId === roleId);
    roleList.value![index!].selectList = val.map((i) => {
      return i.userId;
    });
  };
  const cancelUserFun = (roleId: number, user: userType) => {
    console.log("已授权用户的元素实例=>", userTableRefs.value[roleId]);
    userTableRefs.value[roleId].toggleRowSelection(user, true);
    const index = roleList.value?.findIndex((i) => i.roleId === roleId);
    elMessageBoxConfirm(
      `取消授权勾选的${roleList.value![index!].selectList?.length}个用户`,
      async () => {
        loading.value = true;
        const res = await cancelUser(
          roleId,
          roleList.value![index!].selectList!
        );
        if (res.code === 200) {
          ElMessage.success(
            `取消授权${roleList.value![index!].selectList?.length}个用户成功`
          );
          getAllocatedListFun(roleId);
        }
        loading.value = false;
      }
    );
  };
</script>
<style lang="scss">
  .el-drawer__header {
    margin-bottom: 0 !important;
    padding-bottom: var(--el-drawer-padding-primary) !important;
  }
  .el-drawer__body {
    padding-top: 0 !important;
  }
</style>

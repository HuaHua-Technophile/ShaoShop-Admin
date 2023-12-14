<template>
  <div class="w-100 h-100 p-3 position-relative">
    <div ref="roleListWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <div class="bg-body p-3 rounded-4">
          <div v-for="(i, index) in roleList">
            <el-descriptions :title="i.roleName">
              <template #extra>
                <fontIcon
                  icon="bi bi-pencil-square  fs-5 me-2"
                  role="button"
                  @click="editRoleDialog(i)" />
                <fontIcon
                  icon="bi bi-trash fs-5 text-danger"
                  role="button"
                  @click="delRoleFun(i.roleId!, i.roleName)" />
              </template>
              <el-descriptions-item label="角色ID">{{
                i.roleId
              }}</el-descriptions-item>
              <el-descriptions-item label="角色Key">{{
                i.roleKey || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="角色排序">{{
                i.roleSort || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="管理员">{{
                i.admin ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{
                i.status
              }}</el-descriptions-item>
              <el-descriptions-item label="所属商户id">{{
                i.businessId || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{
                i.createBy || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                i.createTime || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="最后更新者">{{
                i.updateBy || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="最后更新时间">{{
                i.updateTime || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="dataScope">{{
                i.createTime || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="是否严格校验菜单">{{
                i.menuCheckStrictly ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="是否严格校验商户">{{
                i.companyCheckStrictly ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{
                i.remark || "暂无"
              }}</el-descriptions-item>
            </el-descriptions>
            <el-divider v-if="index < roleList!.length - 1" />
          </div>
        </div>
      </div>
    </div>
    <!-- 增加角色悬浮按钮 -->
    <div
      class="AddBtn position-absolute end-0 bottom-0 me-4 mb-4 rounded-pill bg-success shadow d-flex align-items-center justify-content-center"
      style="width: 3rem; height: 3rem"
      role="button"
      @click="addRoleDialog">
      <fontIcon
        icon="bi bi-plus-circle "
        style="font-size: 1.5rem; text-shadow: 2px 2px 4px black" />
    </div>
    <!-- 添加/修改角色对话框 -->
    <!-- 添加/修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="roleDialogVisible"
      width="445px"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center>
      <el-form :model="roleInfoForm" ref="dialogFormRef" :rules="rules">
        <el-form-item label="角色称呼" prop="roleName">
          <el-input
            clearable
            v-model="roleInfoForm.roleName"
            placeholder="角色称呼"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
        <el-form-item label="对应商户" prop="businessId">
          <el-input
            clearable
            v-model="roleInfoForm.businessId"
            placeholder="商户ID"
            :prefix-icon="renderFontIcon('bi bi-shop-window')">
          </el-input>
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-input
            clearable
            v-model="roleInfoForm.dataScope"
            placeholder="数据范围"
            :prefix-icon="renderFontIcon('bi bi-shop-window')">
          </el-input>
        </el-form-item>
        <el-form-item label="角色排序" prop="roleSort">
          <el-input
            clearable
            v-model="roleInfoForm.roleSort"
            placeholder="角色排序"
            :prefix-icon="renderFontIcon('bi bi-sort-alpha-down')">
          </el-input>
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input
            clearable
            v-model="roleInfoForm.remark"
            placeholder="角色备注"
            :prefix-icon="renderFontIcon('bi bi-bookmark')">
          </el-input>
        </el-form-item>
        <el-form-item label="是否管理" style="padding-left: 10.18px">
          <el-radio-group v-model="roleInfoForm.admin">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验商户" style="padding-left: 10.18px">
          <el-radio-group v-model="roleInfoForm.companyCheckStrictly">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验菜单" style="padding-left: 10.18px">
          <el-radio-group v-model="roleInfoForm.menuCheckStrictly">
            <el-radio :label="true" size="large">是</el-radio>
            <el-radio :label="false" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色状态" style="padding-left: 10.18px">
          <el-radio-group v-model="roleInfoForm.status">
            <el-radio :label="0" size="large">正常</el-radio>
            <el-radio :label="1" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-center">
        <el-button
          @click="addOrEditRoleFun(dialogFormRef)"
          :loading="waitAddOrEditRole"
          >确认{{ dialogTitle.slice(0, 2)
          }}<span v-if="!isAddRole"
            >ID: {{ roleInfoForm.roleId }}</span
          ></el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import {
    getRoleList,
    delRole,
    addRole,
    editRole,
  } from "@/api/RoleManagement";
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //bs类型
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { roleType } from "@/type";
  import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
  import { cloneDeep } from "lodash";

  //获取数据-----------------------
  const roleList = ref<roleType[]>();
  const getRoleListFun = async () => {
    let res = await getRoleList();
    console.log("获取的角色列表=>", res);
    roleList.value = res.data;
    await nextTick();
    bs?.refresh();
  };
  getRoleListFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const roleListWrapper = ref();
  let bs: BScrollConstructor<{}> | null = null;
  onMounted(() => {
    bs = new BScroll(roleListWrapper.value, {
      scrollbar: true,
      mouseWheel: true,
    });
  });

  //表单----------------------
  const dialogFormRef = ref<FormInstance>();
  const defaultRoleInfo: roleType = {
    roleName: "",
    admin: false,
    businessId: "",
    companyCheckStrictly: false,
    dataScope: "",
    menuCheckStrictly: false,
    remark: "",
    roleSort: "",
    status: 0,
  };
  let roleInfoForm = reactive(defaultRoleInfo);
  const rules = reactive({
    roleName: [
      { required: true, message: "请输入角色名称", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
  });

  //dialog对话框-----------------
  const roleDialogVisible = ref(false);
  const dialogTitle = ref("添加角色");
  const waitAddOrEditRole = ref(false);
  const isAddRole = ref(true);
  let closeConfirm = (done: () => void) => {
    ElMessageBox.confirm(`确认放弃${dialogTitle.value}吗?所填内容将会清空`, {
      confirmButtonText: "是的",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
      customClass: "rounded",
    })
      .then(() => {
        done();
        // dialogFromRef.value?.resetFields();
        // dialogFromRef.value?.clearValidate();
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

  //添加/修改角色-----------------------
  const addRoleDialog = () => {
    roleInfoForm = reactive(cloneDeep(defaultRoleInfo));
    isAddRole.value = true;
    roleDialogVisible.value = true;
    dialogTitle.value = "添加角色";
  };
  const editRoleDialog = (role: roleType) => {
    roleInfoForm = reactive(cloneDeep(role));
    roleDialogVisible.value = true;
    isAddRole.value = false;
    dialogTitle.value = "修改角色";
  };
  const addOrEditRoleFun = async (dialogFromRef: FormInstance | undefined) => {
    // 先进行表单验证
    if (!dialogFromRef) return;
    await dialogFromRef.validate(async (valid, fields) => {
      if (valid) {
        waitAddOrEditRole.value = true;
        let res;
        if (isAddRole.value) res = await addRole(roleInfoForm);
        else res = await editRole(roleInfoForm);
        console.log(res);
        if (res.code == 200) {
          getRoleListFun();
          //  .value = false; //隐藏弹出框
        } else {
          ElMessage.error(res.message);
        }
        waitAddOrEditRole.value = false;
      } else console.log("error submit!", fields);
    });
  };

  // 删除角色
  const delRoleFun = (roleId: number, roleName: string) => {
    ElMessageBox.confirm(`确认删除ID为 ${roleId} 的角色"${roleName}"吗?`, {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
      customClass: "rounded",
    })
      .then(async () => {
        let res = await delRole(roleId);
        if (res.code == 200) {
          ElMessage.success(res.message);
          getRoleListFun();
        } else ElMessage.error(res.message);
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
</script>
<style lang="scss" scoped>
  .AddBtn {
    & > * {
      transition: all 0.5s;
    }
    &:hover {
      & > * {
        transform: rotate(90deg) scale(1.3) !important;
      }
    }
  }
</style>

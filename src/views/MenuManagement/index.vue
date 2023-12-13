<template>
  <div class="p-3 w-100 h-100">
    <div ref="menuListWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <el-table
          :data="menuList"
          table-layout="auto"
          header-cell-class-name="text-center text-body"
          row-class-name="bg-body"
          cell-class-name="text-center"
          class="bg-body rounded-4"
          empty-text="查询菜单异常"
          row-key="menuId"
          :expand-row-keys="[1]"
          @cell-click="cellClickFun"
          @expand-change="expandChangeFun">
          <!-- 外层表格扩展 -->
          <el-table-column type="expand">
            <template #default="props">
              <div>
                <div class="d-flex flex-wrap justify-content-between px-3">
                  <div>最后更新者：{{ props.row.updateBy }}</div>
                  <div>更新时间：{{ props.row.updateTime }}</div>
                  <div>路径：{{ props.row.path }}</div>
                  <div>组件路径：{{ props.row.component }}</div>
                  <div>商户是否可见：{{ props.row.isBusinessVisible }}</div>
                  <div>isCache：{{ props.row.isCache }}</div>
                  <div>权限标识：{{ props.row.perms }}</div>
                  <div>路由参数：{{ props.row.query }}</div>
                  <div class="col-12">备注：{{ props.row.remark }}</div>
                </div>
                <!-- 内层表格 -->
                <div v-if="props.row.children.length > 0" class="px-3">
                  <h5>子菜单({{ props.row.children.length }})</h5>
                  <div>
                    <el-table
                      :data="props.row.children"
                      table-layout="auto"
                      header-cell-class-name="text-center text-body"
                      :header-cell-style="{
                        background:
                          'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                      }"
                      :row-class-name="
                        darkTheme ? 'bg-black' : 'bg-body-secondary'
                      "
                      cell-class-name="text-center"
                      class="bg-body rounded-4 border-start border-end"
                      row-key="menuId"
                      @cell-click="cellClickFun"
                      @expand-change="expandChangeFun">
                      <!-- 内层表格扩展 -->
                      <el-table-column type="expand">
                        <template #default="props2">
                          <div
                            class="d-flex flex-wrap justify-content-between px-3">
                            <div>最后更新者：{{ props2.row.updateBy }}</div>
                            <div>更新时间：{{ props2.row.updateTime }}</div>
                            <div>路径：{{ props2.row.path }}</div>
                            <div>组件路径：{{ props2.row.component }}</div>
                            <div>
                              商户是否可见：{{ props2.row.isBusinessVisible }}
                            </div>
                            <div>isCache：{{ props2.row.isCache }}</div>
                            <div>权限标识：{{ props2.row.perms }}</div>
                            <div>路由参数：{{ props2.row.query }}</div>
                            <div class="col-12">
                              备注：{{ props2.row.remark }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="ID" prop="menuId" />
                      <el-table-column label="菜单名称" prop="menuName" />
                      <el-table-column label="图标">
                        <template #default="scope">
                          <!-- effect="light/dark"是反过来的  -->
                          <el-tooltip
                            effect="light"
                            :offset="0"
                            :content="scope.row.icon"
                            placement="right">
                            <div>
                              <FontIcon :icon="scope.row.icon" />
                            </div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column label="排序" prop="orderNum" />
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
                      <el-table-column prop="visible" label="显/隐">
                        <template #default="scope">
                          <span
                            :class="[
                              'rounded-1 border px-1',
                              scope.row.visible == 0
                                ? 'border-success text-success'
                                : 'border-2 text-body-secondary',
                            ]">
                            {{ scope.row.visible == 0 ? "显示" : "隐藏" }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="isFrame" label="是否外链">
                        <template #default="scope">
                          <span
                            :class="[
                              'rounded-1 border px-1',
                              scope.row.isFrame == 0
                                ? 'border-success text-success'
                                : 'border-2 text-body-secondary',
                            ]">
                            {{ scope.row.isFrame == 0 ? "是" : "否" }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="menuType" label="类型">
                        <template #default="scope">
                          <span
                            :class="[
                              'rounded-1 border  px-1',
                              scope.row.menuType == 'M'
                                ? 'border-primary text-primary-emphasis'
                                : scope.row.menuType == 'C'
                                ? 'border-warning text-warning-emphasis'
                                : 'border-2 text-body-secondary',
                            ]">
                            {{
                              scope.row.menuType == "M"
                                ? "目录"
                                : scope.row.menuType == "C"
                                ? "菜单"
                                : "按钮"
                            }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column label="创建者" prop="createBy" />
                      <el-table-column label="创建时间" prop="createTime" />
                      <el-table-column label="删改">
                        <template #default>
                          <fontIcon
                            icon="bi bi-pencil-square  fs-6 me-2"
                            role="button" />
                          <fontIcon
                            icon="bi bi-trash fs-6 text-danger"
                            role="button" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="menuId" />
          <el-table-column label="菜单名称" prop="menuName" />
          <el-table-column label="图标">
            <template #default="scope">
              <!-- effect="light/dark"是反过来的  -->
              <el-tooltip
                effect="light"
                :offset="0"
                :content="scope.row.icon"
                placement="right">
                <div>
                  <FontIcon :icon="scope.row.icon" />
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="orderNum" />
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
          <el-table-column prop="visible" label="显/隐">
            <template #default="scope">
              <span
                :class="[
                  'rounded-1 border px-1',
                  scope.row.visible == 0
                    ? 'border-success text-success'
                    : 'border-2 text-body-secondary',
                ]">
                {{ scope.row.visible == 0 ? "显示" : "隐藏" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="isFrame" label="是否外链">
            <template #default="scope">
              <span
                :class="[
                  'rounded-1 border px-1',
                  scope.row.isFrame == 0
                    ? 'border-success text-success'
                    : 'border-2 text-body-secondary',
                ]">
                {{ scope.row.isFrame == 0 ? "是" : "否" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="menuType" label="类型">
            <template #default="scope">
              <span
                :class="[
                  'rounded-1 border  px-1',
                  scope.row.menuType == 'M'
                    ? 'border-primary text-primary-emphasis'
                    : scope.row.menuType == 'C'
                    ? 'border-warning text-warning-emphasis'
                    : 'border-2 text-body-secondary',
                ]">
                {{
                  scope.row.menuType == "M"
                    ? "目录"
                    : scope.row.menuType == "C"
                    ? "菜单"
                    : "按钮"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop="createBy" />
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column>
            <template #header>
              <el-button :loading="waitAddMenu" @click="addMenuDialog"
                >添加菜单</el-button
              >
            </template>
            <template #default>
              <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
              <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加/修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="menuDialogVisible"
      width="445px"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center>
      <el-form :model="menuInfoForm" ref="dialogFromRef" :rules="rules">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            clearable
            v-model="menuInfoForm.menuName"
            placeholder="在左侧导航与顶部导航显示"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input
            clearable
            v-model="menuInfoForm.path"
            placeholder="路由地址"
            :prefix-icon="renderFontIcon('bi bi-geo-alt')">
          </el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-input
            clearable
            v-model="menuInfoForm.parentId"
            placeholder="挂靠的父级菜单id"
            :prefix-icon="renderFontIcon('bi bi-diagram-3')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model="menuInfoForm.icon"
            placeholder="BSicon/FontAwesome支持,请填入class类名"
            :prefix-icon="renderFontIcon('fa-solid fa-icons')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="菜单排序"
          prop="orderNum"
          style="padding-left: 10.18px">
          <el-input-number
            v-model="menuInfoForm.orderNum"
            :min="0"
            :max="999" />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="menuType"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="menuInfoForm.menuType">
            <el-radio label="M" size="large">目录</el-radio>
            <el-radio label="C" size="large">菜单</el-radio>
            <el-radio label="F" size="large">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="status"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="menuInfoForm.status">
            <el-radio :label="0" size="large">正常</el-radio>
            <el-radio :label="1" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="菜单显隐"
          prop="visible"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="menuInfoForm.visible">
            <el-radio :label="0" size="large">显示</el-radio>
            <el-radio :label="1" size="large">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否外链"
          prop="isFrame"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="menuInfoForm.isFrame">
            <el-radio :label="0" size="large">是</el-radio>
            <el-radio :label="1" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-center">
        <el-button
          v-if="dialogTitle == '添加菜单'"
          @click="addMenuFun(dialogFromRef)"
          :loading="waitAddMenu"
          >确认添加</el-button
        >
        <el-button
          v-else
          @click="editMenuFun(dialogFromRef)"
          :loading="waitAddMenu"
          >确认修改菜单 ID:{{ menuInfoForm.menuId }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import {
    getMenuList,
    addMenu,
    editMenu,
    delMenu,
  } from "@/api/MenuManagementAPI";
  import { roleMenuType } from "@/type/index";
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
  import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { cloneDeep } from "lodash";
  //修改主题-------------------------------------------------
  let { darkTheme } = storeToRefs(useDarkThemeStore());
  //获取菜单-----------------------
  const menuList = ref<roleMenuType[]>();
  const getMenuListFun = async () => {
    let res = await getMenuList();
    console.log("获取菜单列表", res);
    menuList.value = res.data;
    await nextTick();
    bs?.refresh();
  };
  getMenuListFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const menuListWrapper = ref();
  let bs: BScrollConstructor<{}> | null = null;
  onMounted(() => {
    bs = new BScroll(menuListWrapper.value, {
      scrollbar: true,
      mouseWheel: true,
    });
  });
  let timeOutArr: NodeJS.Timeout[] = [];
  const expandChangeFun = async () => {
    timeOutArr.push(
      setTimeout(() => {
        bs?.refresh();
      }, 150)
    );
  };
  onUnmounted(() => {
    timeOutArr.forEach((i) => {
      clearTimeout(i);
    });
  });
  //dialog弹出框--------------------
  const menuDialogVisible = ref(false);
  const dialogTitle = ref("添加菜单");
  // const isAddMenu = ref(true);
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

  // dialog表单---------------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultMenuInfo: roleMenuType = {
    icon: "", // 菜单图标
    isFrame: 1, //是否为外链（0是 1否）
    menuName: "", //菜单名称
    menuType: "C", //菜单类型（M目录 C菜单 F按钮）
    orderNum: 0, //显示排序
    parentId: 0, //父菜单Id
    path: "", //路由地址
    status: 0, //菜单状态（0正常 1停用）
    visible: 0, //菜单状态（0显示 1隐藏）
  };
  let menuInfoForm = reactive(defaultMenuInfo);
  const rules = reactive({
    menuName: [
      { required: true, message: "请输入菜单名称", trigger: "blur" },
      { min: 0, max: 6, message: "长度在6位以内", trigger: "blur" },
    ],
    path: [
      { required: true, message: "请输入路由地址", trigger: "blur" },
      { min: 0, max: 30, message: "长度在30位以内", trigger: "blur" },
    ],
    parentId: [
      {
        required: true,
        message: "请输入父菜单id(默认0表示挂靠根目录)",
        trigger: "blur",
      },
    ],
  });

  //添加菜单------------------------
  const waitAddMenu = ref(false);
  const addMenuDialog = () => {
    /* menuInfoForm.icon = ""; // 菜单图标
      menuInfoForm.isFrame = 1; //是否为外链（0是 1否）
      menuInfoForm.menuName = ""; //菜单名称
      menuInfoForm.menuType = "C"; //菜单类型（M目录 C菜单 F按钮）
      menuInfoForm.orderNum = 0; //显示排序
      menuInfoForm.parentId = 0; //父菜单Id
      menuInfoForm.path = ""; //路由地址
      menuInfoForm.status = 0; //菜单状态（0正常 1停用）
      menuInfoForm.visible = 0; //菜单状态（0显示 1隐藏） */
    menuInfoForm = reactive(defaultMenuInfo);
    menuDialogVisible.value = true;
    dialogTitle.value = "添加菜单";
  };
  const addMenuFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitAddMenu.value = true;
        let res = await addMenu(menuInfoForm); //menuInfoForm里暂时不包含id
        /* code500
            message: "修改菜单失败，菜单已存在" */
        console.log(res);
        if (res.code == 200) {
        } else {
          ElMessage.error(res.message);
        }
        waitAddMenu.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //表格点击回调-------------
  let cellClickFun = async (
    row: roleMenuType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      editMenuDialog(row);
    if (event.target.className.includes("bi-trash"))
      delMenuFun(row.menuId!, row.menuName);
  };

  // 修改菜单
  const waitEditMenu = ref(false);
  const editMenuDialog = (menu: roleMenuType) => {
    menuInfoForm = reactive(cloneDeep(menu));
    menuDialogVisible.value = true;
    dialogTitle.value = "修改菜单";
  };

  const editMenuFun = async (formEl: FormInstance | undefined) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitEditMenu.value = true;
        let res = await editMenu(menuInfoForm);
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
        waitEditMenu.value = false;
      } else console.log("error submit!", fields);
    });
  };

  // 删除菜单
  const delMenuFun = (menuId: number, menuName: string) => {
    ElMessageBox.confirm(`确认删除ID为 ${menuId} 的菜单"${menuName}"吗?`, {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
      customClass: "rounded",
    })
      .then(async () => {
        let res = await delMenu(menuId);
        if (res.code == 200) ElMessage.success(res.message);
        else ElMessage.error(res.message);
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
</script>
<style lang="scss">
  .el-table__placeholder {
    display: none !important; //消除element表格中奇怪的占位元素，倒是ID那一栏被挤向右侧
  }
</style>

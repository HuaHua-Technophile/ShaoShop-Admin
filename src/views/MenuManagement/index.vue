<template>
  <div class="p-3 w-100 h-100">
    <!-- 菜单列表 -->
    <div ref="bsWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <el-table
          v-loading="loading"
          :data="menuList"
          table-layout="auto"
          header-cell-class-name="text-center text-body"
          row-key="menuId"
          row-class-name="bg-body"
          cell-class-name="text-center"
          class="bg-body rounded-4"
          empty-text="查询菜单异常"
          @cell-click="cellClickFun">
          <!-- 外层表格扩展 -->
          <el-table-column type="expand">
            <template #default="props">
              <div>
                <!-- 其他菜单信息 -->
                <div
                  class="d-flex align-items-center flex-wrap justify-content-between px-3">
                  <div>组件路径：{{ props.row.component }}</div>
                  <div class="d-flex align-items-center">
                    商户是否可见：
                    <el-tag
                      :type="props.row.status == 0 ? 'success' : 'danger'"
                      >{{ props.row.status == 0 ? "是" : "否" }}</el-tag
                    >
                  </div>
                  <div>isCache：{{ props.row.isCache }}</div>
                  <div>权限标识：{{ props.row.perms }}</div>
                  <div>路由参数：{{ props.row.query }}</div>
                </div>
                <!-- 内层表格 -->
                <div v-if="props.row.children.length > 0" class="px-3">
                  <h5>子菜单({{ props.row.children.length }})</h5>
                  <div>
                    <el-table
                      :data="props.row.children"
                      table-layout="auto"
                      class="bg-body rounded-4 border-start border-end"
                      header-cell-class-name="text-center text-body"
                      :header-cell-style="{
                        background:
                          'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                      }"
                      row-key="menuId"
                      :row-class-name="
                        darkTheme ? 'bg-black' : 'bg-body-secondary'
                      "
                      cell-class-name="text-center"
                      @cell-click="cellClickFun">
                      <!-- 内层表格扩展 -->
                      <el-table-column type="expand">
                        <template #default="props2">
                          <div
                            class="d-flex flex-wrap justify-content-between px-3">
                            <div>组件路径：{{ props2.row.component }}</div>
                            <div class="d-flex align-items-center">
                              商户是否可见：
                              <el-tag
                                :type="
                                  props2.row.status == 0 ? 'success' : 'danger'
                                "
                                >{{
                                  props.row.status == 0 ? "是" : "否"
                                }}</el-tag
                              >
                            </div>
                            <div>isCache：{{ props2.row.isCache }}</div>
                            <div>权限标识：{{ props2.row.perms }}</div>
                            <div>路由参数：{{ props2.row.query }}</div>
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
                          <el-tag
                            :type="scope.row.status == 0 ? 'success' : 'danger'"
                            >{{
                              scope.row.status == 0 ? "正常" : "停用"
                            }}</el-tag
                          >
                        </template>
                      </el-table-column>
                      <el-table-column prop="visible" label="显/隐">
                        <template #default="scope">
                          <el-tag
                            :type="
                              scope.row.visible == 0 ? 'success' : 'warning'
                            "
                            >{{
                              scope.row.visible == 0 ? "显示" : "隐藏"
                            }}</el-tag
                          >
                        </template>
                      </el-table-column>
                      <el-table-column prop="isFrame" label="是否外链">
                        <template #default="scope">
                          <el-tag
                            :type="scope.row.isFrame == 0 ? 'success' : 'info'"
                            >{{ scope.row.isFrame == 0 ? "是" : "否" }}</el-tag
                          >
                        </template>
                      </el-table-column>
                      <el-table-column prop="menuType" label="类型">
                        <template #default="scope">
                          <el-tag
                            effect="dark"
                            :type="
                              scope.row.menuType == 'M'
                                ? ''
                                : scope.row.menuType == 'C'
                                ? 'success'
                                : 'danger'
                            "
                            >{{
                              scope.row.menuType == "M"
                                ? "目录"
                                : scope.row.menuType == "C"
                                ? "菜单"
                                : "按钮"
                            }}</el-tag
                          >
                        </template>
                      </el-table-column>
                      <el-table-column prop="path" label="路径">
                        <template #default="scope">
                          <el-tooltip
                            :content="scope.row.path"
                            effect="light"
                            placement="left">
                            <el-text style="max-width: 100px" truncated>
                              {{ scope.row.path }}
                            </el-text>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column label="更新者" prop="updateBy" />
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
              <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                scope.row.status == 0 ? "正常" : "停用"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="visible" label="显/隐">
            <template #default="scope">
              <el-tag :type="scope.row.visible == 0 ? 'success' : 'warning'">{{
                scope.row.visible == 0 ? "显示" : "隐藏"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isFrame" label="是否外链">
            <template #default="scope">
              <el-tag :type="scope.row.isFrame == 0 ? 'success' : 'info'">{{
                scope.row.isFrame == 0 ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="menuType" label="类型">
            <template #default="scope">
              <el-tag
                effect="dark"
                :type="
                  scope.row.menuType == 'M'
                    ? ''
                    : scope.row.menuType == 'C'
                    ? 'success'
                    : 'danger'
                "
                >{{
                  scope.row.menuType == "M"
                    ? "目录"
                    : scope.row.menuType == "C"
                    ? "菜单"
                    : "按钮"
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路径">
            <template #default="scope">
              <el-tooltip
                :content="scope.row.path"
                effect="light"
                placement="left">
                <el-text style="max-width: 100px" truncated>
                  {{ scope.row.path }}
                </el-text>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="更新者" prop="updateBy" />
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
              <el-button @click="toAdd">添加菜单</el-button>
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
      :title="A_ETitle"
      v-model="A_EVisible"
      width="445px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <el-form :model="A_EForm" ref="A_EFormRef" :rules="A_ERules">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="A_EForm.menuName"
            placeholder="在左侧导航与顶部导航显示(建议4字)"
            :prefix-icon="renderFontIcon('fa-solid fa-quote-left')">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input
            clearable
            maxlength="30"
            v-model.trim="A_EForm.path"
            placeholder="路由地址"
            :prefix-icon="renderFontIcon('fa-solid fa-code')">
          </el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-input
            clearable
            maxlength="12"
            v-model.trim="A_EForm.parentId"
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
            v-model.trim="A_EForm.icon"
            placeholder="BSicon/FontAwesome支持,请填入class类名"
            :prefix-icon="renderFontIcon('fa-solid fa-icons')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="菜单排序"
          prop="orderNum"
          style="padding-left: 10.18px">
          <el-input-number v-model="A_EForm.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="menuType"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="A_EForm.menuType">
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
          <el-radio-group v-model="A_EForm.status">
            <el-radio :label="0" size="large">正常</el-radio>
            <el-radio :label="1" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="菜单显隐"
          prop="visible"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="A_EForm.visible">
            <el-radio :label="0" size="large">显示</el-radio>
            <el-radio :label="1" size="large">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否外链"
          prop="isFrame"
          class="d-flex align-items-center"
          style="padding-left: 10.18px">
          <el-radio-group v-model="A_EForm.isFrame">
            <el-radio :label="0" size="large">是</el-radio>
            <el-radio :label="1" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="d-flex justify-content-center">
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle
          }}<span v-if="!isAdd">ID: {{ A_EForm.menuId }}</span></el-button
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
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //bs类型
  import ObserveDOM from "@better-scroll/observe-dom";
  import { onMounted, reactive, ref } from "vue";
  import { ElMessage, FormInstance } from "element-plus";
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  //修改主题------------------------------------------
  const { darkTheme } = storeToRefs(useDarkThemeStore());
  //获取菜单-----------------------
  const loading = ref(false);
  const menuList = ref<roleMenuType[]>();
  const getFun = async () => {
    loading.value = true;
    let res = await getMenuList();
    console.log("获取菜单列表=>", res);
    menuList.value = res.data;
    loading.value = false;
  };
  getFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const bsWrapper = ref();
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(bsWrapper.value, {
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
  });

  //表格点击回调-------------
  const cellClickFun = async (
    row: roleMenuType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square")) toEdit(row);
    if (event.target.className.includes("bi-trash"))
      delFun(row.menuId!, row.menuName);
  };

  // 表单---------------------
  const A_EFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultA_EInfo: roleMenuType = {
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
  let A_EForm = reactive(defaultA_EInfo);
  const A_ERules = reactive({
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
    parentId: [
      {
        required: true,
        message: "请输入父菜单id(默认0表示挂靠根目录)",
        trigger: "blur",
      },
    ],
  });

  //dialog弹出框--------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加菜单");
  const isAdd = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };

  //添加/修改菜单------------------------
  const toAdd = () => {
    A_EForm = reactive(cloneDeep(defaultA_EInfo));
    A_EVisible.value = true;
    isAdd.value = true;
    A_ETitle.value = "添加菜单";
  };
  const toEdit = (menu: roleMenuType) => {
    A_EForm = reactive(cloneDeep(menu));
    A_EVisible.value = true;
    isAdd.value = false;
    A_ETitle.value = "修改菜单";
  };
  const A_EFun = async () => {
    A_EFormRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAdd.value) res = await addMenu(A_EForm);
        else res = await editMenu(A_EForm);
        if (res.code == 200) {
          getFun();
          A_EVisible.value = false; //隐藏弹出框
          ElMessage.success(`${A_ETitle.value}成功`);
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  // 删除菜单
  const delFun = (menuId: number, menuName: string) => {
    elMessageBoxConfirm(`删除ID为 ${menuId} 的菜单"${menuName}"`, async () => {
      loading.value = true;
      let res = await delMenu(menuId);
      if (res.code == 200) {
        ElMessage.success(`删除ID为 ${menuId} 的菜单"${menuName}成功`);
        getFun();
      }
      loading.value = false;
    });
  };
</script>
<style lang="scss">
  .el-table__placeholder {
    display: none !important; //消除element表格中奇怪的占位元素，导致ID那一栏被挤向右侧
  }
</style>

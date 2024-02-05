<template>
  <div class="w-100 h-100">
    <!-- 菜单列表 -->
    <bsWrapper>
      <customTable
        v-model:loading="loading"
        :data="menuList"
        rowKey="menuId"
        emptyText="查询菜单异常"
        :hasUpdateBy="true"
        :hasUpdateTime="true"
        :hasRemark="true"
        v-model:A_EVisible="A_EVisible"
        v-model:isAdd="isAdd"
        v-model:A_ETitle="A_ETitle"
        A_E_Dkeyword="菜单"
        @toAdd="toAdd"
        @toEdit="toEdit"
        :delFun="delMenu"
        delName="menuName"
        delId="menuId"
        :reQueryFun="queryFun">
        <!-- 外层表格扩展 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="px-3">
              <OtherInfo :props="props" />
              <!-- 内层表格 -->
              <template v-if="props.row.children.length > 0">
                <h5>子菜单({{ props.row.children.length }})</h5>
                <customTable
                  :level="2"
                  v-model:loading="loading"
                  :data="menuList"
                  rowKey="menuId"
                  emptyText="查询菜单异常"
                  :hasUpdateBy="true"
                  :hasUpdateTime="true"
                  :hasRemark="true"
                  v-model:A_EVisible="A_EVisible"
                  v-model:isAdd="isAdd"
                  v-model:A_ETitle="A_ETitle"
                  A_E_Dkeyword="菜单"
                  @toAdd="toAdd"
                  @toEdit="toEdit"
                  :delFun="delMenu"
                  delId="menuId"
                  delName="menuName">
                  <!-- 内层表格扩展 -->
                  <el-table-column type="expand">
                    <template #default="props2">
                      <OtherInfo :props="props2" />
                    </template>
                  </el-table-column>
                  <MenuTabelColumn />
                </customTable>
              </template>
            </div>
          </template>
        </el-table-column>
        <MenuTabelColumn />
      </customTable>
    </bsWrapper>
    <!-- 添加/修改弹窗 -->
    <A_EDialog
      v-model:A_EVisible="A_EVisible"
      v-model:loading="loading"
      :A_ETitle="A_ETitle"
      :isAdd="isAdd"
      :id="A_EForm.menuId"
      :A_EForm="A_EForm"
      :A_ERules="A_ERules"
      :A_EFormInput="A_EFormInput"
      :addFun="addMenu"
      :editFun="editMenu"
      :reQueryFun="queryFun">
      <el-form-item
        label="菜单排序"
        prop="orderNum"
        style="padding-left: 10.18px"
        class="mb-0">
        <el-input-number v-model="A_EForm.orderNum" :min="0" :max="999" />
      </el-form-item>
      <el-form-item
        label="菜单类型"
        prop="menuType"
        class="d-flex align-items-center mb-0"
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
        class="d-flex align-items-center mb-0"
        style="padding-left: 10.18px">
        <el-radio-group v-model="A_EForm.status">
          <el-radio :label="0" size="large">正常</el-radio>
          <el-radio :label="1" size="large">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="菜单显隐"
        prop="visible"
        class="d-flex align-items-center mb-0"
        style="padding-left: 10.18px">
        <el-radio-group v-model="A_EForm.visible">
          <el-radio :label="0" size="large">显示</el-radio>
          <el-radio :label="1" size="large">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="是否外链"
        prop="isFrame"
        class="d-flex align-items-center mb-0"
        style="padding-left: 10.18px">
        <el-radio-group v-model="A_EForm.isFrame">
          <el-radio :label="0" size="large">是</el-radio>
          <el-radio :label="1" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </A_EDialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    getMenuList,
    addMenu,
    editMenu,
    delMenu,
  } from "@/api/MenuManagementAPI";
  import { elInputItemInfoType, roleMenuType } from "@/type/index";
  import { reactive, ref } from "vue";
  import { cloneDeep } from "lodash";
  import { query } from "@/utils/query/query";
  import MenuTabelColumn from "./MenuTabelColumn.vue";
  import OtherInfo from "./OtherInfo.vue";

  //获取菜单-----------------------
  const loading = ref(false);
  const menuList = ref<roleMenuType[]>([]);
  const queryFun = query({
    loading: loading.value,
    queryStr: "菜单",
    data: menuList,
    queryFun: getMenuList,
  });
  queryFun();

  // A_E表单---------------------
  const isAdd = ref(true);
  const menuNameInput: elInputItemInfoType = {
    label: "菜单名称",
    prop: "menuName",
    maxlength: 30,
    placeholder: "在左侧导航与顶部导航显示(建议4字)",
    prefixIcon: "fa-solid fa-quote-left",
  };
  const pathInput: elInputItemInfoType = {
    label: "菜单路径",
    prop: "path",
    maxlength: 10,
    placeholder: "路由地址",
    prefixIcon: "fa-solid fa-code",
  };
  const parentIdInput: elInputItemInfoType = {
    label: "父级菜单",
    prop: "parentId",
    maxlength: 10,
    placeholder: "挂靠的父级菜单id",
    prefixIcon: "bi bi-diagram-3",
  };
  const iconInput: elInputItemInfoType = {
    label: "菜单图标",
    prop: "icon",
    placeholder: "BSicon/FontAwesome支持,请填入class类名",
    prefixIcon: "fa-solid fa-icons",
    notRequired: true,
  };
  const A_EFormInput: elInputItemInfoType[] = [
    menuNameInput,
    pathInput,
    parentIdInput,
    iconInput,
  ];
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
  const A_ERules = {
    menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
    parentId: [
      {
        required: true,
        message: "请输入父菜单id(默认0表示挂靠根目录)",
        trigger: "blur",
      },
    ],
  };

  //dialog弹出框--------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加菜单");

  //添加/修改菜单------------------------
  const toAdd = () => {
    A_EForm = reactive(cloneDeep(defaultA_EInfo));
  };
  const toEdit = (menu: roleMenuType) => {
    A_EForm = reactive(cloneDeep(menu));
  };
</script>

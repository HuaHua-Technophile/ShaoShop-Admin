<template>
  <div class="bg-body-secondary p-3 w-100 h-100">
    <div ref="menuListWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <el-table
        :data="menuList"
        header-cell-class-name="text-center"
        row-class-name="bg-body"
        cell-class-name="text-center"
        class="bg-body rounded-4"
        empty-text="查询菜单异常"
        row-key="menuId"
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <el-table-column type="expand">
          <template #default="props">
            <div>{{ props.row.menuId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" prop="menuName" />
        <el-table-column>
          <template #header>
            <el-button :loading="waitAddMenu" @click="addMenuFun"
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
    <el-dialog
      :title="dialogTitle"
      v-model="menuDialogVisible"
      width="400px"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center>
      <el-form :model="menuInfoForm" ref="dialogFromRef" :rules="rules">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            clearable
            v-model="menuInfoForm.menuName"
            placeholder="每个后台主体唯一名称"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { getMenuList } from "@/api/MenuManagementAPI";
  import { roleMenuType } from "@/type/index";
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
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

  //dialog弹出框--------------------
  const menuDialogVisible = ref(false);
  const dialogTitle = ref("添加菜单");
  const isAddMenu = ref(true);
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
  const menuInfoForm = reactive<roleMenuType>({
    icon: "",
    menuId: -1,
    menuName: "",
    menuType: "",
    orderNum: -1,
    path: "",
  });
  const rules = [
    {
      menuName: { required: true, message: "请输入菜单名称", trigger: "blur" },
    },
  ];
  //添加菜单------------------------
  const waitAddMenu = ref(false);
  const addMenuFun = () => {
    menuDialogVisible.value = true;
  };
</script>

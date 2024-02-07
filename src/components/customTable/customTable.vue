<template>
  <el-table
    v-loading="loading"
    ref="tableRef"
    :data="data"
    table-layout="auto"
    class="bg-body rounded-4"
    :class="level == 1 ? '' : 'border-top'"
    :header-cell-class-name="
      level == 1 ? 'text-center' : 'text-center text-body'
    "
    :header-cell-style="
      level == 1
        ? {}
        : { background: 'rgba(var(--bs-ShaoShop-rgb),0.4) !important' }
    "
    :row-key="rowKey"
    :row-class-name="
      level == 1 ? 'bg-body' : darkTheme ? 'bg-black' : 'bg-body-secondary'
    "
    cell-class-name="text-center"
    :empty-text="emptyText"
    @cell-click="cellClick"
    @selection-change="selectionChange"
    @expand-change="expandChange">
    <!-- 复选框 -->
    <el-table-column v-if="hasSelection" type="selection" width="30" />
    <el-table-column v-if="hasSerialNum" label="序号" type="index" width="55" />
    <slot></slot>
    <!-- 状态 -->
    <el-table-column v-if="hasStatus" prop="status" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
          scope.row.status == 0 ? "正常" : "停用"
        }}</el-tag>
      </template>
    </el-table-column>
    <!-- 更新者 -->
    <el-table-column v-if="hasUpdateBy" prop="updateBy" label="更新者" />
    <!-- 更新时间 -->
    <el-table-column v-if="hasUpdateTime" prop="updateTime" label="更新时间">
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
    <!-- 备注 -->
    <el-table-column v-if="hasRemark" prop="remark" label="备注">
      <template #default="scope">
        <el-tooltip :content="scope.row.remark" effect="light" placement="left">
          <el-text style="max-width: 80px" truncated>
            {{ scope.row.remark }}
          </el-text>
        </el-tooltip>
      </template>
    </el-table-column>
    <!-- 添加/编辑/删除 -->
    <el-table-column v-if="!hiddenA_E_D" :label="A_E_DTitle">
      <template #header v-if="!hiddenA">
        <el-button @click="toAdd" size="small"
          >添加{{ A_E_Dkeyword }}</el-button
        >
      </template>
      <template #default>
        <fontIcon
          v-if="!hiddenE"
          icon="bi bi-pencil-square  fs-6 me-2"
          role="button" />
        <fontIcon
          v-if="!hiddenD"
          icon="bi bi-trash fs-6 text-danger"
          role="button" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { delFun } from "@/api/instance";
  import { ElMessage, TableInstance } from "element-plus";
  import { ref } from "vue";
  import { storeToRefs } from "pinia";

  const { darkTheme } = storeToRefs(useDarkThemeStore());

  const A_EVisible = defineModel<boolean>("A_EVisible");
  const isAdd = defineModel<boolean>("isAdd");
  const A_ETitle = defineModel<string>("A_ETitle");
  const loading = defineModel<boolean>("loading");
  const props = withDefaults(
    defineProps<{
      level?: 1 | 2;
      data?: any[]; //data有可能在二级表格展开时,数据未及时加载完毕便传入undefined
      rowKey: string;
      emptyText: string;
      hasSelection?: boolean; //是否开启复选框
      selectionId?: string; //多选删除时,写入批量删除的唯一标识符|单选删除时,填入删除方法的传参
      hasSerialNum?: boolean; //是否开启 序号 列
      hasStatus?: boolean; //是否开启 状态 列
      hasUpdateBy?: boolean; //是否开启 更新者 列
      hasUpdateTime?: boolean; //是否开启 更新时间 列
      hasRemark?: boolean; //是否开启 备注 列
      hiddenA_E_D?: boolean; //是否隐藏最后一列添加/编辑/删除数据的按钮
      hiddenA?: boolean; //是否隐藏最后一列添加按钮
      A_E_DTitle?: string; //是否隐藏最后一列添加按钮
      hiddenE?: boolean; //是否隐藏最后一列编辑按钮
      hiddenD?: boolean; //是否隐藏最后一列删除按钮
      A_E_Dkeyword?: string; //删除/添加/编辑时的关键词
      delFun?: ReturnType<typeof delFun>;
      customDel?: boolean; //是否自定义删除函数
      delName?: string;
      reQueryFun?: () => void;
      expandChange?: () => void;
    }>(),
    { level: 1, emptyText: "表单查询异常" }
  );
  // 3.3+：另一种更简洁的语法 具名元组语法
  const emit = defineEmits<{
    toAdd: [cb: () => void];
    toEdit: [row: object, cb: () => void];
    customDelFun: [{ row?: object; idList?: number[]; ref?: any }];
  }>();

  //表格点击回调
  const cellClick = props.hiddenA_E_D
    ? () => {}
    : (
        row: object,
        _column: any,
        _cell: any,
        event: { target: HTMLElement }
      ) => {
        if (event.target.className.includes("bi-pencil-square")) toEdit(row);
        if (event.target.className.includes("bi-trash")) toDel(row);
      };

  //进入添加状态
  const toAdd = () => {
    emit("toAdd", () => {
      isAdd.value = true;
      A_ETitle.value = `添加${props.A_E_Dkeyword}`;
      A_EVisible.value = true;
    });
  };
  //进入编辑状态
  const toEdit = (row: object) => {
    emit("toEdit", row, () => {
      isAdd.value = false;
      A_ETitle.value = `编辑${props.A_E_Dkeyword}`;
      A_EVisible.value = true;
    });
  };

  const idList = defineModel<number[]>("idList"); //修改为defineModel,以便在外部父组件需要维护一个数组时,同步更新至父组件
  const selectionChange = props.hasSelection
    ? (val: any[]) => {
        idList.value = val.map((i) => i[props.selectionId!]);
      }
    : () => {};

  const tableRef = ref<TableInstance>();
  const toDel = (row: { [key: string]: any }) => {
    // 如果具有复选框,说明可以多选删除
    if (props.hasSelection) {
      tableRef.value?.toggleRowSelection(row, true);
      if (props.customDel) {
        emit("customDelFun", { row, idList: idList.value });
      } else {
        elMessageBoxConfirm(
          `删除勾选的${idList.value?.length}个${props.A_E_Dkeyword}`,
          async () => {
            loading.value = true;
            const res = await props.delFun!(idList.value);
            if (res.code == 200) {
              ElMessage.success(
                `删除勾选的${idList.value?.length}个${props.A_E_Dkeyword}成功`
              );
              if (props.reQueryFun) props.reQueryFun(); //重新请求数据进行用户列表渲染
            }

            loading.value = false;
          }
        );
      }
    }
    // 否则是单个删除
    else {
      elMessageBoxConfirm(
        `删除ID为 ${row[props.selectionId!]} 的${props.A_E_Dkeyword} "${
          row[props.delName!]
        }"`,
        async () => {
          loading.value = true;
          let res = await props.delFun!(row[props.selectionId!]);

          if (res.code == 200) {
            ElMessage.success(
              `删除ID为 ${row[props.selectionId!]} 的${props.A_E_Dkeyword}"${
                row[props.delName!]
              }"成功`
            );
            if (props.reQueryFun) props.reQueryFun(); //重新请求数据进行用户列表渲染
          }
          loading.value = false;
        }
      );
    }
  };
</script>

<style lang="scss">
  .el-table__placeholder {
    display: none !important; //消除element表格中奇怪的占位元素，导致ID那一栏被挤向右侧
  }
</style>

<template>
  <el-table
    v-loading="loading"
    ref="tableRef"
    :data="data"
    table-layout="auto"
    :class="level == 1 ? 'bg-body rounded-4' : level == 2 ? '' : ''"
    header-cell-class-name="text-center"
    :row-key="rowKey"
    :row-class-name="level == 1 ? 'bg-body' : level == 2 ? '' : ''"
    cell-class-name="text-center"
    :empty-text="emptyText"
    @cell-click="cellClick"
    @selection-change="selectionChange">
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
    <el-table-column v-if="!hiddenA_E">
      <template #header>
        <el-button @click="toAdd" size="small">添加账号</el-button>
      </template>
      <template #default>
        <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
        <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { delFun } from "@/api/instance";
  import { ElMessage, TableInstance } from "element-plus";
  import { ref } from "vue";

  const A_EVisible = defineModel<boolean>("A_EVisible");
  const isAdd = defineModel<boolean>("isAdd");
  const A_ETitle = defineModel<string>("A_ETitle");
  const loading = defineModel<boolean>("loading");

  const props = defineProps<{
    level: 1 | 2;
    // loading: boolean;
    data: any[];
    rowKey: string;
    emptyText: string;
    hasSelection?: boolean; //是否开启复选框
    delId?: string; //多选删除时,写入批量删除的唯一标识符
    hasSerialNum?: boolean; //是否开启序号
    hasStatus?: boolean; //是否开启序号
    hasUpdateBy?: boolean; //是否开启更新者
    hasUpdateTime?: boolean; //是否开启更新时间
    hasRemark?: boolean; //是否开启备注
    hiddenA_E?: boolean; //是否隐藏最后一列编辑/删除数据的按钮
    A_E_Dkeyword?: string; //删除/添加/编辑时的关键词
    delFun?: ReturnType<typeof delFun>;
    reQueryFun?: () => void;
  }>();
  // 3.3+：另一种更简洁的语法 具名元组语法
  const emit = defineEmits<{
    toAdd: [];
    toEdit: [row: object];
  }>();

  //表格点击回调
  const cellClick = props.hiddenA_E
    ? () => {}
    : (row: any, column: any, cell: any, event: { target: HTMLElement }) => {
        column;
        cell;
        if (event.target.className.includes("bi-pencil-square")) toEdit(row);
        if (event.target.className.includes("bi-trash")) toDel(row);
      };

  //进入添加状态
  const toAdd = () => {
    emit("toAdd");
    A_EVisible.value = true;
    isAdd.value = true;
    A_ETitle.value = `添加${props.A_E_Dkeyword}`;
  };
  //进入编辑状态
  const toEdit = (row: object) => {
    emit("toEdit", row);
    A_EVisible.value = true;
    isAdd.value = false;
    A_ETitle.value = `编辑${props.A_E_Dkeyword}`;
  };

  const idList = ref<{ [key: string]: any }[]>();
  const selectionChange = props.hasSelection
    ? (val: any[]) => {
        idList.value = val.map((i) => i[props.delId!]);
      }
    : () => {};

  const tableRef = ref<TableInstance>();
  const toDel = (row: object) => {
    // 如果具有复选框,说明可以多选删除
    if (props.hasSelection) {
      tableRef.value?.toggleRowSelection(row, true);
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
    // 否则是单个删除
    else {
    }
  };
</script>

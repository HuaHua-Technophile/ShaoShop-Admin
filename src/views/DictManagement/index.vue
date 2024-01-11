<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索用户/新建用户 -->
    <el-form
      :model="dictQueryFrom"
      ref="dictQueryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4">
      <el-form-item
        class="col-3 pe-3 flex-grow-1"
        label="字典名称"
        prop="dictName">
        <el-input
          clearable
          v-model="dictQueryFrom.dictName"
          placeholder="字典名称"
          :prefix-icon="renderFontIcon('fa-solid fa-quote-left')" />
      </el-form-item>
      <el-form-item
        class="col-3 pe-3 flex-grow-1"
        label="字典类型"
        prop="dictType">
        <el-input
          clearable
          v-model="dictQueryFrom.dictType"
          placeholder="字典类型"
          :prefix-icon="renderFontIcon('fa-solid fa-code')" />
      </el-form-item>
      <el-form-item class="flex-shrink-0 pe-3" label="字典状态" prop="status">
        <el-select
          v-model="dictQueryFrom.status"
          placeholder="正常/停用"
          clearable
          style="width: 113px">
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="waitQueryDict"
          @click="queryDictFun(dictQueryFromRef)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 字典列表 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="dictListWrapper"
        class="dictListWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            ref="dictTableRef"
            :data="allDictList"
            table-layout="auto"
            header-cell-class-name="text-center"
            row-class-name="bg-body"
            cell-class-name="text-center"
            class="bg-body rounded-4"
            empty-text="暂无符合查询条件的字典"
            row-key="dictName"
            @cell-click="cellClickFun"
            @expand-change="expandChangeFun">
            <!-- 外层表格扩展 -->
            <el-table-column type="expand">
              <template #default="props">
                <div class="px-3">
                  <el-table
                    :data="props.row.sysDictDataList"
                    table-layout="auto"
                    header-cell-class-name="text-center text-body"
                    :header-cell-style="{
                      background: 'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                    }"
                    :row-class-name="
                      darkTheme ? 'bg-black' : 'bg-body-secondary'
                    "
                    cell-class-name="text-center"
                    class="bg-body rounded-4"
                    row-key="dictId"
                    @cell-click="cellClickFun"
                    @expand-change="expandChangeFun"
                    empty-text="该字典下暂无数据,请添加">
                    <el-table-column label="序号" type="index" width="55" />
                    <el-table-column prop="dictCode" label="数据编码" />
                    <el-table-column prop="dictLabel" label="数据标签" />
                    <el-table-column prop="dictValue" label="数据键值" />
                    <el-table-column prop="dictSort" label="排序" />
                    <el-table-column prop="isDefault" label="是否默认" />
                    <el-table-column prop="listClass" label="listClass">
                      <template #default="scope">
                        <el-tooltip
                          :content="scope.row.listClass"
                          effect="light"
                          placement="left">
                          <el-text style="max-width: 100px" truncated>
                            {{ scope.row.listClass }}
                          </el-text>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cssClass" label="cssClass">
                      <template #default="scope">
                        <el-tooltip
                          :content="scope.row.cssClass"
                          effect="light"
                          placement="left">
                          <el-text style="max-width: 100px" truncated>
                            {{ scope.row.cssClass }}
                          </el-text>
                        </el-tooltip>
                      </template>
                    </el-table-column>
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
                          <el-text style="max-width: 100px" truncated>
                            {{ scope.row.remark }}
                          </el-text>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column>
                      <template #header>
                        <el-button @click="addDictDataDialog(props.row)"
                          >添加数据</el-button
                        >
                      </template>
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
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="dictId" label="ID" />
            <el-table-column prop="dictName" label="字典名称" />
            <el-table-column prop="dictType" label="类型值" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                  scope.row.status == 0 ? "正常" : "停用"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateBy" label="更新者" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column prop="remark" label="备注">
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.remark"
                  effect="light"
                  placement="left">
                  <el-text style="max-width: 100px" truncated>
                    {{ scope.row.remark }}
                  </el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-button @click="addDictDialog">添加字典</el-button>
              </template>
              <template #default>
                <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
                <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 添加/修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center
      width="400px">
      <!-- 字典类型表单 -->
      <el-form
        :model="dictInfoForm"
        ref="dictDialogFormRef"
        :rules="dictRules"
        v-if="isDict">
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            clearable
            v-model="dictInfoForm.dictName"
            placeholder="在选框外呈现给用户"
            :prefix-icon="renderFontIcon('fa-solid fa-quote-left')">
          </el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            clearable
            v-model="dictInfoForm.dictType"
            placeholder="在数据库中的标识"
            :prefix-icon="renderFontIcon('fa-solid fa-code')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="字典备注"
          prop="remark"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model="dictInfoForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 字典数据表单 -->
      <el-form
        :model="dictDataInfoForm"
        ref="dictDataDialogFormRef"
        :rules="dictDataRules"
        v-else>
        <el-form-item
          label="父级类型"
          prop="dictType"
          style="padding-left: 10.18px">
          <el-input
            clearable
            disabled
            v-model="dictDataInfoForm.dictType"
            :prefix-icon="renderFontIcon('fa-solid fa-code-fork')">
          </el-input>
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input
            clearable
            v-model="dictDataInfoForm.dictLabel"
            placeholder="字典数据呈现出的选项名称"
            :prefix-icon="renderFontIcon('fa-solid fa-tag')">
          </el-input>
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input
            clearable
            v-model="dictDataInfoForm.dictValue"
            placeholder="字典数据传递的值"
            :prefix-icon="renderFontIcon('bi bi-123')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="样式属性"
          prop="cssClass"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model="dictDataInfoForm.cssClass"
            placeholder="cssClass样式属性（其他样式扩展）"
            :prefix-icon="renderFontIcon('fa-brands fa-bootstrap')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="回显样式"
          prop="listClass"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model="dictDataInfoForm.listClass"
            placeholder="listClass 表格回显样式"
            :prefix-icon="renderFontIcon('fa-brands fa-bootstrap')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="数据备注"
          prop="remark"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model="dictDataInfoForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="选项排序"
          prop="dictSort"
          style="padding-left: 10.18px">
          <el-input-number
            v-model="dictDataInfoForm.dictSort"
            :min="0"
            :max="999" />
        </el-form-item>
      </el-form>
      <!-- 通用确认按钮 -->
      <div class="d-flex justify-content-center">
        <el-button
          @click="
            addOrEdit_DictOrDictDataFun(
              isDict ? dictDialogFormRef : dictDataDialogFormRef
            )
          "
          :loading="waitAddOrEdit"
          >确认{{ dialogTitle.slice(0, 2) }}
          <span v-if="!isAdd && isDict">ID: {{ dictInfoForm.dictId }}</span>
          <span v-if="!isAdd && !isDict"
            >Code: {{ dictDataInfoForm.dictCode }}</span
          >
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    getDictList,
    delDict,
    delDictData,
    addDict,
    editDict,
    addDictData,
    editDictData,
  } from "@/api/DictManagementAPI";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { nextTick, onMounted, reactive, ref, onUnmounted } from "vue";
  import { dictDataType, dictType } from "@/type/index";
  import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { cloneDeep } from "lodash";

  //修改主题-------------------------------------------------
  let { darkTheme } = storeToRefs(useDarkThemeStore());

  // 不传参数的情况下，就是获取所有字典。传参数的情况下可用作搜索
  let allDictList = ref<dictType[]>([]);
  const dictQueryFrom = reactive({
    dictName: "",
    dictType: "",
    status: null,
  });
  const getDictListFun = async () => {
    let res = await getDictList(dictQueryFrom);
    console.log("字典列表=>", res);
    allDictList.value = res.data.records;
    await nextTick();
    bs?.refresh();
  };
  getDictListFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const dictListWrapper = ref();
  let bs: BScrollConstructor<{}> | null = null;
  onMounted(() => {
    bs = new BScroll(dictListWrapper.value, {
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

  //表格点击回调-------------
  let cellClickFun = (
    row: dictType & dictDataType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (
      event.target.className.includes("bi-pencil-square") &&
      row.sysDictDataList
    )
      editDictDialog(row);
    if (
      event.target.className.includes("bi-pencil-square") &&
      !row.sysDictDataList
    )
      editDictDataDialog(row);
    if (event.target.className.includes("bi-trash") && row.sysDictDataList)
      delDictFun(row.dictId!, row.dictName);
    if (event.target.className.includes("bi-trash") && !row.sysDictDataList)
      delDictDataFun(row.dictCode!, row.dictLabel);
  };
  // 表单---------------------
  const dictDialogFormRef = ref<FormInstance>(); //表单实例
  const dictDataDialogFormRef = ref<FormInstance>(); //表单实例
  const defaultDictInfo: dictType = {
    dictName: "",
    dictType: "",
    remark: "",
  };
  const defaultDictDataInfo: dictDataType = {
    cssClass: "",
    dictLabel: "",
    dictSort: 0,
    dictType: "",
    dictValue: "",
    listClass: "",
    remark: "",
  };
  let dictInfoForm = reactive(defaultDictInfo);
  let dictDataInfoForm = reactive(defaultDictDataInfo);
  const dictRules = reactive({
    dictName: [
      { required: true, message: "请输入字典名称", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
    dictType: [
      { required: true, message: "请输入字典类型", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
  });
  const dictDataRules = reactive({
    dictLabel: [
      { required: true, message: "请输入字典数据标签", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
    dictValue: [
      { required: true, message: "请输入字典数据键值", trigger: "blur" },
      { min: 0, max: 12, message: "长度在12位以内", trigger: "blur" },
    ],
  });
  //dialog弹出框--------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("");
  const waitAddOrEdit = ref(false);
  const isAdd = ref(true);
  const isDict = ref(true);
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
        // dialogFormRef.value?.resetFields();
        // dialogFormRef.value?.clearValidate();
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

  //添加/修改字典类型/字典数据-----------------
  const addDictDialog = () => {
    dictInfoForm = reactive(cloneDeep(defaultDictInfo));
    dialogVisible.value = true;
    isAdd.value = true;
    isDict.value = true;
    dialogTitle.value = "添加字典类型";
  };
  const editDictDialog = (dict: dictType) => {
    dictInfoForm = reactive(cloneDeep(dict));
    dialogVisible.value = true;
    isAdd.value = false;
    isDict.value = true;
    dialogTitle.value = "修改字典类型";
  };
  const addDictDataDialog = (dict: dictType) => {
    let DictDataInfo = cloneDeep(defaultDictDataInfo);
    DictDataInfo.dictType = dict.dictType;
    console.log("添加字典数据的默认值=>", DictDataInfo);
    dictDataInfoForm = reactive(DictDataInfo);
    dialogVisible.value = true;
    isAdd.value = true;
    isDict.value = false;
    dialogTitle.value = "添加字典数据";
  };
  const editDictDataDialog = (dictData: dictDataType) => {
    dictDataInfoForm = reactive(cloneDeep(dictData));
    dialogVisible.value = true;
    isAdd.value = false;
    isDict.value = false;
    dialogTitle.value = "修改字典数据";
  };
  const addOrEdit_DictOrDictDataFun = async (
    formEl: FormInstance | undefined
  ) => {
    // 先进行表单验证
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        waitAddOrEdit.value = true;
        let res;
        if (isAdd.value && isDict.value) res = await addDict(dictInfoForm);
        if (!isAdd.value && isDict.value) res = await editDict(dictInfoForm);
        if (isAdd.value && !isDict.value)
          res = await addDictData(dictDataInfoForm);
        if (!isAdd.value && !isDict.value)
          res = await editDictData(dictDataInfoForm);
        if (res!.code == 200) {
          getDictListFun();
          dialogVisible.value = false; //隐藏弹出框
        } else {
          ElMessage.error(res!.message);
        }
        waitAddOrEdit.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //查询用户-------------------------------------
  const dictQueryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryRules = reactive({
    dictName: [
      { min: 0, max: 12, message: "长度在12位以内", trigger: "change" },
    ],
    dictType: [
      { min: 0, max: 12, message: "长度在12位以内", trigger: "change" },
    ],
  });
  const waitQueryDict = ref(false);
  let queryDictFun = async (formEl: FormInstance | undefined) => {
    // 先验证表单
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        allDictList.value = [];
        waitQueryDict.value = true;
        console.log("查询条件=>", dictQueryFrom);
        let res = await getDictList(dictQueryFrom);
        console.log("查询结果=>", res);
        if (res.code === 200) {
          ElMessage.success("查询成功");
          allDictList.value = res.data.records;
          await nextTick();
          bs?.refresh();
        } else ElMessage.error(res.message);
        waitQueryDict.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //删除字典/字典数据-----------------------
  const delDictFun = (dictId: number, dictName: string) => {
    ElMessageBox.confirm(`确认删除ID为 ${dictId} 的字典类型"${dictName}"吗?`, {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
      customClass: "rounded",
    })
      .then(async () => {
        let res = await delDict(dictId);
        if (res.code == 200) {
          ElMessage.success(res.message);
          getDictListFun();
        } else ElMessage.error(res.message);
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
  const delDictDataFun = (dictCode: number, dictLabel: string) => {
    ElMessageBox.confirm(`确认删除Code为 ${dictCode} 的选项"${dictLabel}"吗?`, {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true,
      customClass: "rounded",
    })
      .then(async () => {
        let res = await delDictData(dictCode);
        if (res.code == 200) {
          ElMessage.success(res.message);
          getDictListFun();
        } else ElMessage.error(res.message);
      })
      .catch(() => {
        ElMessage.info("取消删除");
      });
  };
</script>

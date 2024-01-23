<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索字典 -->
    <el-form
      :model="queryFrom"
      ref="queryFromRef"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4">
      <el-form-item
        class="col-3 pe-3 flex-grow-1"
        label="字典名称"
        prop="dictName">
        <el-input
          clearable
          maxlength="10"
          v-model.trim="queryFrom.dictName"
          placeholder="字典名称"
          :prefix-icon="renderFontIcon('fa-solid fa-quote-left')" />
      </el-form-item>
      <el-form-item
        class="col-3 pe-3 flex-grow-1"
        label="字典类型"
        prop="dictType">
        <el-input
          clearable
          maxlength="20"
          v-model.trim="queryFrom.dictType"
          placeholder="字典类型"
          :prefix-icon="renderFontIcon('fa-solid fa-code')" />
      </el-form-item>
      <el-form-item class="flex-shrink-0 pe-3" label="字典状态" prop="status">
        <el-select
          v-model="queryFrom.status"
          placeholder="正常/停用"
          clearable
          style="width: 113px">
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="queryFun">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 字典列表 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="bsWrapper"
        class="bsWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            v-loading="loading"
            ref="dictTableRef"
            :data="allDictList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="dictName"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的字典"
            @cell-click="cellClickFun">
            <!-- 外层表格扩展 -->
            <el-table-column type="expand">
              <template #default="props">
                <div class="px-3" v-if="props.row.sysDictDataList.length > 0">
                  <el-table
                    :data="props.row.sysDictDataList"
                    table-layout="auto"
                    class="bg-body rounded-4"
                    header-cell-class-name="text-center text-body"
                    :header-cell-style="{
                      background: 'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                    }"
                    row-key="dictId"
                    :row-class-name="
                      darkTheme ? 'bg-black' : 'bg-body-secondary'
                    "
                    cell-class-name="text-center"
                    @cell-click="cellClickFun"
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
                        <el-button @click="toAddData(props.row)"
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
                <div v-else class="text-center">
                  <el-button class="text-center" @click="toAddData(props.row)"
                    >该字典下暂无数据,请添加</el-button
                  >
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
                <el-button @click="toAddDict">添加字典</el-button>
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
    <!-- 添加/修改字典弹窗 -->
    <el-dialog
      :title="A_ETitle"
      v-model="A_EVisible"
      :before-close="closeConfirm"
      class="rounded-4"
      draggable
      center
      width="400px">
      <!-- 字典类型表单 -->
      <el-form
        :model="A_EDictForm"
        ref="A_EDictFormRef"
        :rules="A_EDictRules"
        v-if="isDict">
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="A_EDictForm.dictName"
            placeholder="在选框外呈现给用户"
            :prefix-icon="renderFontIcon('fa-solid fa-quote-left')">
          </el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="A_EDictForm.dictType"
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
            v-model.trim="A_EDictForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 字典数据表单 -->
      <el-form
        :model="A_EDataForm"
        ref="A_EDataFormRef"
        :rules="A_EDataRules"
        v-else>
        <el-form-item
          label="父级类型"
          prop="dictType"
          style="padding-left: 10.18px">
          <el-input
            clearable
            disabled
            v-model.trim="A_EDataForm.dictType"
            :prefix-icon="renderFontIcon('fa-solid fa-code-fork')">
          </el-input>
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="A_EDataForm.dictLabel"
            placeholder="字典数据呈现出的选项名称"
            :prefix-icon="renderFontIcon('fa-solid fa-tag')">
          </el-input>
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input
            clearable
            maxlength="20"
            v-model.trim="A_EDataForm.dictValue"
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
            v-model.trim="A_EDataForm.cssClass"
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
            v-model.trim="A_EDataForm.listClass"
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
            v-model.trim="A_EDataForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="选项排序"
          prop="dictSort"
          style="padding-left: 10.18px">
          <el-input-number
            v-model.trim="A_EDataForm.dictSort"
            :min="0"
            :max="999" />
        </el-form-item>
      </el-form>
      <!-- 通用确认按钮 -->
      <div class="d-flex justify-content-center">
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle }}
          <span v-if="!isAdd && isDict">ID: {{ A_EDictForm.dictId }}</span>
          <span v-if="!isAdd && !isDict">Code: {{ A_EDataForm.dictCode }}</span>
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
  import ObserveDOM from "@better-scroll/observe-dom"; //开启对 content 以及 content 子元素 DOM 改变的探测
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { onMounted, reactive, ref } from "vue";
  import { dictDataType, dictType } from "@/type/index";
  import { ElMessage, FormInstance } from "element-plus";
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { cloneDeep } from "lodash";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";

  //修改主题-------------------------------------------------
  const { darkTheme } = storeToRefs(useDarkThemeStore());

  // 不传参数的情况下，就是获取所有字典。传参数的情况下可用作搜索
  const allDictList = ref<dictType[]>([]);
  const loading = ref(false);
  const queryFrom = reactive({
    dictName: "",
    dictType: "",
    status: undefined,
  });
  const getFun = async () => {
    loading.value = true;
    allDictList.value = [];
    console.log("字典查询条件=>", queryFrom);
    const res = await getDictList(queryFrom);
    console.log("字典查询结果=>", res);
    if (res.code === 200) {
      ElMessage.success("字典查询成功");
      allDictList.value = res.data.records;
    }
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
  const cellClickFun = (
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
      toEditDict(row);
    if (
      event.target.className.includes("bi-pencil-square") &&
      !row.sysDictDataList
    )
      toEditData(row);
    if (event.target.className.includes("bi-trash") && row.sysDictDataList)
      delDictFun(row.dictId!, row.dictName);
    if (event.target.className.includes("bi-trash") && !row.sysDictDataList)
      delDataFun(row.dictCode!, row.dictLabel);
  };
  // 表单---------------------
  const A_EDictFormRef = ref<FormInstance>(); //表单实例
  const A_EDataFormRef = ref<FormInstance>(); //表单实例
  const defaultA_EDict: dictType = {
    dictName: "",
    dictType: "",
    remark: "",
  };
  const defaultA_EData: dictDataType = {
    cssClass: "",
    dictLabel: "",
    dictSort: 0,
    dictType: "",
    dictValue: "",
    listClass: "",
    remark: "",
  };
  let A_EDictForm = reactive(defaultA_EDict);
  let A_EDataForm = reactive(defaultA_EData);
  const A_EDictRules = reactive({
    dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
    dictType: [{ required: true, message: "请输入字典类型", trigger: "blur" }],
  });
  const A_EDataRules = reactive({
    dictLabel: [
      { required: true, message: "请输入字典数据标签", trigger: "blur" },
    ],
    dictValue: [
      { required: true, message: "请输入字典数据键值", trigger: "blur" },
    ],
  });
  //dialog弹出框--------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("");
  const isAdd = ref(true);
  const isDict = ref(true);
  const closeConfirm = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };

  //添加/修改字典类型/字典数据-----------------
  const toAddDict = () => {
    A_EDictForm = reactive(cloneDeep(defaultA_EDict));
    A_EVisible.value = true;
    isAdd.value = true;
    isDict.value = true;
    A_ETitle.value = "添加字典类型";
  };
  const toEditDict = (dict: dictType) => {
    A_EDictForm = reactive(cloneDeep(dict));
    A_EVisible.value = true;
    isAdd.value = false;
    isDict.value = true;
    A_ETitle.value = "修改字典类型";
  };
  const toAddData = (dict: dictType) => {
    const DictDataInfo = cloneDeep(defaultA_EData);
    DictDataInfo.dictType = dict.dictType;
    console.log("添加字典数据的默认值=>", DictDataInfo);
    A_EDataForm = reactive(DictDataInfo);
    A_EVisible.value = true;
    isAdd.value = true;
    isDict.value = false;
    A_ETitle.value = "添加字典数据";
  };
  const toEditData = (dictData: dictDataType) => {
    A_EDataForm = reactive(cloneDeep(dictData));
    A_EVisible.value = true;
    isAdd.value = false;
    isDict.value = false;
    A_ETitle.value = "修改字典数据";
  };
  const A_EFun = async () => {
    let formEl = isDict.value ? A_EDictFormRef.value : A_EDataFormRef.value;
    // 先进行表单验证
    formEl!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAdd.value && isDict.value) res = await addDict(A_EDictForm);
        if (!isAdd.value && isDict.value) res = await editDict(A_EDictForm);
        if (isAdd.value && !isDict.value) res = await addDictData(A_EDataForm);
        if (!isAdd.value && !isDict.value)
          res = await editDictData(A_EDataForm);
        if (res!.code == 200) {
          getFun();
          A_EVisible.value = false; //隐藏弹出框
        } else {
          ElMessage.error(res!.message);
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //查询用户-------------------------------------
  const queryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryFun = async () => {
    queryFromRef.value!.validate((valid, fields) => {
      if (valid) getFun();
      else console.log("error submit!", fields);
    });
  };

  //删除字典/字典数据-----------------------
  const delDictFun = (dictId: number, dictName: string) => {
    elMessageBoxConfirm(
      `删除ID为 ${dictId} 的字典类型"${dictName}"`,
      async () => {
        loading.value = true;
        const res = await delDict(dictId);
        if (res.code == 200) {
          ElMessage.success(`删除ID为 ${dictId} 的字典类型"${dictName}"成功`);
          getFun();
        }
        loading.value = false;
      }
    );
  };
  const delDataFun = (dictCode: number, dictLabel: string) => {
    elMessageBoxConfirm(
      `删除Code为 ${dictCode} 的选项"${dictLabel}"`,
      async () => {
        loading.value = true;
        const res = await delDictData(dictCode);
        if (res.code == 200) {
          ElMessage.success(`删除Code为 ${dictCode} 的选项"${dictLabel}成功"`);
          getFun();
        }
        loading.value = false;
      }
    );
  };
</script>

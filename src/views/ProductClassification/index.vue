<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据分类名称搜索 -->
    <el-form
      :model="queryFrom"
      ref="PCQueryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4"></el-form>
    <!-- 商品分类列表 -->
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
            ref="PCTableRef"
            :data="allPCList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="id"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的商品分类"
            @cell-click="cellClickFun">
            <!-- 外层表格扩展 -->
            <el-table-column type="expand">
              <template #default="props">
                <div
                  v-if="props.row.subClassifications.length > 0"
                  class="px-3">
                  <el-table
                    :data="props.row.subClassifications"
                    table-layout="auto"
                    class="bg-body rounded-4 border-start border-end"
                    header-cell-class-name="text-center text-body"
                    :header-cell-style="{
                      background: 'rgba(var(--bs-ShaoShop-rgb),0.4) !important',
                    }"
                    row-key="id"
                    :row-class-name="
                      darkTheme ? 'bg-black' : 'bg-body-secondary'
                    "
                    cell-class-name="text-center"
                    @cell-click="cellClickFun">
                    <el-table-column label="序号" type="index" width="55" />
                    <el-table-column prop="id" label="分类ID" />
                    <el-table-column
                      prop="classificationName"
                      label="分类名称" />
                    <el-table-column prop="classificationSort" label="排序" />
                    <el-table-column
                      prop="parentClassificationNumber"
                      label="父分类ID" />
                    <el-table-column label="子分类个数">
                      <template #default="scope">{{
                        scope.row.subClassifications?.length || 0
                      }}</template>
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
                    <el-table-column prop="remark">
                      <template #header>备注</template>
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
                        <el-button @click="toAdd(props.row.id)"
                          >添加分类</el-button
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
                <div
                  v-else
                  class="d-flex align-items-center justify-content-center">
                  <el-button @click="toAdd(props.row.id)"
                    >暂无子分类,您可以添加分类</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="id" label="分类ID" />
            <el-table-column prop="classificationName" label="分类名称" />
            <el-table-column prop="classificationSort" label="排序" />
            <el-table-column
              prop="parentClassificationNumber"
              label="父分类ID" />
            <el-table-column label="子分类个数">
              <template #default="scope">{{
                scope.row.subClassifications.length
              }}</template>
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
            <el-table-column prop="remark">
              <template #header>跳页</template>
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
                <el-button @click="toAdd">添加分类</el-button>
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
    <!-- 添加/修改商品分类弹窗 -->
    <el-dialog
      v-model="A_EVisible"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <template #header>
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle
          }}<span v-if="!isAdd">ID: {{ A_EForm.specNameId }}</span></el-button
        >
      </template>
      <el-form :model="A_EForm" ref="A_EFormRef" :rules="A_ERules">
        <el-form-item label="分类名称" prop="classificationName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="A_EForm.classificationName"
            placeholder="商品分类名称"
            :prefix-icon="renderFontIcon('fa-solid fa-quote-left')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="父级编号"
          prop="parentClassificationNumber"
          style="padding-left: 10.18px">
          <el-input
            clearable
            maxlength="20"
            v-model.trim.number="A_EForm.parentClassificationNumber"
            placeholder="父级商品分类编号"
            :prefix-icon="renderFontIcon('bi bi-diagram-3')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="分类备注"
          prop="remark"
          style="padding-left: 10.18px">
          <el-input
            clearable
            v-model.trim="A_EForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('fa-solid fa-marker')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="分类排序"
          prop="classificationSort"
          style="padding-left: 10.18px">
          <el-input-number
            v-model="A_EForm.classificationSort"
            :min="0"
            :max="999" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import {
    addPC,
    delPC,
    editPC,
    getPCList,
  } from "@/api/ProductClassificationAPI";
  import { PCQueryType, PCType } from "@/type";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, cloneDeep, throttle } from "lodash";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { ElMessage, FormInstance } from "element-plus";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { storeToRefs } from "pinia";

  //修改主题------------------------------------------
  const { darkTheme } = storeToRefs(useDarkThemeStore());

  // 不传参数的情况下，就是获取所有商品分类。传参数的情况下可用作搜索
  const allPCList = ref<PCType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const loading = ref(false);
  const queryFrom = reactive<PCQueryType>({
    id: undefined, //分类编号
    parentClassificationNumber: undefined, //父级分类编号
    classificationLevel: undefined,
    classificationName: "",
    status: undefined, //状态（0正常 1停用）
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryRules = reactive({});
  const getFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getPCList(queryFrom);
    loading.value = false;
    console.log(
      `查询条件`,
      queryFrom,
      `\n第${queryFrom.currentPage}页商品分类(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      allPCList.value.push(...res.data.records);
      await nextTick();

      // 每次请求都重新赋值总页数
      allPageCount.value = ceil(Number(res.data.total) / defaultPageSize);

      // 如果是页面初次加载,则获取元素高度
      if (!tableItemHeight)
        tableItemHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__row")!)
            .height.replace("px", "")
        );
      if (!tableHeaderHeight)
        tableHeaderHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__body-header")!)
            .height.replace("px", "")
        );
      //如果加载完了就关闭上拉
      if (allPCList.value.length >= res.data.total) {
        bs.closePullUp();
        closePullUp = true;
      }
    } else bs.closePullUp();
    return { closePullUp };
  };
  getFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const bsWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(bsWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
    bs.on("pullingUp", async () => {
      queryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", queryFrom.currentPage);
      const { closePullUp } = await getFun();
      if (!closePullUp) bs!.finishPullUp();
    });
    bs.on(
      "scroll",
      // 使用节流,实时刷新当前页面
      throttle((e: { x: number; y: number }) => {
        if (-e.y + 1 > tableHeaderHeight!) jumpPageBtnVisible.value = true;
        else jumpPageBtnVisible.value = false;
        // 滚动高度-表头高度=实际滚动内容
        nowPage.value = ceil(
          (-e.y - tableHeaderHeight! + bsWrapper.value.clientHeight) /
            (tableItemHeight! * queryFrom.pageSize)
        );
        /* console.log(
              `视窗高${PCListWrapper.value.clientHeight}px,表头高${
                tableHeaderHeight
              }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
              nowPage.value
            ); */
      }, 400)
    );
  });

  //表格点击回调----------------------
  const cellClickFun = (
    row: PCType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square")) toEdit(row);
    if (event.target.className.includes("bi-trash")) delFun(row);
  };

  //dialog弹出框表单-----------------------
  const A_EFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultA_EForm: PCType = {
    classificationName: "", //分类名称
    classificationSort: 0, //分类排序
    parentClassificationNumber: undefined, //父编号
    remark: "", //备注
  };
  let A_EForm = reactive(defaultA_EForm);
  const A_ERules = reactive({
    classificationName: [
      { required: true, message: "请输入分类名称", trigger: "blur" },
    ],
  });
  //dialog弹出框-----------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加商品分类");
  const isAdd = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      A_EFormRef.value?.resetFields();
      A_EFormRef.value?.clearValidate();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };

  //添加/修改商品分类----------------
  const toAdd = (fatherId?: number) => {
    A_EForm = reactive(cloneDeep(defaultA_EForm));
    if (typeof fatherId == "number")
      A_EForm.parentClassificationNumber = fatherId;
    A_EVisible.value = true;
    isAdd.value = true;
    A_ETitle.value = "添加商品分类";
  };
  const toEdit = async (PC: PCType) => {
    let res = await getPCificationList(PC.specificationsId);
    if (res.code == 200) {
      console.log(`获取到ID${PC.specificationsId}的商品分类=>`, res.data);
      A_EForm = reactive(cloneDeep(res.data));
      A_EVisible.value = true;
      isAdd.value = false;
      A_ETitle.value = "修改商品分类";
    }
  };
  const A_EFun = async () => {
    A_EFormRef.value!.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (isAdd.value) res = await addPC(A_EForm);
        else res = await editPC(A_EForm);
        if (res.code == 200) {
          allPCList.value = [];
          queryFrom.currentPage = 1;
          getFun();
          A_EVisible.value = false; //隐藏弹出框
          ElMessage.success(`${A_ETitle.value}成功`);
        }
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };

  //删除分类------------------------------------
  const delFun = (PC: PCType) => {
    elMessageBoxConfirm(`删除分类"${PC.classificationName}"`, async () => {
      loading.value = true;
      const res = await delPC(PC.id!);
      if (res.code == 200) {
        ElMessage.success(`删除分类"${PC.classificationName}成功"`);
        allPCList.value = [];
        queryFrom.currentPage = 1;
        getFun(); //重新请求数据进行用户列表渲染
      }
      loading.value = false;
    });
  };
</script>

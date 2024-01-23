<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据分类名称搜索 -->
    <el-form
      :model="PCQueryFrom"
      ref="PCQueryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4"></el-form>
    <!-- 商品分类列表 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="PCWrapper"
        class="PCWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            ref="PCTableRef"
            :data="allPCList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="--------------"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的商品分类"
            @cell-click="cellClickFun">
            <el-table-column>
              <template #header>
                <el-button @click="addPCDialog">添加分类</el-button>
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
      v-model="dialogVisible"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <template #header>
        <el-button @click="addOrEditPCFun" :loading="loading"
          >确认{{ dialogTitle
          }}<span v-if="!isAddPC">ID: {{ PCForm.specNameId }}</span></el-button
        >
      </template>
      <el-form :model="PCForm" ref="dialogFromRef" :rules="PCRules">
        <el-form-item label="分类名称" prop="classificationName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="PCForm.classificationName"
            placeholder="商品分类名称"
            :prefix-icon="renderFontIcon('')">
          </el-input>
        </el-form-item>
        <el-form-item label="分类编号" prop="id">
          <el-input
            clearable
            maxlength="20"
            v-model.trim.number="PCForm.id"
            placeholder="商品分类编号"
            :prefix-icon="renderFontIcon('')">
          </el-input>
        </el-form-item>
        <el-form-item label="父级编号" prop="parentClassificationNumber">
          <el-input
            clearable
            maxlength="20"
            v-model.trim.number="PCForm.parentClassificationNumber"
            placeholder="父级商品分类编号"
            :prefix-icon="renderFontIcon('')">
          </el-input>
        </el-form-item>
        <el-form-item label="分类备注" prop="remark">
          <el-input
            clearable
            v-model.trim="PCForm.remark"
            placeholder="备注"
            :prefix-icon="renderFontIcon('')">
          </el-input>
        </el-form-item>
        <el-form-item
          label="分类等级"
          prop="classificationLevel"
          style="padding-left: 10.18px">
          <el-input-number
            v-model="PCForm.classificationLevel"
            :min="0"
            :max="999" />
        </el-form-item>
        <el-form-item
          label="分类排序"
          prop="classificationSort"
          style="padding-left: 10.18px">
          <el-input-number
            v-model="PCForm.classificationSort"
            :min="0"
            :max="999" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { getPCList } from "@/api/ProductClassificationAPI";
  import { PCQueryType, PCType } from "@/type";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, cloneDeep, throttle } from "lodash";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { ElMessage, FormInstance } from "element-plus";

  // 不传参数的情况下，就是获取所有商品分类。传参数的情况下可用作搜索
  const allPCList = ref<PCType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const loading = ref(false);
  const PCQueryFrom = reactive<PCQueryType>({
    id: null, //分类编号
    parentClassificationNumber: null, //父级分类编号
    classificationLevel: null,
    classificationName: "",
    status: null, //状态（0正常 1停用）
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryRules = reactive({});
  const getPCListFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getPCList(PCQueryFrom);
    loading.value = false;
    console.log(
      `查询条件`,
      PCQueryFrom,
      `\n第${PCQueryFrom.currentPage}页商品分类(${res.data?.records?.length})=>`,
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
  getPCListFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const PCWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(PCWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
    });
    bs.on("pullingUp", async () => {
      PCQueryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", PCQueryFrom.currentPage);
      const { closePullUp } = await getPCListFun();
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
          (-e.y - tableHeaderHeight! + PCWrapper.value.clientHeight) /
            (tableItemHeight! * PCQueryFrom.pageSize)
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
    if (event.target.className.includes("bi-pencil-square")) editPCDialog(row);
    if (event.target.className.includes("bi-trash")) delPCFun(row);
  };

  //dialog弹出框表单-----------------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultPC: PCType = {
    classificationLevel: null,
    classificationName: "",
    classificationSort: 0,
    id: -1,
    parentClassificationNumber: null,
    remark: "",
  };
  let PCForm = reactive(defaultPC);
  const keyName = ref("");
  const PCRules = reactive({});
  //dialog弹出框-----------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("添加商品分类");
  const isAddPC = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${dialogTitle.value}`, () => {
      done();
      dialogFromRef.value?.resetFields();
      dialogFromRef.value?.clearValidate();
      ElMessage.info(`放弃${dialogTitle.value}`);
    });
  };

  //添加/修改商品分类----------------
  const addPCDialog = () => {
    PCForm = reactive(cloneDeep(defaultPC));
    dialogVisible.value = true;
    isAddPC.value = true;
    dialogTitle.value = "添加商品分类";
  };
  const editPCDialog = async (PC: PCType) => {
    let res = await getPCificationList(PC.specificationsId);
    if (res.code == 200) {
      console.log(`获取到ID${PC.specificationsId}的商品分类=>`, res.data);
      PCForm = reactive(cloneDeep(res.data));
      dialogVisible.value = true;
      isAddPC.value = false;
      dialogTitle.value = "修改商品分类";
    }
  };
</script>

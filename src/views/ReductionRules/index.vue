<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索满减规则 -->
    <el-form></el-form>
    <!-- 满减规则列表模块 -->
    <div class="flex-grow-1 overflow-hidden p-0 p-sm-1 p-md-2 p-lg-3">
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
            ref="tableRef"
            :data="allFRList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="id"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的满减规则"
            @cell-click="cellClickFun"
            @selection-change="selectionChange">
            <el-table-column type="selection" width="30" />
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="满减规则名称" />
            <el-table-column prop="discountAmount" label="优惠金额" />
            <el-table-column prop="minAmount" label="触发金额" />
            <el-table-column prop="businessId" label="商户ID" />
            <el-table-column prop="description" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status ? 'success' : 'danger'">{{
                  scope.row.status ? "有效" : "过期"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="时间段">
              <template #default="scope">
                <el-tooltip
                  :content="`${scope.row.startTime}~${scope.row.endTime}`"
                  effect="light"
                  placement="left">
                  <el-text style="max-width: 100px" truncated>
                    {{ getDateDiff(scope.row.startTime, scope.row.endTime) }}
                  </el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
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
            <el-table-column>
              <template #header>
                <el-button @click="toAdd">添加规则</el-button>
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
  </div>
</template>
<script lang="ts" setup>
  import { getFRList } from "@/api/ReductionRulesAPI";
  import { FRType, FRQueryType } from "@/type";
  import { getDateDiff } from "@/utils/time/getDateDiff";

  import { ceil, throttle } from "lodash";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";

  // 不传参数的情况下，就是获取所有满减规则。传参数的情况下可用作搜索
  const allFRList = ref<FRType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const loading = ref(false);
  const queryFrom = reactive<FRQueryType>({
    id: undefined,
    name: undefined,
    minAmount: undefined,
    discountAmount: undefined,
    businessId: undefined,
    description: undefined,
    startTime: undefined,
    endTime: undefined,
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const getFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getFRList(queryFrom);
    console.log(
      `查询条件`,
      queryFrom,
      `\n第${queryFrom.currentPage}页满减规则(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      allFRList.value.push(...res.data.records);
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
      if (allFRList.value.length >= res.data.total) {
        bs.closePullUp();
        closePullUp = true;
      }
    } else bs.closePullUp();
    loading.value = false;
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
            `视窗高${bsWrapper.value.clientHeight}px,表头高${
              tableHeaderHeight
            }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
            nowPage.value
          ); */
      }, 400)
    );
  });
</script>
@/utils/time/getDateDiff

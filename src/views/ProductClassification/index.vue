<template>
  <h1>"ProductClassification"</h1>
</template>
<script lang="ts" setup>
  import { getPCList } from "@/api/ProductClassificationAPI";
  import { PCQueryType, PCType } from "@/type";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, throttle } from "lodash";
  import { nextTick, onMounted, reactive, ref } from "vue";

  // 不传参数的情况下，就是获取所有商品分类。传参数的情况下可用作搜索
  const allPCList = ref<PCType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const waitQueryPC = ref(false);
  const PCQueryFrom = reactive<PCQueryType>({
    classificationLevel: null,
    classificationName: "",
    id: -1, //分类编号
    parentClassificationNumber: null, //父级分类编号
    status: 0, //状态（0正常 1停用）
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryRules = reactive({});
  const getPCListFun = async (excessDataCount?: number) => {
    let closePullUp;
    waitQueryPC.value = true;
    const res = await getPCList(PCQueryFrom);
    waitQueryPC.value = false;
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
      bs.refresh();

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
              `视窗高${PSNListWrapper.value.clientHeight}px,表头高${
                tableHeaderHeight
              }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
              nowPage.value
            ); */
      }, 400)
    );
  });
</script>

<template>
  <div class="overflow-hidden p-0 p-sm-1 p-md-2 p-lg-3">
    <div
      ref="r"
      class="bsWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, toRaw } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, throttle } from "lodash";
  import { QueryType } from "@/type";
  import { query } from "@/utils/query/query";
  const props = defineProps<{
    pullingUp?: boolean;
    scroll?: boolean;
    form?: QueryType;
    tableHeaderHeight?: number;
    tableItemHeight?: number;
    queryFun?: ReturnType<typeof query>;
  }>();
  const jumpPageBtnVisible = defineModel<boolean>("jumpPageBtnVisible");
  const nowPage = defineModel<number>("nowPage");

  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const r = ref<HTMLElement>();
  const bs = ref<BScrollConstructor<{}>>(); //此处若不使用ref包裹,则不可通过defineExpose暴露属性
  onMounted(() => {
    bs.value = new BScroll(r.value!, {
      pullUpLoad: props.pullingUp ? { threshold: -10 } : undefined,
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
    console.log("实例化BS完毕", toRaw(bs.value));
    if (props.pullingUp)
      bs.value.on("pullingUp", async () => {
        props.form!.currentPage++;
        console.log("触发pullingUp,页码", props.form!.currentPage);
        const result = await props.queryFun!();
        if (result) {
          const { closePullUp } = result;
          if (!closePullUp) bs.value!.finishPullUp();
        }
        /* console.log(
          "触发pullingUp,页码",
          props.form!.currentPage,
          "closePullUp",
          closePullUp
        ); */
      });
    if (props.scroll)
      bs.value.on(
        "scroll",
        // 使用节流,实时刷新当前页面
        throttle(async (e: { x: number; y: number }) => {
          if (-e.y + 1 > props.tableHeaderHeight!) {
            // console.log("表头滚动出视窗");
            jumpPageBtnVisible.value = true;
          } else {
            // console.log("表头进入视窗");
            jumpPageBtnVisible.value = false;
          }

          // 滚动高度-表头高度=实际滚动高度/每一个单元格高度=滚动了几格/多少格每页=现在是第几页
          nowPage.value = ceil(
            (-e.y - props.tableHeaderHeight! + r.value!.clientHeight) /
              (props.tableItemHeight! * props.form?.pageSize!)
          );
        }, 400)
      );
  });
  defineExpose({ bs });
</script>

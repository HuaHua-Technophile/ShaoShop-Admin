<template>
  <div
    class="align-items-center"
    style="display: flex"
    v-show="allPageCount != -1 && visible">
    <!-- 跳至 -->
    <el-input-number
      :disabled="allPageCount === -1 || disabled"
      size="small"
      v-model="son_nowPage"
      :min="1"
      :max="allPageCount === -1 ? 1 : allPageCount"
      style="width: 75px"
      @change="flip" />
    /{{ allPageCount }}页
  </div>
</template>
<script lang="ts" setup>
  import { QueryType } from "@/type";
  import { query } from "@/utils/query/query";
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, floor } from "lodash";
  import { nextTick, onUnmounted, ref, watchEffect } from "vue";

  const nowPage = defineModel<number>("nowPage"); //不能将nowpage同步绑定,因为在BS滚动监听中,刚开始滚动时又会将nowPage视为初始值

  const props = withDefaults(
    defineProps<{
      allPageCount: number;
      // nowPage: number;
      visible: boolean;
      bs: BScrollConstructor<{}> | undefined; //组件放置的位置在bsWrapper之前,因此会在bs实例化之前就传入undefined
      tableItemHeight: number;
      tableHeaderHeight: number;
      queryForm: QueryType;
      defaultPageSize?: number;
      queryFun: ReturnType<typeof query>;
    }>(),
    {
      nowPage: 1,
      tableItemHeight: 0,
      tableHeaderHeight: 0,
      defaultPageSize: 20,
    }
  );

  const son_nowPage = ref(1);
  watchEffect(() => {
    son_nowPage.value = nowPage.value!;
  });

  //el-input-number触发事件
  const disabled = ref(false);
  const timeOutArr: NodeJS.Timeout[] = [];
  const flip = async () => {
    //每800ms只能点一次
    disabled.value = true;
    timeOutArr.push(
      setTimeout(() => {
        disabled.value = false;
      }, 800)
    );

    // 如果已经请求的页码小于跳转的页码,则先请求一次,然后再跳转。
    const skipPage = son_nowPage.value - props.queryForm.currentPage;
    // 如果通过直接输入目标页码跳转,则有可能一次跳转多页,需要一次性请求更多数据(若有多余则剔除)
    if (skipPage > 1) {
      let excessDataCount: number;

      // 当前页码 (从1跳5,则nowpage为5 skippage为4) 则当前页向下舍入为1
      let currentPage = floor(son_nowPage.value! / skipPage);
      props.queryForm.currentPage = currentPage;

      //每次只请求一页,因此修改单次请求量,然后改回默认的defaultPageSize
      // (当前页码5 / 上方算出的1) × 默认20条 = 一次请求100条
      let pageSize = ceil(
        (son_nowPage.value! / currentPage) * props.defaultPageSize
      );
      props.queryForm.pageSize = pageSize;

      // 计算多余数据量 一次请求100条 - 默认单次20条 × 跳了4页 = 没有多请求
      excessDataCount =
        props.queryForm.pageSize - props.defaultPageSize * skipPage;

      await props.queryFun(excessDataCount);
      await nextTick();

      // 恢复默认
      props.queryForm.currentPage = son_nowPage.value!;
      props.queryForm.pageSize = props.defaultPageSize;
    }
    // 如果通过两侧加减按钮,则每次只跳一页
    else if (skipPage == 1) {
      props.queryForm.currentPage++;
      await props.queryFun();
      await nextTick();
    }

    // 向前跳页时,BS的observeDOM自动探测可能未重新实例化新加入的单元格,因此需要等待BS实例化后再滚动
    const bsScroll = () => {
      props.bs?.scrollTo(
        0,
        -(
          props.tableItemHeight *
            props.queryForm.pageSize *
            (son_nowPage.value! - 1) +
          props.tableHeaderHeight
        ),
        500
      );
    };
    if (skipPage > 0) props.bs?.once("refresh", bsScroll);
    else bsScroll();
  };

  // 清除定时器
  onUnmounted(() => {
    timeOutArr.forEach((item) => {
      clearTimeout(item);
    });
  });
</script>

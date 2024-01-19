<template>
  <div
    class="align-items-center"
    style="display: flex"
    v-show="allPageCount != -1 && visible">
    跳至<el-input-number
      :disabled="allPageCount === -1"
      size="small"
      v-model="son_nowPage"
      :min="1"
      :max="allPageCount === -1 ? 1 : allPageCount"
      style="width: 75px"
      @change="jumpPage" />/{{ allPageCount }}页
  </div>
</template>
<script lang="ts" setup>
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, floor } from "lodash";
  import { nextTick, ref, watchEffect } from "vue";

  const son_nowPage = ref(-1);

  //获取父组件传值-------------------
  const props = defineProps({
    allPageCount: {
      type: Number, //参数类型
      default: -1, //参数默认值
      required: true, //是否必须传递
    },
    nowPage: {
      type: Number,
      default: 1,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
      required: true,
    },
    bs: {
      // type: BScrollConstructor<{}>,
      required: true,
    },
    tableItemHeight: {
      default: -1,
      type: Number,
      required: true,
    },
    tableHeaderHeight: {
      default: -1,
      type: Number,
      required: true,
    },
    queryFun: {
      type: Function,
      required: true,
    },
    queryFrom: {
      type: Object,
      required: true,
    },
    defaultPageSize: {
      type: Number,
      default: 20,
      required: true,
    },
  });

  watchEffect(() => {
    son_nowPage.value = props.nowPage;
  }); //watch 在响应数据初始化时是不会执行回调函数的，watchEffect 在响应数据初始化时就会立即执行回调函数,省去了在生命周期中的初次赋值

  // 调用父组件方法--------------
  const emit = defineEmits(["jumpPage"]);
  const jumpPage = async () => {
    // 如果已经请求的页码小于跳转的页码,则先请求一次,然后再跳转。
    const jumpNum = son_nowPage.value - props.queryFrom.currentPage;
    if (jumpNum > 1) {
      let excessDataCount: Number;
      let currentPage = floor(son_nowPage.value / jumpNum);
      props.queryFrom.currentPage = currentPage;
      let pageSize = ceil(
        (son_nowPage.value / currentPage) * props.defaultPageSize
      ); //如果一次性跳页太多则每一页多请求一些,然后改回默认defaultPageSize
      props.queryFrom.pageSize = pageSize;
      excessDataCount =
        props.queryFrom.pageSize - props.defaultPageSize * jumpNum;
      // console.log(`查询第${currentPage}页,设置每页${pageSize}条`);
      await props.queryFun(excessDataCount);
      await nextTick();
      // 恢复默认
      props.queryFrom.currentPage = son_nowPage.value;
      props.queryFrom.pageSize = props.defaultPageSize;
    } else if (jumpNum == 1) {
      props.queryFrom.currentPage++;
      await props.queryFun();
      await nextTick();
    }
    if (son_nowPage.value == props.allPageCount)
      (props.bs as BScrollConstructor).closePullUp();
    (props.bs as BScrollConstructor).scrollTo(
      0,
      -(
        props.tableItemHeight *
          props.queryFrom.pageSize *
          (son_nowPage.value - 1) +
        props.tableHeaderHeight
      ),
      500
    );
  };
</script>

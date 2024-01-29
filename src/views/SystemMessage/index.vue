<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据时间/是否已读 筛选消息 -->
    <el-form
      :model="queryFromRef"
      ref="queryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-0 px-sm-1 px-md-2 px-lg-3">
      <el-form-item
        label="发送日期"
        prop="createTime"
        class="flex-grow-1 overflow-hidden">
        <el-config-provider :locale="locale">
          <el-date-picker
            v-model="queryFrom.timePeriod"
            type="datetimerange"
            start-placeholder="初始时间"
            end-placeholder="截止时间"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD dddd A HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD dddd"
            time-format="A hh:mm:ss" />
        </el-config-provider>
      </el-form-item>
      <el-form-item
        label="是否未读"
        prop="status"
        class="flex-shrink-0 px-0 px-sm-1 px-md-2 px-lg-3">
        <el-select
          v-model="queryFrom.read"
          placeholder="已读/未读"
          clearable
          style="width: 106px">
          <el-option label="未读" :value="0" />
          <el-option label="已读" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" @click="queryFun">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 消息列表模块 -->
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
            :data="systemMessageList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="messageId"
            row-class-name="bg-body"
            :row-style="{ cursor: 'pointer' }"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的消息"
            @cell-click="cellClickFun">
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="messageId" label="ID" />
            <el-table-column prop="receiverName" label="收件人" />
            <el-table-column
              prop="messageContent"
              label="内容概览(点击即可侧栏查看具体内容)">
            </el-table-column>
            <el-table-column prop="isRead" label="状态">
              <template #header>
                <jumpPageBtn
                  class="justify-content-center"
                  :queryFun="getFun"
                  :allPageCount="allPageCount"
                  :nowPage="nowPage"
                  :visible="true"
                  :bs="bs"
                  :tableItemHeight="tableItemHeight"
                  :tableHeaderHeight="tableHeaderHeight"
                  :queryFrom="queryFrom"
                  :defaultPageSize="defaultPageSize" />
              </template>
              <template #default="scope">
                <el-tag :type="scope.row.isRead ? 'success' : 'danger'">{{
                  scope.row.isRead ? "已读" : "未读"
                }}</el-tag>
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
          </el-table>
        </div>
      </div>
    </div>
    <!-- 右下角悬浮跳页按钮 -->
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut">
      <jumpPageBtn
        class="position-absolute p-2 rounded-pill me-3 mb-3"
        style="background: #141414; right: 0; bottom: 0"
        :queryFun="getFun"
        :allPageCount="allPageCount"
        :nowPage="nowPage"
        :visible="jumpPageBtnVisible"
        :bs="bs"
        :tableItemHeight="tableItemHeight"
        :tableHeaderHeight="tableHeaderHeight"
        :queryFrom="queryFrom"
        :defaultPageSize="defaultPageSize" />
    </Transition>
    <!-- 消息展示弹窗 -->
    <el-drawer
      v-model="drawerVisible"
      direction="rtl"
      size="50%"
      class="bg-body-secondary rounded-start-5">
      <template #header>
        <h2 class="text-body">{{ drawerTitle }}</h2>
      </template>
      {{ messageDrawerContent }}
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
  import {
    getSystemMessage,
    getSystemMessageById,
  } from "@/api/SystemMessageAPI";
  import { messageQueryType, systemMessageType } from "@/type";
  import { ceil, throttle } from "lodash";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { FormInstance } from "element-plus";
  import { zhCn } from "element-plus/es/locale/index.mjs"; // import zhCn from "element-plus/dist/locale/zh-cn.mjs"; //国际化

  // 不传参数的情况下，就是获取所有消息。传参数的情况下可用作根据时间和是否已读来搜索
  const systemMessageList = ref<systemMessageType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const loading = ref(false);
  const queryFrom = reactive<messageQueryType>({
    timePeriod: [], //发送时间
    read: undefined, //是否已读
    currentPage: 1, //页码
    pageSize: 20, //每页返回的数量
  });
  const getFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getSystemMessage({
      currentPage: queryFrom.currentPage,
      pageSize: queryFrom.pageSize,
      read: queryFrom.read,
      startTime: queryFrom.timePeriod ? queryFrom.timePeriod[0] : undefined,
      endTime: queryFrom.timePeriod ? queryFrom.timePeriod[1] : undefined,
    });
    //
    loading.value = false;
    console.log(
      `查询条件`,
      queryFrom,
      `\n第${queryFrom.currentPage}页消息(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      systemMessageList.value.push(...res.data.records);
      await nextTick();
      // 每次请求都重新赋值总页数和总用户数量
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
      if (systemMessageList.value.length >= res.data.total) {
        bs!.closePullUp();
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
        if (-e.y + 1 > tableHeaderHeight) jumpPageBtnVisible.value = true;
        else jumpPageBtnVisible.value = false;
        // 滚动高度-表头高度=实际滚动内容
        nowPage.value = ceil(
          (-e.y - tableHeaderHeight! + bsWrapper.value.clientHeight) /
            (tableItemHeight! * queryFrom.pageSize)
        );
      }, 400)
    );
  });

  // 消息详情抽屉-------------
  const drawerVisible = ref(false);
  const drawerTitle = ref("");
  const messageDrawerContent = ref("");
  //表格点击回调-------------
  const cellClickFun = async (row: systemMessageType) => {
    const res = await getSystemMessageById(row.messageId);
    console.log(`ID${row.messageId}的具体内容=>`, res);
    if (res.code == 200) {
      messageDrawerContent.value = res.data.content;
      drawerTitle.value = res.data.title;
      drawerVisible.value = true;
    }
  };

  //查询消息-------------------------------------
  const queryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryRules = reactive({});
  const locale = zhCn;
  const disabledDate = (time: Date) => {
    return time.getTime() > Date.now();
  };
  const queryFun = async () => {
    queryFromRef.value!.validate(async (valid, fields) => {
      if (valid) {
        systemMessageList.value = [];
        queryFrom.currentPage = 1;
        getFun();
      } else console.log("error submit!", fields);
    });
  };
</script>

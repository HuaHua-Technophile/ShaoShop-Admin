<template>
  <div class="w-100 h-100 p-3 position-relative">
    <div
      ref="roleListWrapper"
      class="w-100 h-100 overflow-hidden rounded-4"></div>
    <!-- 发送悬浮按钮 -->
    <div
      class="AddBtn position-absolute end-0 bottom-0 me-4 mb-4 rounded-pill bg-success shadow d-flex align-items-center justify-content-center"
      style="width: 3rem; height: 3rem"
      role="button"
      @click="sendMessageDialog">
      <fontIcon
        icon="bi bi-plus-circle "
        style="font-size: 1.5rem; text-shadow: 2px 2px 4px black" />
    </div>
    <!-- 发送公告 -->
    <div></div>
  </div>
</template>
<script setup lang="ts">
  import { getMessage } from "@/api/NoticeManagementAPI";
  import { ref } from "vue";
  import { messageType } from "@/type";
  import { ElMessageBox } from "element-plus";

  const messageList = ref<messageType[]>();
  const getMessageFun = async () => {
    let res = await getMessage();
    console.log("消息列表=>", res);
    messageList.value = res.data;
  };
  getMessageFun();

  // 发送消息----------------------------
  const sendMessageFun = () => {
    ElMessageBox.confirm("确定发送消息吗？", "提示", {});
  };
</script>
<style lang="scss" scoped>
  .AddBtn {
    & > * {
      transition: all 0.5s;
    }
    &:hover {
      & > * {
        transform: rotate(90deg) scale(1.3) !important;
      }
    }
  }
</style>

<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    size="50%"
    class="bg-body-secondary rounded-start-5"
    :before-close="closeConfirm">
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot></slot>
  </el-drawer>
</template>

<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { ElMessage } from "element-plus";

  const visible = defineModel<boolean>("visible");
  const props = defineProps<{ title: string }>();

  const closeConfirm = (done: () => void) => {
    elMessageBoxConfirm(`放弃${props.title}`, () => {
      done();
      ElMessage.info(`放弃${props.title}`);
    });
  };
</script>
<style lang="scss">
  .el-drawer__header {
    margin-bottom: 0 !important;
    padding-bottom: var(--el-drawer-padding-primary) !important;
  }
  .el-drawer__body {
    padding-top: 0 !important;
  }
</style>

<template>
  <el-form-item
    :label="info.label"
    :prop="info.prop"
    :style="info.notRequired ? 'padding-left: 10.18px' : ''"
    class="A_EDialogFormItemInput"
    v-if="!(info.hiddenOnEdit && !isAdd)">
    <el-input
      :disabled="info.disabledOnEdit && !isAdd"
      clearable
      :maxlength="info.maxlength"
      v-model.trim="from[info.prop]"
      :placeholder="info.placeholder"
      :prefix-icon="renderFontIcon(info.prefixIcon)" />
  </el-form-item>
</template>
<script lang="ts" setup>
  import { elInputItemInfoType } from "@/type";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";

  defineProps<{
    info: elInputItemInfoType;
    from: { [key: string]: string };
    isAdd: boolean;
  }>();
</script>
<style lang="scss">
  .A_EDialogFormItemInput:last-child {
    margin-bottom: 0 !important;
  }
</style>

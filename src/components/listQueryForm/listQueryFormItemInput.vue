<template>
  <el-form-item
    :label="info.label"
    :prop="info.prop"
    class="flex-grow-1 me-0 me-md-1 me-lg-2">
    <el-input
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
  }>();
</script>

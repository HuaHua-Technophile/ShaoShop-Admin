<template>
  <div class="d-flex align-items-center">
    <el-switch
      v-model="darkTheme"
      @change="dataThemeChange"
      size="large"
      :inactive-icon="renderFontIcon('bi bi-moon')"
      :active-icon="renderFontIcon('bi bi-brightness-high')"
      inline-prompt="true" />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "../../stores/colorTheme";
  import { renderFontIcon } from "../../utils/fontIcon/renderFontIcon";
  //修改主题-------------------------------------------------
  let { darkTheme } = storeToRefs(useDarkThemeStore());
  let { toggledarkTheme } = useDarkThemeStore();
  let dataThemeChange = () => {
    toggledarkTheme();
  };
</script>

<template>
  <div class="d-flex align-items-center justify-content-center">
    <el-switch
      v-model="darkTheme"
      @change="toggledarkTheme()"
      size="large"
      :active-icon="renderFontIcon('bi bi-moon')"
      :inactive-icon="renderFontIcon('bi bi-brightness-high')"
      inline-prompt />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useDarkThemeStore } from "@/stores/colorTheme";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  //修改主题-------------------------------------------------
  const darkThemeStore = useDarkThemeStore();
  let { darkTheme } = storeToRefs(darkThemeStore);
  let { toggledarkTheme } = darkThemeStore;
  // 页面初次加载时
  if (!darkTheme.value) {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.bsTheme = "light";
  }
</script>

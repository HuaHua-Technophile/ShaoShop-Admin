<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 搜索/新建字典 -->
    <el-form> </el-form>
    <!-- 字典列表 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="dictListWrapper"
        class="dictListWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          "></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getAllDict } from "@/api/DictManagementAPI";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { nextTick, onMounted, reactive, ref } from "vue";
  import { dictType } from "@/type/index";
</script>

<template>
  <!-- 其他菜单信息 -->
  <div class="d-flex align-items-center flex-wrap justify-content-between">
    <div>组件路径：{{ props.row.component }}</div>
    <div class="d-flex align-items-center">
      商户是否可见：
      <el-tag :type="props.row.status == 0 ? 'success' : 'danger'">{{
        props.row.status == 0 ? "是" : "否"
      }}</el-tag>
    </div>
    <div>isCache：{{ props.row.isCache }}</div>
    <div>权限标识：{{ props.row.perms }}</div>
    <div>路由参数：{{ props.row.query }}</div>
  </div>
</template>
<script lang="ts" setup>
  defineProps<{ props: { row: { [key: string]: any } } }>();
</script>

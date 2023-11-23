<template>
  <div
    class="w-100 h-100"
    style="
      background: linear-gradient(
        0deg,
        rgba(0, 0, 255, 0.233),
        rgba(255, 0, 0, 0.322)
      );
    ">
    <h1>UserManagement</h1>
  </div>
</template>
<script lang="ts" setup>
  import { getUserList } from "@/api/UserManagementAPI.ts";
  let res = await getUserList();
  console.log(res);
</script>

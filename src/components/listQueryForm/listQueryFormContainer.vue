<template>
  <div
    class="listQueryFormContainer bg-body flex-shrink-0 px-0 px-sm-1 px-md-2 px-lg-3">
    <slot></slot>
  </div>
</template>
<style lang="scss">
  .listQueryFormContainer {
    .el-form {
      display: flex !important;
      flex-wrap: nowrap !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
  }
</style>

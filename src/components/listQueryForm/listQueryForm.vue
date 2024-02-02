<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-0 px-sm-1 px-md-2 px-lg-3">
    <!-- 输入框 -->
    <el-form-item
      v-for="i in inputInfo"
      :label="i.label"
      :prop="i.prop"
      class="flex-grow-1 me-0 me-md-1 me-lg-2">
      <el-input
        clearable
        :maxlength="i.maxlength"
        v-model.trim="form[i.prop]"
        :placeholder="i.placeholder"
        :prefix-icon="renderFontIcon(i.prefixIcon)" />
    </el-form-item>
    <slot></slot>
    <!-- 下拉选单 -->
    <el-form-item
      v-for="i in selectInfo"
      :label="i.label"
      :prop="i.prop"
      class="flex-shrink-0 me-0 me-md-1 me-lg-2">
      <el-select
        v-model="form[i.prop]"
        :placeholder="i.placeholder"
        clearable
        :style="{ width: i.width || '106px' }">
        <el-option v-for="j in i.option" :label="j.label" :value="j.value" />
      </el-select>
    </el-form-item>
    <!-- 查询按钮 -->
    <el-form-item>
      <el-button :loading="loading" @click="queryFun">查询</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { elInputItemInfoType, elSelectItemInfoType } from "@/type";
  import { ElMessage, FormInstance } from "element-plus";
  import { ref } from "vue";

  //获取父组件传值-------------------
  const props = defineProps<{
    rules: object;
    inputInfo: elInputItemInfoType[] | undefined;
    selectInfo?: elSelectItemInfoType[];
    form: { [key: string]: string };
    loading: boolean;
    reQueryFun: () => void;
  }>();

  const formRef = ref<FormInstance>();
  const queryFun = async () => {
    formRef.value?.validate(async (valid, fields) => {
      if (valid) {
        props.reQueryFun();
        ElMessage.success(`查询成功`);
      } else console.log("error submit!", fields);
    });
  };
</script>

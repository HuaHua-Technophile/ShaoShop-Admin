<template>
  <el-dialog
    v-model="A_EVisible"
    :title="A_ETitle"
    :width="width"
    :before-close="closeConfirmFun"
    class="rounded-4"
    draggable
    center>
    <template #header>
      <el-button @click="A_EFun" :loading="loading"
        >确认{{ A_ETitle }}<span v-if="!isAdd">ID: {{ id }}</span></el-button
      >
    </template>
    <el-form :model="A_EForm" ref="A_EFormRef" :rules="A_ERules">
      <!-- input文本输入框 -->
      <el-form-item
        :label="i.label"
        :prop="i.prop"
        :style="i.notRequired ? 'padding-left: 10.18px' : ''"
        v-for="i in A_EFormInput"
        class="A_EDialogFormItem">
        <el-input
          v-if="!(i.hiddenOnEdit && !isAdd)"
          :disabled="i.disabledOnEdit && !isAdd"
          clearable
          :maxlength="i.maxlength"
          v-model.trim="A_EForm[i.prop]"
          :placeholder="i.placeholder"
          :prefix-icon="renderFontIcon(i.prefixIcon)" />
      </el-form-item>

      <slot></slot>
      <!-- inputNumber数值输入框 -->
      <el-form-item
        v-for="i in A_EFormInputNum"
        :label="i.label"
        :prop="A_EForm[i.prop]"
        style="padding-left: 10.18px"
        class="A_EDialogFormItem">
        <el-input-number
          v-model="A_EForm[i.prop]"
          :min="i.min || 0"
          :max="i.max || 999" />
      </el-form-item>
      <!-- radio单选 -->
      <el-form-item
        v-for="i in A_EFormRadio"
        :label="i.label"
        :prop="A_EForm[i.prop]"
        style="padding-left: 10.18px"
        class="A_EDialogFormItem">
        <el-radio-group v-model="A_EForm[i.prop]">
          <el-radio v-for="j in i.radio" :label="j.l">{{ j.v }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";
  import { addFun, editFun } from "@/api/instance";
  import { ElMessage, FormInstance } from "element-plus";
  import { ref } from "vue";
  import {
    elInputItemInfoType,
    elInputNumItemInfoType,
    elRadioItemInfoType,
  } from "@/type";

  const A_EVisible = defineModel<boolean>("A_EVisible");
  const loading = defineModel<boolean>("loading");
  const props = withDefaults(
    defineProps<{
      A_ETitle: string;
      isAdd: boolean;
      id?: number;
      A_EForm: { [key: string]: string };
      A_ERules?: object;
      A_EFormInput: elInputItemInfoType[];
      A_EFormRadio?: elRadioItemInfoType[];
      A_EFormInputNum?: elInputNumItemInfoType[];
      addFun: ReturnType<typeof addFun>;
      editFun: ReturnType<typeof editFun>;
      reQueryFun: () => void;
      width?: string;
    }>(),
    {
      width: "485px",
    }
  );
  /* 不使用defineModel的方法:
    const v = ref(false);
    watchEffect(() => {
      v.value = props.visible;
    });
    const emit = defineEmits<{
      "update:visible": [arg: boolean];
    }>(); */

  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${props.A_ETitle}`, () => {
      done();
      // emit("update:visible", false); 不使用defineModel的方法
      ElMessage.info(`放弃${props.A_ETitle}`);
    });
  };

  const A_EFormRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法

  const A_EFun = async () => {
    A_EFormRef.value?.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (props.isAdd) res = await props.addFun(props.A_EForm);
        else res = await props.editFun(props.A_EForm);
        if (res.code === 200) {
          props.reQueryFun();
          ElMessage.success(`${props.A_ETitle}成功`);
        }
        // A_EVisible.value = false; //隐藏弹出框
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };
</script>

<style lang="scss">
  .A_EDialogFormItem:last-child {
    margin-bottom: 0 !important;
    & > .el-form-item {
      margin-bottom: 0 !important;
    }
  }
</style>

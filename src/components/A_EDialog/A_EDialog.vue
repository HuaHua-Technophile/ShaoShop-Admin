<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :before-close="closeConfirmFun"
    class="rounded-4"
    draggable
    center>
    <template #header>
      <el-button @click="A_EFun" :loading="loading"
        >确认{{ title }}<span v-if="!isAdd">ID: {{ id }}</span></el-button
      >
    </template>
    <slot></slot>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { AxiosInstance } from "@/api/instance";
  import { ElMessage, FormInstance } from "element-plus";

  const visible = defineModel<boolean>("visible");
  const loading = defineModel<boolean>("loading");
  const props = withDefaults(
    defineProps<{
      // visible: boolean;
      // loading: boolean;
      title: string;
      isAdd: boolean;
      id?: number;
      width?: string;
      fromRef: FormInstance | undefined; //页面加载完毕前可能传入undefined
      addFun: AxiosInstance;
      editFun: AxiosInstance;
      from: object;
      requestFun: () => void;
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
    elMessageBoxConfirm(`放弃${props.title}`, () => {
      done();
      // emit("update:visible", false); 不使用defineModel的方法
      ElMessage.info(`放弃${props.title}`);
    });
  };

  const A_EFun = async () => {
    props.fromRef?.validate(async (valid, fields) => {
      if (valid) {
        loading.value = true;
        let res;
        if (props.isAdd) res = await props.addFun(props.from);
        else res = await props.editFun(props.from);
        if (res.code === 200) {
          props.requestFun();
          ElMessage.success(`${props.title}成功`);
        }
        visible.value = false; //隐藏弹出框
        loading.value = false;
      } else console.log("error submit!", fields);
    });
  };
</script>

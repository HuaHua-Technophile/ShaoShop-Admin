import { ElMessage, ElMessageBox } from "element-plus";

export const elMessageBoxConfirm = (title: string, cb: () => void) => {
  ElMessageBox.confirm(`确认${title}吗?`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
    customClass: "rounded",
  })
    .then(cb)
    .catch(() => {
      ElMessage.info(`取消操作:${title}`);
    });
};

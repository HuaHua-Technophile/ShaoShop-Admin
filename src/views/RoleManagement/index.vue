<template>
  <div class="w-100 h-100 p-3">
    <div ref="roleListWrapper" class="w-100 h-100 overflow-hidden rounded-4">
      <div
        style="
          min-height: calc(100% + 1px) !important;
          padding: 1px 0 !important;
        ">
        <div class="bg-body p-3 rounded-4">
          <div v-for="(i, index) in roleList">
            <el-descriptions :title="i.roleName">
              <template #extra>
                <fontIcon icon="bi bi-pencil-square  fs-5 me-2" role="button" />
                <fontIcon icon="bi bi-trash fs-5 text-danger" role="button" />
              </template>
              <el-descriptions-item label="角色ID">{{
                i.roleId
              }}</el-descriptions-item>
              <el-descriptions-item label="角色Key">{{
                i.roleKey || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="角色排序">{{
                i.roleSort || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="管理员">{{
                i.admin ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{
                i.status
              }}</el-descriptions-item>
              <el-descriptions-item label="所属商户id">{{
                i.businessId || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="是否严格校验商户">{{
                i.companyCheckStrictly ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="创建者">{{
                i.createBy || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                i.createTime || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="最后更新者">{{
                i.updateBy || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="最后更新时间">{{
                i.updateTime || "暂无"
              }}</el-descriptions-item>

              <el-descriptions-item label="dataScope">{{
                i.createTime || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="是否严格校验菜单">{{
                i.menuCheckStrictly ? "是" : "否"
              }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{
                i.remark || "暂无"
              }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{
                i.remark || "暂无"
              }}</el-descriptions-item>
            </el-descriptions>
            <el-divider v-if="index < roleList!.length - 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getRoleList, deleteRole } from "@/api/RoleManagement";
  import BScroll from "@better-scroll/core";
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"; //bs类型
  import { nextTick, onMounted, ref } from "vue";
  import { roleTpye } from "@/type";
  import { ElMessage } from "element-plus";

  //获取数据-----------------------
  const roleList = ref<roleTpye[]>();
  const getRoleListFun = async () => {
    let res = await getRoleList();
    console.log("获取的角色列表=>", res);
    roleList.value = res.data;
    await nextTick();
    bs?.refresh();
  };
  getRoleListFun();

  // better scroll-------------------------
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const roleListWrapper = ref();
  let bs: BScrollConstructor<{}> | null = null;
  onMounted(() => {
    bs = new BScroll(roleListWrapper.value, {
      scrollbar: true,
      mouseWheel: true,
    });
  });

  // 删除角色
  const deleteRoleFun = async (roleId: number) => {
    let res = await deleteRole(roleId);
    console.log("删除的角色列表=>", res);
    if (res.code == 200) {
      ElMessage.success({
        message: "删除成功",
      });
      getRoleListFun();
    } else {
      ElMessage.error({
        message: "删除失败",
      });
    }
  };
</script>

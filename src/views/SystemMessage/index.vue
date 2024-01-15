<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据时间/是否已读 筛选消息 -->
    <el-form></el-form>
    <!-- 消息列表模块 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="userListWrapper"
        class="userListWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            :data="systemMessageList"
            table-layout="auto"
            header-cell-class-name="text-center"
            row-class-name="bg-body"
            cell-class-name="text-center"
            class="bg-body rounded-4"
            empty-text="暂无符合查询条件的消息">
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="messageId" label="ID" />
            <el-table-column prop="receiverName" label="收件人" />
            <el-table-column
              prop="messageContent"
              label="内容概览" /><el-table-column
              prop="updateBy"
              label="更新者" />
            <el-table-column prop="updateTime" label="更新时间">
              <template #default="scope">
                <el-tooltip
                  :content="scope.row.updateTime"
                  effect="light"
                  placement="left">
                  <el-text style="max-width: 100px" truncated>
                    {{ scope.row.updateTime }}
                  </el-text>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getSystemMessage } from "@/api/SystemMessageAPI";
  import { messageQueryFromType, systemMessageType } from "@/type";
  import { reactive, ref } from "vue";

  // 不传参数的情况下，就是获取所有消息。传参数的情况下可用作根据时间和是否已读来搜索
  const systemMessageList = ref<systemMessageType[]>([]);
  let allPageCount = ref(-1); //总的页数
  let allMessageCount = ref(-1); //总消息数量
  let nowPage = ref(1); // 当前页数
  let tableItemHeight = ref<number | undefined>(-1); //每一项高度
  let tableHeaderHeight = ref<number | undefined>(-1); //表头高度
  const messageQueryFrom = reactive<messageQueryFromType>({
    createTime: null, //发送时间
    read: null, //是否已读
    currentPage: 1, //页码
    pageSize: 20, //每页返回的数量
  });
  const getSystemMessageFun = async () => {
    let res = await getSystemMessage(messageQueryFrom);
    console.log("系统消息=>", res);
    if (res.code == 200) {
      systemMessageList.value.push(...res.data.records);
    }
  };
  getSystemMessageFun();
</script>

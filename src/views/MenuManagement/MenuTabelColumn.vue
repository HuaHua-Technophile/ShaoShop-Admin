<template>
  <el-table-column label="ID" prop="menuId" />
  <el-table-column label="菜单名称" prop="menuName" />
  <el-table-column label="图标">
    <template #default="scope">
      <!-- effect="light/dark"是反过来的  -->
      <el-tooltip
        effect="light"
        :offset="0"
        :content="scope.row.icon"
        placement="right">
        <div>
          <FontIcon :icon="scope.row.icon" />
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
  <el-table-column label="排序" prop="orderNum" />
  <el-table-column prop="status" label="状态">
    <template #default="scope">
      <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
        scope.row.status == 0 ? "正常" : "停用"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column prop="visible" label="显/隐">
    <template #default="scope">
      <el-tag :type="scope.row.visible == 0 ? 'success' : 'warning'">{{
        scope.row.visible == 0 ? "显示" : "隐藏"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column prop="isFrame" label="是否外链">
    <template #default="scope">
      <el-tag :type="scope.row.isFrame == 0 ? 'success' : 'info'">{{
        scope.row.isFrame == 0 ? "是" : "否"
      }}</el-tag>
    </template>
  </el-table-column>
  <el-table-column prop="menuType" label="类型">
    <template #default="scope">
      <el-tag
        effect="dark"
        :type="
          scope.row.menuType == 'M'
            ? 'primary'
            : scope.row.menuType == 'C'
            ? 'success'
            : 'danger'
        "
        >{{
          scope.row.menuType == "M"
            ? "目录"
            : scope.row.menuType == "C"
            ? "菜单"
            : "按钮"
        }}</el-tag
      >
    </template>
  </el-table-column>
  <el-table-column prop="path" label="路径">
    <template #default="scope">
      <el-tooltip :content="scope.row.path" effect="light" placement="left">
        <el-text style="max-width: 100px" truncated>
          {{ scope.row.path }}
        </el-text>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据规格名称搜索 -->
    <el-form
      :model="queryFrom"
      ref="queryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-0 px-sm-1 px-md-2 px-lg-3">
      <el-form-item
        label="商品规格名称"
        prop="productSpec"
        class="flex-grow-1 overflow-hidden">
        <el-input
          clearable
          maxlength="10"
          v-model.trim="queryFrom.productSpec"
          placeholder="商品规格名称"
          :prefix-icon="renderFontIcon('fa-solid fa-ruler-combined')" />
      </el-form-item>
      <el-form-item class="mx-0 mx-sm-1 mx-md-2 mx-lg-3">
        <el-button :loading="loading" @click="queryFun">查询</el-button>
      </el-form-item>
      <el-form-item>
        <jumpPageBtn
          :queryFun="getFun"
          :allPageCount="allPageCount"
          :nowPage="nowPage"
          :visible="true"
          :bs="bs"
          :tableItemHeight="tableItemHeight"
          :tableHeaderHeight="tableHeaderHeight"
          :queryFrom="queryFrom"
          :defaultPageSize="defaultPageSize" />
      </el-form-item>
    </el-form>
    <!-- 商品规格列表 -->
    <div class="flex-grow-1 overflow-hidden p-0 p-sm-1 p-md-2 p-lg-3">
      <div
        ref="bsWrapper"
        class="bsWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            v-loading="loading"
            ref="PSNTableRef"
            :data="allPSNList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="specificationsId"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的商品规格"
            @cell-click="cellClickFun"
            @expand-change="expandChangeFun">
            <!-- 外层表格扩展 -->
            <el-table-column type="expand">
              <template #default="props">
                <div
                  style="max-height: 600px !important"
                  class="overflow-hidden"
                  :id="`BSRef${props.row.specificationsId}`">
                  <div
                    class="内层BS"
                    style="
                      min-height: calc(100% + 1px) !important;
                      padding: 1px 0 !important;
                    ">
                    <div
                      v-if="props.row.productSpecificationsList?.length > 0"
                      class="px-4">
                      <el-collapse>
                        <el-collapse-item
                          v-for="i in props.row.productSpecificationsList"
                          :name="i.keyName"
                          :title="`${i.keyName}(${i.valueList?.length})`">
                          <div class="d-flex align-items-center flex-wrap">
                            <el-tag
                              v-for="tag in i.valueList"
                              :key="tag"
                              class="me-2 mb-2"
                              :disable-transitions="false">
                              {{ tag }}
                            </el-tag>
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                    <div
                      v-else
                      class="d-flex align-items-center justify-content-center text-body-tertiary">
                      暂未添加二级规格,请点击右侧<fontIcon
                        icon="bi bi-pencil-square  fs-6 mx-1" />按钮进行编辑添加
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="specificationsId" label="规格ID" />
            <el-table-column prop="specName" label="规格名称" />
            <el-table-column prop="keyName" label="keyName" />
            <el-table-column prop="valueName" label="valueName" />
            <el-table-column>
              <template #header>
                <el-button @click="toAdd">添加规格</el-button>
              </template>
              <template #default>
                <fontIcon icon="bi bi-pencil-square  fs-6 me-2" role="button" />
                <fontIcon icon="bi bi-trash fs-6 text-danger" role="button" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 添加/修改商品规格弹窗 -->
    <el-dialog
      v-model="A_EVisible"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <template #header>
        <el-button @click="A_EFun" :loading="loading"
          >确认{{ A_ETitle
          }}<span v-if="!isAdd"
            >ID: {{ A_EFrom.specificationsId }}</span
          ></el-button
        >
      </template>
      <el-form :model="A_EFrom" ref="A_EFromRef" :rules="A_ERules">
        <el-form-item label="商品规格名称" prop="specName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="A_EFrom.specName"
            placeholder="商品规格名称"
            :prefix-icon="renderFontIcon('fa-solid fa-pen-ruler')">
          </el-input>
        </el-form-item>
        <el-form-item label="二级商品规格" style="padding-left: 10.18px">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="keyName"
            placeholder="二级商品规格(回车确认添加)"
            @keydown="enterConfirm"
            :prefix-icon="renderFontIcon('fa-solid fa-ruler-combined')">
          </el-input>
        </el-form-item>
        <el-collapse
          class="w-100"
          v-if="A_EFrom.productSpecificationsList?.length! > 0">
          <el-collapse-item
            v-for="(i, index) in A_EFrom.productSpecificationsList"
            :name="i.keyName">
            <template #title>
              <Transition
                enter-active-class="animate__animated animate__fadeInUp"
                leave-active-class="animate__animated animate__fadeOutUp">
                <div v-if="i.editStatus" class="position-absolute">
                  <el-input
                    clearable
                    maxlength="10"
                    v-model.trim="i.keyName"
                    placeholder="二级规格名称"
                    @keydown="enterConfirm($event, index)"
                    :prefix-icon="
                      renderFontIcon('fa-solid fa-ruler-combined')
                    " />
                </div>
                <div class="d-flex align-items-center" v-else>
                  <span class="me-3"
                    >{{ i.keyName || "空值" }} ({{
                      i.valueList?.length || 0
                    }})</span
                  >
                  <fontIcon
                    @click="editCollapse(index)"
                    icon="bi-pencil-square  fs-6 me-2"
                    role="button" />
                  <fontIcon
                    @click="delCollapse(i.keyName)"
                    icon="bi bi-trash fs-6 text-danger"
                    role="button" />
                </div>
              </Transition>
            </template>
            <div class="d-flex align-items-center flex-wrap">
              <el-tag
                v-for="tag in i.valueList"
                :key="tag"
                class="me-2 mb-2"
                closable
                :disable-transitions="false"
                @close="delTag(tag, index)">
                {{ tag }}
              </el-tag>
              <el-input
                size="small"
                style="width: 80px"
                class="mb-2"
                maxlength="10"
                v-model.trim="i.tag"
                placeholder="新规格"
                @keydown="enterConfirm($event, index)" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
    <!-- 右下角悬浮跳页按钮 -->
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut">
      <jumpPageBtn
        class="position-absolute p-2 rounded-pill me-3 mb-3"
        style="background: #141414; right: 0; bottom: 0"
        :queryFun="getFun"
        :allPageCount="allPageCount"
        :nowPage="nowPage"
        :visible="jumpPageBtnVisible"
        :bs="bs"
        :tableItemHeight="tableItemHeight"
        :tableHeaderHeight="tableHeaderHeight"
        :queryFrom="queryFrom"
        :defaultPageSize="defaultPageSize" />
    </Transition>
  </div>
</template>
<script lang="ts" setup>
  import { PSNType, PSNQueryType } from "@/type";
  import {
    getPSNList,
    addPSN,
    editPSN,
    getPSNificationList,
    delPSN,
  } from "@/api/ProductSpecificationsAPI";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";

  import { nextTick, onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import ObserveDOM from "@better-scroll/observe-dom"; //自动重载
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, cloneDeep, throttle } from "lodash";
  import { ElMessage, FormInstance } from "element-plus";

  // 不传参数的情况下，就是获取所有商品规格。传参数的情况下可用作搜索
  const allPSNList = ref<PSNType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const loading = ref(false);
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const queryFrom = reactive<PSNQueryType>({
    productSpec: "", //商品规格名称
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryRules = reactive({});
  const getFun = async (excessDataCount?: number) => {
    let closePullUp;
    loading.value = true;
    const res = await getPSNList(queryFrom);
    console.log(
      `查询条件`,
      queryFrom,
      `\n第${queryFrom.currentPage}页商品规格(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      allPSNList.value.push(...res.data.records);
      await nextTick();

      // 每次请求都重新赋值总页数
      allPageCount.value = ceil(Number(res.data.total) / defaultPageSize);

      // 如果是页面初次加载,则获取元素高度
      if (!tableItemHeight)
        tableItemHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__row")!)
            .height.replace("px", "")
        );
      if (!tableHeaderHeight)
        tableHeaderHeight = Number(
          window
            .getComputedStyle(document.querySelector(".el-table__body-header")!)
            .height.replace("px", "")
        );
      //如果加载完了就关闭上拉
      if (allPSNList.value.length >= res.data.total) {
        bs.closePullUp();
        closePullUp = true;
      }
    } else bs.closePullUp();
    loading.value = false;
    return { closePullUp };
  };
  getFun();

  const getPSNificationListFun = async (id: number, dontLoad?: boolean) => {
    const index = allPSNList.value.findIndex((i) => i.specificationsId == id);
    if (!dontLoad) {
      const res = await getPSNificationList(id);
      if (res.code == 200) {
        console.log(
          `${allPSNList.value[index].specName}中未添加具体规格=>`,
          res.data
        );
        if (
          !(
            res.data.productSpecificationsList?.length == 1 &&
            res.data.productSpecificationsList[0].keyName == null
          )
        )
          allPSNList.value[index].productSpecificationsList =
            res.data.productSpecificationsList;
        else allPSNList.value[index].productSpecificationsList = [];
      }
    }
    loading.value = false;
    return index;
  };

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  BScroll.use(ObserveDOM);
  const bsWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(bsWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
      observeDOM: true,
    });
    bs.on("pullingUp", async () => {
      queryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", queryFrom.currentPage);
      const { closePullUp } = await getFun();
      if (!closePullUp) bs!.finishPullUp();
    });
    bs.on(
      "scroll",
      // 使用节流,实时刷新当前页面
      throttle((e: { x: number; y: number }) => {
        if (-e.y + 1 > tableHeaderHeight!) jumpPageBtnVisible.value = true;
        else jumpPageBtnVisible.value = false;
        // 滚动高度-表头高度=实际滚动内容
        nowPage.value = ceil(
          (-e.y - tableHeaderHeight! + bsWrapper.value.clientHeight) /
            (tableItemHeight! * queryFrom.pageSize)
        );
        /* console.log(
              `视窗高${PSNListWrapper.value.clientHeight}px,表头高${
                tableHeaderHeight
              }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
              nowPage.value
            ); */
      }, 400)
    );
  });
  // 内层bs------------------
  const bsInners = ref<{ [key: number]: BScrollConstructor }>({}); //bs实例
  const expandChangeFun = async (row: PSNType, expandedRows: PSNType[]) => {
    // 如果是展开,就检查是否已有二级规格数据(没有就添加)
    loading.value = true; //禁止操作,以防在一次性重载大量数据时页面卡顿,而多次点击展开收起
    if (expandedRows.includes(row)) {
      await getPSNificationListFun(
        row.specificationsId!,
        Boolean(row.productSpecificationsList)
      );
      await nextTick();
      bsInners.value[row.specificationsId!] = new BScroll(
        `#BSRef${row.specificationsId!}`,
        {
          scrollbar: true,
          mouseWheel: true,
          nestedScroll: {
            groupId: 1, // string or number
          },
          observeDOM: true,
        }
      );
    } else bsInners.value[row.specificationsId!]?.destroy();
    loading.value = false;
  };

  //表格点击回调----------------------
  const cellClickFun = (
    row: PSNType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      toEdit(row.specificationsId!, Boolean(row.productSpecificationsList));
    if (event.target.className.includes("bi-trash")) delFun(row);
  };

  //dialog弹出框表单-----------------------
  const A_EFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultA_EFrom: PSNType = {
    productSpecificationsList: [],
    specName: "",
  };
  let A_EFrom = reactive(defaultA_EFrom);
  const keyName = ref("");
  const A_ERules = reactive({
    specName: [
      { required: true, message: "请输入商品规格名称", trigger: "blur" },
    ],
  });
  //dialog弹出框-----------------------
  const A_EVisible = ref(false);
  const A_ETitle = ref("添加商品规格");
  const isAdd = ref(true);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${A_ETitle.value}`, () => {
      done();
      A_EFromRef.value?.resetFields();
      A_EFromRef.value?.clearValidate();
      ElMessage.info(`放弃${A_ETitle.value}`);
    });
  };
  const enterConfirm = (e: KeyboardEvent, ind?: number) => {
    // 添加二级规格
    if (e.key === "Enter" && ind === undefined) {
      if (
        A_EFrom.productSpecificationsList?.some(
          (i) => i.keyName == keyName.value
        )
      )
        ElMessage.error(`已存在二级规格:'${keyName.value}'`);
      else if (keyName.value == "") ElMessage.error(`不可为空`);
      else {
        A_EFrom.productSpecificationsList?.push({
          keyName: keyName.value,
          valueList: [],
        });
        keyName.value = "";
      }
    }
    // 修改二级规格或添加三级规格
    if (e.key === "Enter" && ind !== undefined) {
      // 如果是编辑状态,说明是修改二级规格
      if (A_EFrom.productSpecificationsList![ind].editStatus) {
        if (A_EFrom.productSpecificationsList![ind].keyName == "")
          ElMessage.error(`不可为空`);
        else delete A_EFrom.productSpecificationsList![ind].editStatus; //直接删除临时属性
      }
      // 不在编辑状态,说明是添加三级规格
      else {
        if (
          A_EFrom.productSpecificationsList![ind].valueList.some(
            (i) => i == A_EFrom.productSpecificationsList![ind].tag
          )
        )
          ElMessage.error(
            `'${
              A_EFrom.productSpecificationsList![ind].keyName
            }'上已存在规格值:'${A_EFrom.productSpecificationsList![ind].tag}'`
          );
        else if (
          A_EFrom.productSpecificationsList![ind].tag == "" ||
          A_EFrom.productSpecificationsList![ind].tag == undefined
        )
          ElMessage.error(`不可为空`);
        else {
          A_EFrom.productSpecificationsList![ind].valueList.push(
            A_EFrom.productSpecificationsList![ind].tag!
          );
          delete A_EFrom.productSpecificationsList![ind].tag; //直接删除临时属性,避免传参时出错
        }
      }
    }
  };
  const editCollapse = (ind: number) => {
    A_EFrom.productSpecificationsList![ind].editStatus = true;
  };
  const delCollapse = (keyName: string) => {
    elMessageBoxConfirm(`删除二级规格:'${keyName}'`, () => {
      A_EFrom.productSpecificationsList =
        A_EFrom.productSpecificationsList?.filter((i) => i.keyName != keyName);
      ElMessage.success(`删除二级规格:'${keyName}'`);
    });
  };
  const delTag = (tag: string, ind: number) => {
    elMessageBoxConfirm(`删除规格值:'${tag}'`, () => {
      A_EFrom.productSpecificationsList![ind].valueList =
        A_EFrom.productSpecificationsList![ind].valueList.filter(
          (i) => i != tag
        );
      ElMessage.success(`删除规格值:'${tag}'`);
    });
  };

  //添加/修改商品规格----------------
  const toAdd = () => {
    A_EFrom = reactive(cloneDeep(defaultA_EFrom));
    isAdd.value = true;
    A_ETitle.value = "添加商品规格";
    A_EVisible.value = true;
  };
  const toEdit = async (id: number, dontLoad: boolean) => {
    const index = await getPSNificationListFun(id, dontLoad);
    A_EFrom = reactive(cloneDeep(allPSNList.value[index!]));
    isAdd.value = false;
    A_ETitle.value = "修改商品规格";
    A_EVisible.value = true;
  };
  const A_EFun = () => {
    A_EFromRef.value?.validate(async (valid, fields) => {
      if (valid) {
        // 验证二级规格名称是否有空值
        if (!A_EFrom.productSpecificationsList?.some((i) => i.keyName == "")) {
          loading.value = true;
          let res;
          if (isAdd.value) res = await addPSN(A_EFrom);
          else res = await editPSN(A_EFrom);
          if (res.code === 200) {
            ElMessage.success(`${A_ETitle.value}成功`);
            allPSNList.value = [];
            queryFrom.currentPage = 1;
            getFun(); //重新请求数据进行商品规格列表渲染
            // dialogVisible.value = false; //隐藏弹出框
          }
          loading.value = false;
        } else ElMessage.error("二级规格名称不可为空");
      } else console.log("error submit!", fields);
    });
  };

  //查询商品规格------------------------------
  const queryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryFun = async () => {
    queryFromRef.value?.validate(async (valid, fields) => {
      if (valid) {
        allPSNList.value = [];
        queryFrom.currentPage = 1;
        getFun(); //重新请求数据进行商品规格列表渲染
      } else console.log("error submit!", fields);
    });
  };

  // 删除商品规格------------------
  const delFun = (PSN: PSNType) => {
    elMessageBoxConfirm(`删除规格'${PSN.specName}'`, async () => {
      loading.value = true;
      const res = await delPSN(PSN.specificationsId!);
      if (res.code === 200) {
        ElMessage.success(`删除规格'${PSN.specName}'成功`);
        allPSNList.value = [];
        queryFrom.currentPage = 1;
        getFun(); //重新请求数据进行商品规格列表渲染
      }
      loading.value = false;
    });
  };
</script>
<style lang="scss">
  .el-collapse-item__content {
    padding-bottom: 0 !important;
  }
</style>

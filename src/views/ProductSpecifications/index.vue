<template>
  <div class="w-100 h-100 d-flex flex-column">
    <!-- 根据规格名称搜索 -->
    <el-form
      :model="productSpecQueryFrom"
      ref="productSpecQueryFromRef"
      :rules="queryRules"
      class="bg-body flex-shrink-0 d-flex flex-nowrap align-items-center px-4">
      <el-form-item label="商品规格名称" prop="productSpec" class="flex-grow-1">
        <el-input
          clearable
          maxlength="10"
          v-model.trim="productSpecQueryFrom.productSpec"
          placeholder="商品规格名称"
          :prefix-icon="renderFontIcon('fa-solid fa-ruler-combined')" />
      </el-form-item>
      <el-form-item class="ms-3">
        <el-button
          :loading="waitAddOrEditProductSpec"
          @click="queryProductSpecFun"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item class="ms-3">
        <jumpPageBtn
          :queryFun="getProductSpecListFun"
          :allPageCount="allPageCount"
          :nowPage="nowPage"
          :visible="true"
          :bs="bs"
          :tableItemHeight="tableItemHeight"
          :tableHeaderHeight="tableHeaderHeight"
          :queryFrom="productSpecQueryFrom"
          :defaultPageSize="defaultPageSize" />
      </el-form-item>
    </el-form>
    <!-- 商品规格列表 -->
    <div class="flex-grow-1 overflow-hidden p-3">
      <div
        ref="productSpecWrapper"
        class="productSpecWrapper position-relative w-100 h-100 overflow-hidden rounded-4">
        <div
          style="
            min-height: calc(100% + 1px) !important;
            padding: 1px 0 !important;
          ">
          <el-table
            ref="productSpecTableRef"
            :data="allProductSpecList"
            table-layout="auto"
            class="bg-body rounded-4"
            header-cell-class-name="text-center"
            row-key="specificationsId"
            row-class-name="bg-body"
            cell-class-name="text-center"
            empty-text="暂无符合查询条件的商品规格"
            @cell-click="cellClickFun">
            <!-- 外层表格扩展 -->
            <el-table-column type="expand"> </el-table-column>
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column prop="specificationsId" label="规格ID" />
            <el-table-column prop="specName" label="规格名称" />
            <el-table-column prop="keyName" label="keyName" />
            <el-table-column prop="valueName" label="valueName" />
            <el-table-column>
              <template #header>
                <el-button @click="addProductSpecDialog">添加规格</el-button>
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
      v-model="dialogVisible"
      width="450px"
      :before-close="closeConfirmFun"
      class="rounded-4"
      draggable
      center>
      <template #header>
        <el-button
          @click="addOrEditProductSpecFun"
          :loading="waitAddOrEditProductSpec"
          >确认{{ dialogTitle
          }}<span v-if="!isAddProductSpec"
            >ID: {{ productSpecForm.specNameId }}</span
          ></el-button
        >
      </template>
      <el-form
        :model="productSpecForm"
        ref="dialogFromRef"
        :rules="productSpecRules">
        <el-form-item label="商品规格名称" prop="specName">
          <el-input
            clearable
            maxlength="10"
            v-model.trim="productSpecForm.specName"
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
          v-if="productSpecForm.productSpecificationsList.length > 0">
          <el-collapse-item
            v-for="(i, index) in productSpecForm.productSpecificationsList"
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
                    "></el-input>
                </div>
                <div class="d-flex align-items-center" v-else>
                  <span class="me-3"
                    >{{ i.keyName }} ({{ i.valueList.length }})</span
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
        :queryFun="getProductSpecListFun"
        :allPageCount="allPageCount"
        :nowPage="nowPage"
        :visible="jumpPageBtnVisible"
        :bs="bs"
        :tableItemHeight="tableItemHeight"
        :tableHeaderHeight="tableHeaderHeight"
        :queryFrom="productSpecQueryFrom"
        :defaultPageSize="defaultPageSize" />
    </Transition>
  </div>
</template>
<script lang="ts" setup>
  import {
    productSpecEditType,
    productSpecQueryType,
    productSpecType,
  } from "@/type";
  import {
    getProductSpecList,
    addProductSpec,
    editProductSpec,
    getProductSpecificationList,
    delProductSpec,
  } from "@/api/ProductSpecificationsAPI";
  import { elMessageBoxConfirm } from "@/utils/elMessageBoxConfirm/elMessageBoxConfirm";
  import { renderFontIcon } from "@/utils/fontIcon/renderFontIcon";

  import { nextTick, onMounted, reactive, ref } from "vue";
  import BScroll from "@better-scroll/core";
  import Pullup from "@better-scroll/pull-up"; //上拉懒加载
  import ScrollBar from "@better-scroll/scroll-bar"; //滚动条
  import MouseWheel from "@better-scroll/mouse-wheel"; //鼠标滚轮
  import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
  import { ceil, cloneDeep, throttle } from "lodash";
  import { ElMessage, FormInstance } from "element-plus";

  // 不传参数的情况下，就是获取所有商品规格。传参数的情况下可用作搜索
  const allProductSpecList = ref<productSpecType[]>([]);
  const allPageCount = ref(-1); //总的页数
  const nowPage = ref(1); // 当前页数
  const defaultPageSize = 20;
  let tableItemHeight: number; //每一项高度
  let tableHeaderHeight: number; //表头高度
  const waitQueryProductSpec = ref(false);
  const productSpecQueryFrom = reactive<productSpecQueryType>({
    productSpec: "", //商品规格名称
    currentPage: 1, //请求的页码
    pageSize: defaultPageSize, //每页返回的数量
  });
  const queryRules = reactive({});
  const getProductSpecListFun = async (excessDataCount?: number) => {
    let closePullUp;
    waitQueryProductSpec.value = true;
    const res = await getProductSpecList(productSpecQueryFrom);
    waitQueryProductSpec.value = false;
    console.log(
      `查询条件`,
      productSpecQueryFrom,
      `\n第${productSpecQueryFrom.currentPage}页商品规格(${res.data?.records?.length})=>`,
      res
    );
    if (res.code == 200 && res.data.records.length > 0) {
      if (excessDataCount) res.data.records.splice(0, excessDataCount);
      allProductSpecList.value.push(...res.data.records);
      await nextTick();
      bs.refresh();

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
      if (allProductSpecList.value.length >= res.data.total) {
        bs.closePullUp();
        closePullUp = true;
      }
    } else bs.closePullUp();
    return { closePullUp };
  };
  getProductSpecListFun();

  // better scroll-------------------------
  BScroll.use(Pullup);
  BScroll.use(ScrollBar);
  BScroll.use(MouseWheel);
  const productSpecWrapper = ref();
  const jumpPageBtnVisible = ref(false);
  let bs: BScrollConstructor<{}>;
  onMounted(() => {
    bs = new BScroll(productSpecWrapper.value, {
      pullUpLoad: {
        threshold: -10,
      },
      scrollbar: true,
      mouseWheel: true,
    });
    bs.on("pullingUp", async () => {
      productSpecQueryFrom.currentPage++; //请求页码自增
      console.log("触发了pullingUp,页码自增", productSpecQueryFrom.currentPage);
      const { closePullUp } = await getProductSpecListFun();
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
          (-e.y - tableHeaderHeight! + productSpecWrapper.value.clientHeight) /
            (tableItemHeight! * productSpecQueryFrom.pageSize)
        );
        /* console.log(
              `视窗高${ProductSpecListWrapper.value.clientHeight}px,表头高${
                tableHeaderHeight
              }px,单格高${tableItemHeight}px,滚动了=>${-e.y}px,`,
              nowPage.value
            ); */
      }, 400)
    );
  });

  //表格点击回调-------------
  const cellClickFun = (
    row: productSpecType,
    column: any,
    cell: any,
    event: { target: HTMLElement }
  ) => {
    column;
    cell;
    if (event.target.className.includes("bi-pencil-square"))
      editProductSpecDialog(row);
    if (event.target.className.includes("bi-trash")) delProductSpecFun(row);
  };

  //dialog弹出框表单-----------------------
  const dialogFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const defaultProductSpec: productSpecEditType = {
    productSpecificationsList: [],
    specName: "",
  };
  let productSpecForm = reactive(defaultProductSpec);
  const keyName = ref("");
  const productSpecRules = reactive({
    specName: [
      { required: true, message: "请输入商品规格名称", trigger: "blur" },
    ],
  });
  //dialog弹出框-----------------------
  const dialogVisible = ref(false);
  const dialogTitle = ref("添加商品规格");
  const isAddProductSpec = ref(true);
  const waitAddOrEditProductSpec = ref(false);
  const closeConfirmFun = (done: () => void) => {
    elMessageBoxConfirm(`放弃${dialogTitle.value}`, () => {
      done();
      dialogFromRef.value?.resetFields();
      dialogFromRef.value?.clearValidate();
      ElMessage.info(`放弃${dialogTitle.value}`);
    });
  };
  const enterConfirm = (e: KeyboardEvent, collapseIndex?: number) => {
    // 添加二级规格
    if (e.key === "Enter" && collapseIndex === undefined) {
      if (
        productSpecForm.productSpecificationsList.some(
          (i) => i.keyName == keyName.value
        )
      )
        ElMessage.error(`已存在二级规格:'${keyName.value}'`);
      else if (keyName.value == "") ElMessage.error(`不可为空`);
      else {
        productSpecForm.productSpecificationsList.push({
          keyName: keyName.value,
          valueList: [],
        });
        keyName.value = "";
      }
    }
    // 修改二级规格或添加三级规格
    if (e.key === "Enter" && collapseIndex !== undefined) {
      // 如果是编辑状态,说明是修改二级规格
      if (productSpecForm.productSpecificationsList[collapseIndex].editStatus) {
        if (
          productSpecForm.productSpecificationsList[collapseIndex].keyName == ""
        )
          ElMessage.error(`不可为空`);
        else
          delete productSpecForm.productSpecificationsList[collapseIndex]
            .editStatus; //直接删除临时属性
      }
      // 不在编辑状态,说明是添加三级规格
      else {
        if (
          productSpecForm.productSpecificationsList[
            collapseIndex
          ].valueList.some(
            (i) =>
              i == productSpecForm.productSpecificationsList[collapseIndex].tag
          )
        )
          ElMessage.error(
            `'${productSpecForm.productSpecificationsList[collapseIndex].keyName}'上已存在规格值:'${productSpecForm.productSpecificationsList[collapseIndex].tag}'`
          );
        else if (
          productSpecForm.productSpecificationsList[collapseIndex].tag == "" ||
          productSpecForm.productSpecificationsList[collapseIndex].tag ==
            undefined
        )
          ElMessage.error(`不可为空`);
        else {
          productSpecForm.productSpecificationsList[
            collapseIndex
          ].valueList.push(
            productSpecForm.productSpecificationsList[collapseIndex].tag!
          );
          delete productSpecForm.productSpecificationsList[collapseIndex].tag; //直接删除临时属性,避免传参时出错
        }
      }
    }
  };
  const editCollapse = (collapseIndex: number) => {
    productSpecForm.productSpecificationsList[collapseIndex].editStatus = true;
  };
  const delCollapse = (keyName: string) => {
    elMessageBoxConfirm(`删除二级规格:'${keyName}'`, () => {
      productSpecForm.productSpecificationsList =
        productSpecForm.productSpecificationsList.filter(
          (i) => i.keyName != keyName
        );
      ElMessage.success(`删除二级规格:'${keyName}'`);
    });
  };
  const delTag = (tag: string, collapseIndex: number) => {
    elMessageBoxConfirm(`删除规格值:'${tag}'`, () => {
      productSpecForm.productSpecificationsList[collapseIndex].valueList =
        productSpecForm.productSpecificationsList[
          collapseIndex
        ].valueList.filter((i) => i != tag);
      ElMessage.success(`删除规格值:'${tag}'`);
    });
  };

  //添加/修改商品规格----------------
  const addProductSpecDialog = () => {
    productSpecForm = reactive(cloneDeep(defaultProductSpec));
    dialogVisible.value = true;
    isAddProductSpec.value = true;
    dialogTitle.value = "添加商品规格";
  };
  const editProductSpecDialog = async (productSpec: productSpecType) => {
    //
    let res = await getProductSpecificationList(productSpec.specificationsId);
    if (res.code == 200) {
      console.log(
        `获取到ID${productSpec.specificationsId}的商品规格=>`,
        res.data
      );
      productSpecForm = reactive(cloneDeep(res.data));
      dialogVisible.value = true;
      isAddProductSpec.value = false;
      dialogTitle.value = "修改商品规格";
    }
  };
  const addOrEditProductSpecFun = () => {
    dialogFromRef.value?.validate(async (valid, fields) => {
      if (valid) {
        // 验证二级规格名称是否有空值
        if (
          !productSpecForm.productSpecificationsList.some(
            (i) => i.keyName == ""
          )
        ) {
          waitAddOrEditProductSpec.value = true;
          let res;
          if (isAddProductSpec.value)
            res = await addProductSpec(productSpecForm);
          else res = await editProductSpec(productSpecForm);
          if (res.code === 200) {
            ElMessage.success(`${dialogTitle.value}成功`);
            allProductSpecList.value = [];
            productSpecQueryFrom.currentPage = 1;
            getProductSpecListFun(); //重新请求数据进行商品规格列表渲染
            // dialogVisible.value = false; //隐藏弹出框
          } else ElMessage.error(res.message);
          waitAddOrEditProductSpec.value = false;
        } else ElMessage.error("二级规格名称不可为空");
      } else console.log("error submit!", fields);
    });
  };

  //查询商品规格-------------------------------------
  const productSpecQueryFromRef = ref<FormInstance>(); //表单实例,在验证表单规则时,需调用实例内的validate方法
  const queryProductSpecFun = async () => {
    productSpecQueryFromRef.value?.validate(async (valid, fields) => {
      if (valid) {
        allProductSpecList.value = [];
        productSpecQueryFrom.currentPage = 1;
        getProductSpecListFun(); //重新请求数据进行商品规格列表渲染
      } else console.log("error submit!", fields);
    });
  };

  // 删除------------------
  const delProductSpecFun = (productSpec: productSpecType) => {
    elMessageBoxConfirm(`删除规格'${productSpec.specName}'`, async () => {
      const res = await delProductSpec(productSpec.specificationsId);
      if (res.code === 200) {
        ElMessage.success(res.message);
        allProductSpecList.value = [];
        productSpecQueryFrom.currentPage = 1;
        getProductSpecListFun(); //重新请求数据进行商品规格列表渲染
      } else ElMessage.error(res.message);
    });
  };
</script>
<style lang="scss">
  .el-collapse-item__content {
    padding-bottom: 0 !important;
  }
</style>

import { getListFun, getFun } from "@/api/instance";
import { QueryType } from "@/type";
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
import { ceil } from "lodash";
import { Ref, nextTick } from "vue";
// ReturnType用于提取函数类型的返回值类型 https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%BB%8B%E7%BB%8D
export const query = ({
  loading,
  queryStr,
  data,
  queryForm,
  allPageCount,
  defaultPageSize = 20,
  tableItemHeight,
  tableHeaderHeight,
  bs,
  queryFun,
  queryListFun,
}: {
  loading: boolean;
  queryStr: string;
  data: Ref<object[]>;
  queryForm?: QueryType;
  allPageCount?: Ref<number>;
  defaultPageSize?: number;
  tableItemHeight?: Ref<number | undefined>;
  tableHeaderHeight?: Ref<number | undefined>;
  bs?: BScrollConstructor<{}>;
  queryFun?: ReturnType<typeof getFun<any[]>>;
  queryListFun?: ReturnType<typeof getListFun<any, any>>;
}) => {
  return queryFun
    ? async () => {
        loading = true;
        const res = await queryFun();
        if (res.code === 200) {
          console.log(`获取${queryStr}=>`, res);
          data.value = res.data;
        }
        loading = false;
      }
    : async (excessDataCount?: number) => {
        let closePullUp;
        loading = true;
        const res = await queryListFun!(queryForm);
        // 如果加载的数据量大于一条
        if (res.code == 200 && res.data.records.length > 0) {
          console.log(`${queryStr}(${res.data.records.length})=>`, res);

          // 每次请求都重新矫正总页数
          allPageCount!.value = ceil(res.data.total / defaultPageSize);

          // 如果是一次请求多页,则裁去多余数据量
          if (excessDataCount) res.data.records.splice(0, excessDataCount);
          data.value.push(...res.data.records);

          await nextTick();

          // 如果是页面初次加载,则获取元素高度
          if (!tableItemHeight?.value) {
            tableItemHeight!.value = Number(
              window
                .getComputedStyle(document.querySelector(".el-table__row")!)
                .height.replace("px", "")
            );
            // console.log("页面初次加载,获取单元格高度", tableItemHeight?.value);
          }
          if (!tableHeaderHeight?.value) {
            tableHeaderHeight!.value = Number(
              window
                .getComputedStyle(
                  document.querySelector(".el-table__body-header")!
                )
                .height.replace("px", "")
            );
            // console.log("页面初次加载,获取表头高度", tableHeaderHeight?.value);
          }

          // 如果已有数据量大于返回值中注明的总数据量
          if (data.value.length >= res.data.total) {
            bs?.closePullUp();
            closePullUp = true;
          }
        }
        // 否则加载数据量为0,则关闭上拉加载
        else bs?.closePullUp();
        loading = false;
        return { closePullUp };
      };
};

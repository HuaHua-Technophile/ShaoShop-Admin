// import { RouteRecordName } from "vue-router";
// 左侧用户菜单
export type authMenuListType = Array<{
  path: string;
  icon: string;
  menuName: string;
  children: authMenuListType;
}>;
//用户登录所需信息,例如token
export type loginInfoType = { authentication: string };
//每一个后台管理系统用户(账号)的信息
export type userType = {
  businessId?: Number;
  companyId?: Number; //查询和添加用户---用不到
  companyName: String; //商户名称
  email: String; //绑定邮箱
  nickName: String; //部门主体名称(账号名称)
  password: String; //密码。注册时默认填入123456
  phoneNumber: String; //绑定手机号
  // remark: String;
  // sex: String;
  status?: Number; //该后台管理账号的状态
  userId?: Number; //查询和添加用户---用不到
  userName: String; //账号
};
//字体图标
export type iconType = {
  // iconify (https://docs.iconify.design/icon-components/vue/#properties)
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  horizontalFlip?: boolean;
  verticalFlip?: boolean;
  flip?: string;
  rotate?: number | string;
  color?: string;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  align?: string;
  onLoad?: Function;
  includes?: Function;

  //  all icon
  style?: object;
};
// 历史路由
export type stateType = {
  historicalNavigation: Array<{
    name: RouteRecordName | undefined;
    path: string;
  }>;
};

// 左侧用户菜单
export type authMenuListType = {
  path: string;
  icon: string;
  menuName: string;
  children: authMenuListType[];
};
// 登录表单
export type loginFormType = {
  userName: string;
  password: string;
};
//登录返回信息,例如token
export type loginInfoType = {
  authentication: string;
  username: string;
  userId: number;
};
//每一个后台管理系统用户(账号)的信息
export type userType = {
  createTime?: string; //注册时间
  businessId?: number | null;
  // companyName: string; //商户名称用不到
  email: string; //绑定邮箱
  nickName: string; //部门主体名称
  password?: string; //密码。注册时默认填入123456
  phoneNumber: string; //绑定手机号
  status?: number | null; //该后台管理账号的状态
  userName: string; //账号
  userId?: number; //
  remark?: string; //备注
  roleName?: string[];
};
//分页查询用户列表所需参数
export type userListParamsType = userType & {
  pageSize?: number;
  currentPage?: number;
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
export type historicalRouteType = {
  name: RouteRecordName | undefined;
  path: string;
};
//角色对应的菜单
export type roleMenuType = {
  icon: string;
  isFrame: number;
  menuId?: number;
  menuName: string;
  status: number;
  menuType: string;
  orderNum: number;
  parentId: number;
  path: string;
  visible: number;
};
//树形选择器
export type treeListType = {
  value: number;
  label: string;
  children?: treeListType[];
};
// 角色类型
export type roleType = {
  roleName: string; //角色名称
  admin?: boolean; //是否是超级管理员
  businessId: string; //商户id
  companyCheckStrictly: boolean; //公司树选择项是否关联显示
  createBy?: string; //创建者
  createTime?: string; //创建时间
  dataScope: number; //权限范围 1=所有数据权限,2=自定义数据权限,3=本部门数据权限,4=本部门及以下数据权限,5=仅本人数据权限
  menuCheckStrictly: boolean; //菜单树选择项是否关联显示
  remark: string; //备注
  roleId?: number; //角色id
  roleKey?: string; //角色权限字符串
  roleSort: number; //角色排序
  status: number; //角色状态 0正常 1停用
  updateBy?: string; //最后更新者
  updateTime?: string; //最后更新时间
  params?: string; //数据��限
  menuIds?: number[]; //菜单id集合
  userList?: userType[]; //用户集合
  selectList?: (number | undefined)[]; //选中用户id集合,用于取消授权
};
// 字典类型-类型
export type dictType = {
  dictId?: number; //字典类型id
  dictType: string; //字典类型
  dictName: string; //字典名称
  status?: number | null; //状态（0正常 1停用）
  sysDictDataList?: dictDataType[];
  createBy?: string; //创建者
  createTime?: string; //创建时间
  updateBy?: string; //更新者
  updateTime?: string; //更新时间
  remark?: string; //备注
};
// 字典数据类型
export type dictDataType = {
  createBy?: string; //创建者
  createTime?: string; //创建时间
  updateBy?: string; //更新者
  updateTime?: string; //更新时间
  cssClass: string; //样式属性（其他样式扩展）
  dictCode?: number; //字典数据编码(自增,类似于排序)
  dictLabel: string; //字典数据标签
  dictSort: number; //字典数据排序
  dictType: string; //字典数据所属的父级类型
  dictValue: string; //字典数据键值
  isDefault?: boolean; //是否默认（Y是 N否）
  listClass: string; //表格回显样式
  remark: string; //备注
  status?: number; //状态（0正常 1停用）
};
// 站内信类型
export type systemMessageType = {
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  id: number; //可以理解为序号
  isRead: boolean; //是否已读
  messageContent: string; //消息本体
  messageId: number; //站内信ID
  receiverId: number; //收件用户ID
  receiverName: string; //收件用户
};
// 站内信查询类型
export type messageQueryFromType = {
  timePeriod: string[] | null; //创建时间
  read: number | null; //是否已读
  pageSize: number; //每页条数
  currentPage: number; //当前页码
};

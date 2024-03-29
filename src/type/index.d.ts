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
// 左侧用户菜单
export type authMenuListType = {
  path: string;
  icon: string;
  menuName: string;
  children: authMenuListType[];
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

// 历史路由
export type historicalRouteType = {
  name: RouteRecordName | undefined;
  path: string;
};

export type elFormItemType = {
  prop: string;
  label: string;
};
export type elInputInfoType = {
  disabledOnEdit?: boolean;
  maxlength?: number;
  placeholder: string;
  prefixIcon: string; //输入框前置图标
};
export type elInputItemInfoType = {
  hiddenOnEdit?: boolean; //是否在编辑时隐藏
  notRequired?: boolean; //是否非必填
} & elInputInfoType &
  elFormItemType;
export type elSelectInfoType = {
  placeholder: string;
  width?: string;
  option: { label: string; value: string | number }[];
};
export type elSelectItemInfoType = elSelectInfoType & elFormItemType;
export type elRadioInfoType = {
  radio: { l: string | number | boolean; v: string }[];
};
export type elRadioItemInfoType = elRadioInfoType & elFormItemType;
export type elInputNumInfoType = {
  min?: number;
  max?: number;
};
export type elInputNumItemInfoType = elInputNumInfoType & elFormItemType;

export type QueryType = {
  pageSize: number; //每页条数
  currentPage: number; //当前页码
};
export type TimeType = {
  createBy?: string; //创建者
  createTime?: string; //创建时间
  updateBy?: string; //最后更新者
  updateTime?: string; //最后更新时间
};

//每一个后台管理系统用户(账号)的信息
export type userType = {
  createTime?: string; //注册时间
  businessId?: number;
  // companyName: string; //商户名称用不到
  email: string; //绑定邮箱
  nickName: string; //部门主体名称
  password?: string; //密码。注册时默认填入123456
  phoneNumber: string; //绑定手机号
  status?: number; //该后台管理账号的状态
  userName?: string; //账号
  userId?: number; //
  remark?: string; //备注
  roleName?: string[];
};
//分页查询用户列表所需参数
export type userQueryType = userType & QueryType;

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
  companyCheckStrictly: boolean; //公司树选择项是否关联显示
  dataScope: number; //权限范围 1=所有数据权限,2=自定义数据权限,3=本部门数据权限,4=本部门及以下数据权限,5=仅本人数据权限
  menuCheckStrictly: boolean; //菜单树选择项是否关联显示
  remark: string; //备注
  roleId?: number; //角色id
  roleKey?: string; //角色权限字符串
  roleSort: number; //角色排序
  status: number; //角色状态 0正常 1停用
  params?: string; //数据��限

  menuIds?: number[]; //菜单id集合
  menuTreeList?: treeListType[]; //菜单树形结构集合
  userList?: userType[]; //用户集合
  selectList?: number[]; //选中用户id集合,用于取消授权
} & TimeType;
// 字典类型-类型
export type dictType = {
  dictId?: number; //字典类型id
  dictType: string; //字典类型
  dictName: string; //字典名称
  status?: number; //状态（0正常 1停用）
  sysDictDataList?: dictDataType[];
  remark?: string; //备注
} & TimeType;
// 字典数据类型
export type dictDataType = {
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
} & TimeType;
// 站内信类型
export type systemMessageType = {
  id: number; //可以理解为序号
  isRead: boolean; //是否已读
  messageContent: string; //消息本体
  messageId: number; //站内信ID
  receiverId: number; //收件用户ID
  receiverName: string; //收件用户
} & TimeType;
// 站内信查询类型
export type messageQueryType = {
  timePeriod?: string[]; //创建时间
  startTime?: string; //发送时间段的起始
  endTime?: string; //发送时间段的结尾
  read?: number; //是否已读
} & QueryType;
//商品规格类型
export type PSNType = {
  keyName?: string;
  specName: string;
  specificationsId?: number;
  valueName?: string;
  productSpecificationsList?: {
    keyName: string;
    valueList: string[];
    tag?: string;
    editStatus?: boolean;
  }[];
  specNameId?: string;
};
//商品规格查询类型
export type PSNQueryType = {
  productSpec: ""; //商品规格
} & QueryType;
// 商品分类类型
export type PCType = {
  id?: number; //分类ID

  classificationName: string; //分类名称
  classificationSort?: number; //排序
  parentClassificationNumber?: number; //父级编号
  remark?: string; //备注
  status?: number; //状态（0正常 1停用）
  subClassifications?: PCType[]; //子分类集合
} & TimeType;
//商品分类查询类型
export type PCQueryType = PCType & QueryType;
//商品标签
export type PLType = {
  id?: number; //id
  labelName: string; //标签名称
} & TimeType;
export type PLQueryType = PLType & QueryType;
// 满减规则
export type FRType = {
  id?: number; //满减规则ID
  name?: string; //满减规则名称
  discountAmount?: number; //优惠金额
  minAmount?: number; //最低触发金额
  businessId?: number; //商户ID
  description?: string; //描述
  startTime?: string; //开始时间
  endTime?: string; //截止时间
  status?: true; //是否正在开启
} & TimeType;
export type FRQueryType = FRType & QueryType;

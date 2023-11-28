import instance from "./instance";
export const getUserList = () => {
  return instance<{ authentication: string }>({
    url: "/system/user/list",
    method: "GET",
  });
};

interface User {
  // businessId: Number;
  // companyId: Number; 查询和添加用户用不到
  companyName: String; //商户名称
  email: String; //绑定邮箱
  nickName: String; //部门主体名称(账号名称)
  password: String; //密码。注册时默认填入123456
  phoneNumber: String; //绑定手机号
  // remark: String;
  // sex: String;
  status: Number; //该后台管理账号的状态
  // userId: Number; 查询和添加用户用不到
  userName: String; //账号
}

export const addUser = (data: User) => {
  return instance<{ authentication: string }>({
    url: "/system/user",
    method: "POST",
    data: data,
  });
};

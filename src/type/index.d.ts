export type authMenuListType = Array<{
  path: string;
  icon: string;
  menuName: string;
  children: authMenuListType;
}>;

export type loginInfo = { authentication: string };

export const phoneNumberValidator = (
  rule: any,
  value: string,
  callback: Function
) => {
  rule; //不用一下会Eslint提示报错,看着红色就烦
  if (
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
      value
    ) ||
    /^$/g.test(value)
  )
    callback();
  else callback(new Error("不符合手机号规范"));
};
export const emailValidator = (
  rule: any,
  value: string,
  callback: Function
) => {
  rule; //不用一下会Eslint提示报错,看着红色就烦
  if (
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value) ||
    /^$/g.test(value)
  )
    callback();
  else callback(new Error("不符合邮箱规范"));
};

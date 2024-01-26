// 计算当前时间和指定的字符串时间的时间差并格式化 为 天-时-分
export const getDateDiff = (startTime: string, endTime: string) => {
  /* const startMs = new Date(time1).getTime();
  const endMs = new Date(time2).getTime(); */
  const msDiff = new Date(endTime).getTime() - new Date(startTime).getTime();

  // 计算相差天数
  const days = Math.floor(msDiff / (24 * 3600 * 1000));

  // 计算相差小时数
  const hDiff = msDiff % (24 * 3600 * 1000);
  const hours = Math.floor(hDiff / (3600 * 1000));

  // 计算相差分钟
  const mDiff = hDiff % (3600 * 1000);
  const minutes = Math.floor(mDiff / (60 * 1000));

  // 去除无意义字符串
  const dStr = days == 0 ? "" : days + "天";
  const hStr = hours == 0 ? "" : hours + "时";
  const mstr = minutes == 0 ? "" : minutes + "分";

  return dStr + hStr + mstr;
};

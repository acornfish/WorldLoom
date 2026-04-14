const WLuid = function() {
  return (Date.now().toString(36) + Math.random().toString(36)).substring(0, 16).padStart(16, 0);
};
const WLdomid = function() {
  return Date.now().toString(2).replaceAll("1", "a").replaceAll("0", "b");
};
export {
  WLuid as W,
  WLdomid as a
};

/** @typedef { { userName: string, userId: string } } UserInfo */

const COOKIE_KEY = {
  USER_NAME: "USER_NAME",
  USER_ID: "USER_ID",
};

/** @type { null | UserInfo } */
let userInfo = null;

/** @returns { UserInfo | null } */
export const getUserInfo = () => {
  if (userInfo !== null) {
    return userInfo;
  }

  const userId = Cookies.get(COOKIE_KEY.USER_ID);
  const userName = Cookies.get(COOKIE_KEY.USER_NAME);

  if (userId !== undefined && userName !== undefined) {
    userInfo = { userId, userName };
    return userInfo;
  }

  return null;
};

/** @param { UserInfo } info */
export const setUserInfo = (info) => {
  userInfo = info;
  Cookies.set(COOKIE_KEY.USER_NAME, info.userName);
  Cookies.set(COOKIE_KEY.USER_ID, info.userId);
};

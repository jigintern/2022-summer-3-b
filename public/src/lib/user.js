/**
 * @typedef { { userName: string, userId: string } } UserInfo
 */

const COOKIE_KEY = {
  USER_NAME: "USER_NAME",
  USER_ID: "USER_ID",
};

/** @type { null | UserInfo } */
let userInfo = null;

/** @returns { null | UserInfo } */
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

const postUserInfo = async (userName, userId) => {
  const body = JSON.stringify({ name: userName, id: userId });
  await fetch("/api/user/resist", { method: "POST", body });
};

export const registerUserInfo = async (userName) => {
  const userId = window.crypto.randomUUID();
  userInfo = { userName, userId };

  await postUserInfo(userName, userId);

  Cookies.set(COOKIE_KEY.USER_NAME, userName, { expires: 7 });
  Cookies.set(COOKIE_KEY.USER_ID, userId, { expires: 7 });
};

export const reRegisterUserInfo = async () => {
  const { userName, userId } = userInfo;
  await postUserInfo(userName, userId);
};

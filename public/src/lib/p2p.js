// @ts-check

import { getUserInfo } from "./user.js";
import { deferred } from "/src/utils/deferred.js";

const API_KEY = "8ad75983-eae7-4d73-b97f-37cbddc59d06";
const WS_PROTOCOL = document.domain === "localhost" ? "ws" : "wss";
const WS_PORT = 8000;
const WS_ENDPOINT = `${WS_PROTOCOL}://${document.domain}:${WS_PORT}`;

// シグナリングサーバーに接続済みのPeerを返す
const getPeer = async () => {
  // @ts-ignore global variable
  const peer = new Peer({ key: API_KEY, debug: 2 });

  if (!peer.open) {
    await new Promise((resolve) => peer.once("open", resolve));
  }

  return peer;
};

/**
 * ローカルのビデオのストリームを返す
 * @returns {Promise<MediaStream>}
 */
const getLocalStream = () => {
  return navigator
    .mediaDevices
    .getUserMedia({ audio: true, video: true });
};

export const connect = async () => {
  const peer = await getPeer();

  const localStream = await getLocalStream();

  const { promise: connection, resolve: resolveConnection } = deferred();
  const { promise: relatedUserId, resolve: resolveRelatedUserId } = deferred();

  // コネクションを受け入れる
  peer.on("call", /** @param connection {any} */ (connection) => {
    connection.answer(localStream);
    resolveConnection(connection);
  });

  const ws = new WebSocket(WS_ENDPOINT);
  ws.addEventListener("close", () => peer.destroy());
  ws.onerror = (e) => console.error(e);
  ws.onmessage = (e) => {
    const { userId, remoteId, call } = JSON.parse(e.data);
    resolveRelatedUserId(userId);

    if (call) {
      // 相手にコネクションを要求する
      const connection = peer.call(remoteId, localStream);
      resolveConnection(connection);
    }
  };

  ws.onopen = () => {
    const userId = getUserInfo()?.userId;
    ws.send(JSON.stringify({ userId: userId, peerId: peer.id }));
  };

  return {
    connection: await connection,
    relatedUserId: await relatedUserId,
    localStream,
    ws,
  };
};

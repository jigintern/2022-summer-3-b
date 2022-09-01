// @ts-check

import { deferred } from "/src/utils/deferred.js";
import { API_KEY } from "./skyway.js";

const START_MATCHING_ENDPOINT = "/api/matching/start";

/** @param localId {any} */
const getRemoteId = async (localId) => {
  const res = await fetch(START_MATCHING_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ peerId: localId }),
  });
  const json = await res.json();
  return json.peerId;
};

const getLocalStream = () => {
  return navigator
    .mediaDevices
    .getUserMedia({ audio: true, video: true });
};

/**
 * マッチングを開始し，通信相手の`MediaConnection`を返す．
 * `MediaConnection`: https://webrtc.ecl.ntt.com/api-reference/javascript.html#mediaconnection
 * @returns {Promise<any>}
 */
export const startMatching = async () => {
  // @ts-ignore global variable
  const peer = new Peer({ key: API_KEY, debug: 2 });
  const localStream = await getLocalStream();

  const { promise, resolve } = deferred();

  // 受信側の設定
  peer.on("call", /** @param connection {any} */ (connection) => {
    connection.answer(localStream);
    resolve(connection);
  });

  if (!peer.open) {
    await new Promise((resolve) => peer.once("open", resolve));
  }

  // 送信側の設定
  const remoteId = await getRemoteId(peer.id);
  if (remoteId !== null) {
    const connection = peer.call(remoteId, localStream);
    resolve(connection);
  }

  return promise.then(/** @param connection {any} */ (connection) => {
    connection.once("close", () => peer.destroy());
    return connection;
  });
};

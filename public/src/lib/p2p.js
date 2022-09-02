import { getUserInfo } from "./user.js";
import { deferred } from "/src/utils/deferred.js";

const API_KEY = "8ad75983-eae7-4d73-b97f-37cbddc59d06";

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
  const { promise: user, resolve: resolveUser } = deferred();

  // コネクションを受け入れる
  peer.on("call", /** @param connection {any} */ (connection) => {
    connection.answer(localStream);
    resolveConnection(connection);
  });
  peer.on("connection", /** @param connection {any} */ (connection) => {
    connection.on("data", ({ userId, remoteId }) => {
      resolveUser({ userId, remoteId });
      connection.close(true);
    });
  });

  const res = await fetch("/api/matching/start", {
    method: "POST",
    body: JSON.stringify({ userId: getUserInfo().userId, peerId: peer.id }),
  });
  const { userId, peerId: remoteId } = await res.json();

  if (userId && remoteId) {
    resolveUser({ userId, remoteId });
    const connection = peer.call(remoteId, localStream);
    resolveConnection(connection);

    const dataConnection = peer.connect(remoteId);
    dataConnection.on("open", () => {
      dataConnection.send({
        userId: getUserInfo().userId,
        remoteId: peer.id,
      });
    });
  }

  const remoteStream = new Promise((resolve) => {
    connection.then((connection) => {
      connection.on("stream", (stream) => resolve(stream));
    });
  });

  const user_ = await user;

  return {
    userId: user_.userId,
    remoteId: user_.remoteId,
    remoteStream: await remoteStream,
    peer,
    localStream,
  };
};

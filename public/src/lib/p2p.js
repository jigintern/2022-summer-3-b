// @ts-check

import { deferred } from "/src/utils/deferred.js";

const API_KEY = "8ad75983-eae7-4d73-b97f-37cbddc59d06";
const WS_PROTOCOL = document.domain === "localhost" ? "ws" : "wss";
const WS_PORT = 5000;
const WS_ENDPOINT = `${WS_PROTOCOL}://${document.domain}:${WS_PORT}`;

// class WebSocketStream {
//   /** @type { WebSocket } */
//   #ws;
//
//   /** @type { any[] } */
//   #dataQueue = [];
//
//   /** @type { ((v: any) => void)[] } */
//   #resolverQueue = [];
//
//   /** @param { WebSocket } ws */
//   constructor(ws) {
//     this.#ws = ws;
//     ws.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       const resolver = this.#resolverQueue.shift();
//       if (resolver) {
//         resolver(data);
//       } else {
//         this.#dataQueue.push(data);
//       }
//     };
//   }
//
//   /** @type { InstanceType<typeof WebSocket>['send'] } */
//   send(data) {
//     this.#ws.send(data);
//   }
//
//   /** @returns { Promise<any> } */
//   recv() {
//     return new Promise((resolve, reject) => {
//       this.#ws.onerror = reject;
//       const data = this.#dataQueue.shift();
//       if (data !== undefined) {
//         resolve(data);
//       } else {
//         this.#resolverQueue.push(resolve);
//       }
//     });
//   }
// }
//
// class RoomClient {
//   /** @type { any } */
//   #connection;
//
//   /** @type { WebSocketStream } */
//   #wsStream;
//
//   /** @type { any } */
//   #relatedUserId;
//
//   /**
//    * @param {any} connection
//    * @param {WebSocketStream} wsStream
//    * @param {any} relatedUserId
//    */
//   constructor(connection, wsStream, relatedUserId) {
//     this.#connection = connection;
//     this.#wsStream = wsStream;
//     this.#relatedUserId = relatedUserId;
//   }
//
//   get relatedUserId() {
//     return this.#relatedUserId;
//   }
//
//   get connection() {
//     return this.#connection;
//   }
//
//   quit() {
//     this.#wsStream.send(JSON.stringify({ completeTask: true }));
//   }
//
//   waitTermination() {
//     return this.#wsStream.recv();
//   }
// }

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
 *   @returns {Promise<MediaStream>}
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
    ws.send(JSON.stringify({ peerId: peer.id }));
  };

  return {
    connection: await connection,
    relatedUserId: await relatedUserId,
    ws,
  };
};

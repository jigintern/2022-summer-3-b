import { serve } from "https://deno.land/std@0.151.0/http/server.ts";

class UserId {
  static readonly SYMBOL: unique symbol = Symbol();
  #id: string;
  #marker: typeof UserId["SYMBOL"] = UserId.SYMBOL;

  constructor(id: string) {
    this.#id = id;
  }
  eq(other: UserId): boolean {
    return this.#id == other.#id;
  }
  get inner() {
    return this.#id;
  }
}

class PeerId {
  static readonly SYMBOL: unique symbol = Symbol();
  #id: string;
  #marker: typeof PeerId["SYMBOL"] = PeerId.SYMBOL;

  constructor(id: string) {
    this.#id = id;
  }
  eq(other: PeerId): boolean {
    return this.#id == other.#id;
  }
  get inner() {
    return this.#id;
  }
}

class RoomId {
  static readonly SYMBOL: unique symbol = Symbol();
  #id: string = globalThis.crypto.randomUUID();
  #marker: typeof RoomId["SYMBOL"] = RoomId.SYMBOL;
  eq(other: RoomId): boolean {
    return this.#id == other.#id;
  }
}

interface User {
  userId: UserId;
  peerId: PeerId;
  ws: WebSocket;
}

class Room {
  #users: (User | null)[] = [];
  #timer: number | null = null;
  #launched = false;

  isEveryUserQuitted() {
    return this.#launched && this.#users.every((user) => user === null);
  }

  isFull() {
    return this.#users.length === 2;
  }

  launch() {
    this.#launched = true;
    const [user1, user2] = this.#users;
    user1!.ws.send(JSON.stringify({
      userId: user2!.userId.inner,
      remoteId: user2!.peerId.inner,
      call: true,
    }));
    user2!.ws.send(JSON.stringify({
      userId: user1!.userId.inner,
      remoteId: user1!.peerId.inner,
      call: false,
    }));
  }

  join(user: User) {
    this.#users.push(user);
  }

  close(userId: UserId) {
    const index = this.#users.findIndex((user) => user?.userId.eq(userId));
    this.#users[index]!.ws.close();
  }

  quit(userId: UserId) {
    const index = this.#users.findIndex((user) => user?.userId.eq(userId));
    if (this.#launched) {
      this.#users[index] = null;
    } else {
      this.#users.splice(index, 1);
    }
  }

  closeAll() {
    this.#users.forEach((user) => user?.ws.close());
    clearTimeout(this.#timer!);
  }

  set timer(timer: number) {
    this.#timer = timer;
  }
}

class Rooms {
  #rooms: Map<RoomId, Room> = new Map();
  #vacancy: RoomId = new RoomId();

  #getRoom(id: RoomId): Room {
    const room = this.#rooms.get(this.#vacancy);
    if (room) {
      return room;
    }

    const newRoom = new Room();
    this.#rooms.set(id, newRoom);
    return newRoom;
  }

  #launchRoom(roomId: RoomId) {
    const room = this.#getRoom(roomId);
    room.timer = setTimeout(() => {
      room.closeAll();
    }, 30000);
    room.launch();
  }

  join(user: User): RoomId {
    const roomId = this.#vacancy;
    const room = this.#getRoom(roomId);
    room.join(user);

    if (room.isFull()) {
      this.#launchRoom(roomId);
      this.#vacancy = new RoomId();
    }

    return roomId;
  }

  close(roomId: RoomId, userId: UserId) {
    const room = this.#rooms.get(roomId)!;
    room.close(userId);
  }

  quit(roomId: RoomId, userId: UserId) {
    const room = this.#rooms.get(roomId)!;
    room.quit(userId);

    if (room.isEveryUserQuitted()) {
      room.closeAll();
      this.#rooms.delete(roomId);
    }
  }
}

const rooms = new Rooms();

export const serveWebSocket = (req: Request): Response | null => {
  if (req.headers.get("upgrade") != "websocket") { // WebSocketの要求でない
    return null;
  }

  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  ws.onerror = console.error;
  ws.onmessage = (e) => {
    const id = JSON.parse(e.data);
    const userId = new UserId(id.userId);
    const peerId = new PeerId(id.peerId);
    const user = { userId, peerId, ws };

    const roomId = rooms.join(user);
    ws.onclose = () => rooms.quit(roomId, userId);
  };

  return response;
};

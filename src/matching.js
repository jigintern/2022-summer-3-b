// マッチングを制御するクラス
export class Matching {
  waitingId = null;

  match(peerId) {
    const result = this.waitingId;
    this.waitingId = this.waitingId === null ? peerId : null;
    return result;
  }
}

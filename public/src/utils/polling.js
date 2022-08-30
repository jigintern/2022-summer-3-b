// @ts-check

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @template T
 * @typedef {{ status: "pending" } | { status: "ready", value: T }} Poll
 */

/**
 * @template T
 * @returns {Poll<T>}
 */
export const pending = () => ({ status: "pending" });

/**
 * @template T
 * @param {T} value
 * @returns {Poll<T>}
 */
export const ready = (value) => ({ status: "ready", value });

/**
 * @template T
 * @param {number} waitMs
 * @param {() => Promise<Poll<T>>} f
 */
export const poll = async (waitMs, f) => {
  while (1) {
    const poll = await f();

    if (poll.status == "pending") {
      await sleep(waitMs);
      continue;
    }

    if (poll.status == "ready") {
      return poll.value;
    }
  }
};

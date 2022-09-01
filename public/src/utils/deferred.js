/**
 * @template {T}
 * @returns {{ promise: Promise<T>, resolve: (v: T) => void, reject: (e: any) => void }}
 */
export const deferred = () => {
  let methods;
  const promise = new Promise((resolve, reject) => {
    methods = { resolve, reject };
  });

  return { promise, ...methods };
};

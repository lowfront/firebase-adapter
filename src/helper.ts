export function asyncMap<T>(promiseFns: (() => Promise<T>)[], max: number) {
  const result: T[] = [];

  let count = 0;
  let cursor = 0;

  return new Promise(res => {
    function run() {
      while (count < max && cursor < promiseFns.length) {
        count++;
        const index = cursor++;
        promiseFns[index]()
          .then((value) => {
            result[index] = value;
          }, rej => console.log(rej))
          .catch(err => console.error(err))
          .finally(() => {
            run();
            count--;
  
            if (!count) res(result);
          });
      }
    }
  
    run();
  });
}

export function sleep(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}
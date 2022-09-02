export declare function asyncMap<T>(promiseFns: (() => Promise<T>)[], max: number): Promise<unknown>;
export declare function sleep(ms: number): Promise<void>;

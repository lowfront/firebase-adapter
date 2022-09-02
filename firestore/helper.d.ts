import { DocumentData, Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
export declare function findOne(q: Query<DocumentData>): Promise<QueryDocumentSnapshot<DocumentData> | null>;
export declare function findMany(q: Query<DocumentData>): Promise<QueryDocumentSnapshot<DocumentData>[]>;
export declare function from<T = Record<string, unknown>>(object: Record<string, any>): T;
export declare function asyncMap<T>(promiseFns: (() => Promise<T>)[], max: number): Promise<unknown>;

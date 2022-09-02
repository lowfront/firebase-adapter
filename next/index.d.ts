import { Firestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { Database } from 'firebase-admin/database';
export declare function getCustomToken(db: Firestore | Database, sessionToken: string, adapterCollectionName?: string): Promise<string | undefined>;
export declare function updateCustomToken(db: Firestore | Database, sessionToken: string, token: string, adapterCollectionName?: string): Promise<string>;
export declare function getSessionToken(req: NextApiRequest): string;
export declare function createFirebaseCustomTokenHandler({ db, adapterCollectionName, method, additionalClaims, }: {
    db: Firestore | Database;
    adapterCollectionName?: string;
    method?: string;
    additionalClaims?: (session: Session) => any;
}): (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export declare function createRemoveExpiredSessions({ db, adapterCollectionName, }: {
    db: Firestore;
    adapterCollectionName?: string;
}): (adapter: Adapter, limit?: number, asyncMax?: number) => Promise<void>;

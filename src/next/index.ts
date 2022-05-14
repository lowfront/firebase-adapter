import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { findMany } from "../firestore/helper";
import { asyncMap } from '../helper';
import { Adapter } from "next-auth/adapters";
import { Database } from 'firebase-admin/database';
import { CustomToken } from '../types';

export async function getCustomToken(db: Firestore|Database, sessionToken: string, adapterCollectionName: string = '_next_auth_firebase_adapter_') {
  let token, expires;
  if (db instanceof Firestore) {
    const tokenDocRef = db.collection(adapterCollectionName).doc('store').collection('customToken').doc(sessionToken);
    const tokenDoc = await tokenDocRef.get();
    if (!tokenDoc.exists) return;
    ({ token, expires } = tokenDoc.data() as CustomToken);
  } else {
    const tokenSnap = await db.ref(`${adapterCollectionName}/customToken/${sessionToken}`).get();
    if (!tokenSnap.exists()) return;
    ({ token, expires } = tokenSnap.val() as CustomToken);
  }
  if (Date.now() > new Date(expires).getTime()) return;
  return token;
}

export async function updateCustomToken(db: Firestore|Database, sessionToken: string, token: string, adapterCollectionName: string = '_next_auth_firebase_adapter_') {
  const tokenData = {
    token,
    expires: Date.now() + 60 * 60 * 1000,
  };
  if (db instanceof Firestore) {
    const tokenDocRef = db.collection(adapterCollectionName).doc('store').collection('customToken').doc(sessionToken);
    await tokenDocRef.set(tokenData);
  } else {
    await db.ref(`${adapterCollectionName}/customToken/${sessionToken}`).update(tokenData);
  }

  return token;
}

export function getSessionToken(req: NextApiRequest) {
  return req.cookies['__Secure-next-auth.session-token'] ?? req.cookies['next-auth.session-token'];
}

export function createFirebaseCustomTokenHandler({
  db,
  adapterCollectionName = '_next_auth_firebase_adapter_',
  method = 'GET',
  additionalClaims,
}: {
  db: Firestore|Database;
  adapterCollectionName?: string;
  method?: string;
  additionalClaims?: (session: Session) => any;
}) {
  return async function firebaseCustomTokenHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) return res.status(403).json(false);
    const session = await getSession({ req }) as Session;
    if (!session) return res.status(403).json(false);
    const sessionToken = getSessionToken(req);
    const { user } = session as unknown as {
      user: NonNullable<Session['user']>;
    };
    const email = user.email as string;
    let token = await getCustomToken(db, sessionToken, adapterCollectionName);
    if (token) return res.json(token);
  
    token = await admin
      .auth()
      .createCustomToken(email, Object.assign({}, additionalClaims?.(session), { sessionToken }));
    await updateCustomToken(db, sessionToken, token, adapterCollectionName);
  
    return res.json(token);
  };
}

export function createRemoveExpiredSessions({
  db,
  adapterCollectionName = '_next_auth_firebase_adapter_',
}: {
  db: Firestore;
  adapterCollectionName?: string;
}) {
  return async function removeExpiredSessions(adapter: Adapter, limit: number = 100, asyncMax: number = 30) { // Expired session deletion function, used for cron or api
    const q = db.collection(adapterCollectionName).doc('store').collection('session').where('expires', '<', new Date()).limit(limit);
    const expiredSessionDocs = await findMany(q);
    await asyncMap(expiredSessionDocs.map(doc => () => adapter.deleteSession(doc.data().sessionToken) as Promise<void>), asyncMax);
  }
}

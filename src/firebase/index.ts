import { Database } from "firebase-admin/database";
import { Adapter, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import { from, to } from "./helper";
import { Account } from "next-auth";
import { FirebaseAdapterProps } from "../types";

export default function FirebaseAdapter(
  db: Database,
  options: FirebaseAdapterProps = {},
): Adapter {  
  const adapterCollectionName = options.adapterCollectionName ?? '_next_auth_firebase_adapter_';

  const userCollectionRef = db.ref(`${adapterCollectionName}/user`);
  const accountCollectionRef = db.ref(`${adapterCollectionName}/account`);
  const sessionCollectionRef = db.ref(`${adapterCollectionName}/session`);
  const verificationTokenCollectionRef = db.ref(`${adapterCollectionName}/verificationToken`);
  const customTokenCollectionRef = db.ref(`${adapterCollectionName}/customToken`);

  const findUserDoc = (key: string) => db.ref(`${adapterCollectionName}/user/${key}`);
  const findAccountDoc = (key: string) => db.ref(`${adapterCollectionName}/account/${key}`);
  const findSessionDoc = (key: string) => db.ref(`${adapterCollectionName}/session/${key}`);
  const findVerificationTokenDoc = (key: string) => db.ref(`${adapterCollectionName}/verificationToken/${key}`);
  const findCustomTokenDoc = (sessionToken: string) => db.ref(`${adapterCollectionName}/customToken/${sessionToken}`);

  return {
    async createUser(data) {
      const userData = {
        name: data.name ?? null,
        email: data.email ?? null,
        image: data.image ?? null,
        emailVerified: data.emailVerified ?? null,
      };
      
      const userRef = await userCollectionRef.push(userData);
      const user = {
        id: userRef.key,
        ...userData,
      } as AdapterUser;

      return user;
    },
    async getUser(id) {
      const userSnap = await findUserDoc(id).get();
      if (!userSnap.exists()) return null;

      const user = userSnap.val() as AdapterUser;
      return user;
    },
    async getUserByEmail(email) {      
      const q = userCollectionRef.limitToFirst(1).orderByChild('email').equalTo(email);
      const userSnap = await q.once('value');

      if (!userSnap.exists()) return null;
      const [userKey, userData] = Object.entries(userSnap.val())[0] as [string, Omit<AdapterUser, 'id'>];
      const user = {
        id: userKey,
        ...userData,
      } as AdapterUser;
      return user;
    },
    async getUserByAccount({provider, providerAccountId}) {
      const q = accountCollectionRef.orderByChild('providerAccountId').equalTo(providerAccountId);
      const accountSnaps = await q.once('value');
      if (!accountSnaps.exists()) return null;
      const [accountKey, accountData] = Object.entries<Account>(accountSnaps.val()).find(([key, data]) => {
        return data.provider === provider;
      }) as [string, Account];

      const account = {
        id: accountKey,
        ...accountData,
      } as unknown as Account;
      
      const userSnap = await findUserDoc(account.userId as string).get();
      if (!userSnap.exists()) return null;
      const userData = userSnap.val();

      const user = {
        id: userSnap.key,
        ...userData,
      } as AdapterUser;
      return user;
    },
    async updateUser(data) {
      const { id, ...userData } = data;
      await findUserDoc(id as string).set(userData);
      const user = data as AdapterUser;
      return user;
    },
    async deleteUser(id) {
      await findUserDoc(id).remove();
    },
    async linkAccount(data) {
      const accountData = data;
      const accountRef = await accountCollectionRef.push(accountData);

      const account = {
        id: accountRef.key,
        ...accountData,
      } as Account;

      return account;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const q = accountCollectionRef.orderByChild('providerAccountId').equalTo(providerAccountId);
      const accountSnaps = await q.once('value');
      if (!accountSnaps.exists()) return;
      const [accountKey, accountData] = Object.entries<Account>(accountSnaps.val()).find(([key, data]) => {
        return data.provider === provider;
      }) as [string, Account];

      await findAccountDoc(accountKey).remove();
    },
    async getSessionAndUser(sessionToken) {
      const q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
      const sessionSnap = await q.once('value');
      if (!sessionSnap.exists()) return null;
      const [sessionKey, sessionData] = Object.entries(sessionSnap.val())[0] as [string, Omit<AdapterUser, 'id'>];

      const userSnap = await findUserDoc(sessionData.userId as string).get();
      if (!userSnap.exists()) return null;
      const userData = userSnap.val();
      
      const user = {
        id: userSnap.key,
        ...userData,
      } as AdapterUser;
      const session = {
        id: sessionKey,
        ...sessionData,
      } as AdapterSession;

      console.log('getSessionAndUser', session);

      return {
        user,
        session: from(session),
      };
    },
    async createSession(data) {
      const sessionData = {
        sessionToken: data.sessionToken ?? null,
        userId: data.userId ?? null,
        expires: data.expires ?? null,
      };
      const sessionRef = await sessionCollectionRef.push(to(sessionData));
      const session = {
        id: sessionRef.key,
        ...sessionData as any,
      } as unknown as AdapterSession;
      console.log('createSession', session);
      return session;
    },
    async updateSession(data) {
      const { sessionToken, ...sessionData } = data;
      const q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
      const sessionSnap = await q.once('value');
      if (!sessionSnap.exists()) return null;
      const [sessionKey] = Object.entries(sessionSnap.val())[0] as [string, Omit<AdapterUser, 'id'>];
      console.log('updateSession', to(sessionData));
      await findSessionDoc(sessionKey).set(to(sessionData));
      return data as AdapterSession;
    },
    async deleteSession(sessionToken) {
      const q = sessionCollectionRef.limitToFirst(1).orderByChild('sessionToken').equalTo(sessionToken);
      const sessionSnap = await q.once('value');
      if (!sessionSnap.exists()) return null;
      const [sessionKey] = Object.entries(sessionSnap.val())[0] as [string, Omit<AdapterUser, 'id'>];
      
      await Promise.allSettled([
        findSessionDoc(sessionKey).remove(),
        findCustomTokenDoc(sessionToken).remove(),
      ]);
    },
    async createVerificationToken(data) { // need test
      const verificationTokenRef = await verificationTokenCollectionRef.push(data);
      const verificationToken = {
        id: verificationTokenRef.key,
        ...to(data),
      } as VerificationToken;
      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) { // need test
      const q = verificationTokenCollectionRef.orderByChild('token').equalTo(token);
      const verificationTokenSnap = await q.once('value');
      if (!verificationTokenSnap.exists()) return null;
      const [verificationTokenKey, verificationTokenData] = Object.entries<VerificationToken>(verificationTokenSnap.val()).find(([key, data]) => {
        return data.identifier === identifier;
      }) as [string, VerificationToken];

      await findVerificationTokenDoc(verificationTokenKey).remove();
      return from(verificationTokenData) as VerificationToken;
    },
  }
}
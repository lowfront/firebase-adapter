import { getApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {
  getFirestore,
  doc,
  addDoc as _addDoc,
  getDoc as _getDoc,
  getDocs as _getDocs,
  setDoc as _setDoc,
  updateDoc as _updateDoc,
  deleteDoc as _deleteDoc,
  collection,
  Query,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore
} from "firebase/firestore";
import { sleep } from "../helper";

export async function signInFirebase(appName?: string) {
  const token = await fetch('/api/auth/firebase-custom-token').then(res => res.text());
  await signInWithCustomToken(getAuth(getApp(appName)), token);
}

export async function trySignInWithCustomToken<T>(f?: (() => Promise<T>)|Promise<T>, appName?: string) { // If try continuously, it appears to fail...
  let failCount = 3;
  
  while (failCount--) {
    try {
      return await (typeof f === 'function' ? f() : f);
    } catch (err: any) {
      console.error(err);
      await signInFirebase(appName);
      await sleep(100);
    }
  }
  
  throw new Error('Fail sign in with custom token.');
}

export const addDoc = ((reference, data) => {
  return trySignInWithCustomToken(() => _addDoc(reference, data));
}) as typeof _addDoc;

export const getDoc = (reference => {
  return trySignInWithCustomToken(() => _getDoc(reference));
}) as typeof _getDoc;

export const getDocs = (reference => {
  return trySignInWithCustomToken(() => _getDocs(reference));
}) as typeof _getDocs;

export const setDoc = ((reference, data, options) => {
  return trySignInWithCustomToken(() => _setDoc(reference, data, options));
}) as typeof _setDoc;

export const updateDoc = ((reference, field, value, ...moreFieldsAndValues) => {
  return trySignInWithCustomToken(() => _updateDoc(reference, field, value, ...moreFieldsAndValues));
}) as typeof _updateDoc;

export const deleteDoc = (reference => {
  return trySignInWithCustomToken(() => _deleteDoc(reference));
}) as typeof _deleteDoc;

export function validCustomToken(db: Firestore, id: string) {
  const docRef = doc(db, 'store', id);
  return _getDoc(docRef);
}

export function getUserDoc(db: Firestore, email: string, ...paths: string[]) {
  return doc(db, 'store', email, ...paths);
}

export function getUserCollection(db: Firestore, email: string, ...paths: string[]) {
  return collection(db, 'store', email, ...paths);
}

export async function findOne(q: Query<DocumentData>): Promise<QueryDocumentSnapshot<DocumentData>|null> {
  const querySnap = await getDocs(q);
  return querySnap.docs[0] ?? null;
}

export async function findMany(q: Query<DocumentData>): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const querySnap = await getDocs(q);
  const result: QueryDocumentSnapshot<DocumentData>[] = [];
  querySnap.forEach(doc => result.push(doc));
  return result;
}

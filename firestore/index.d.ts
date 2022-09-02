import { Firestore } from "firebase-admin/firestore";
import { Adapter } from "next-auth/adapters";
import { FirebaseAdapterProps } from "../types";
export default function FirestoreAdapter(db: Firestore, options?: FirebaseAdapterProps): Adapter;

import { Database } from "firebase-admin/database";
import { Adapter } from "next-auth/adapters";
import { FirebaseAdapterProps } from "../types";
export default function FirebaseAdapter(db: Database, options?: FirebaseAdapterProps): Adapter;

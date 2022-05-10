import { createFirebaseCustomTokenHandler } from "@lowfront/firebase-adapter";
import { db } from "../../../lib/firebase-server";

export default createFirebaseCustomTokenHandler({
  db,
  additionalClaims: (session) => ({}),
});
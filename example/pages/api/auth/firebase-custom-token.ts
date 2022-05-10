import { createFirebaseCustomTokenHandler } from "../../../..";
import { db } from "../../../lib/firebase-server";

export default createFirebaseCustomTokenHandler({
  db,
  additionalClaims: (session) => ({}),
});
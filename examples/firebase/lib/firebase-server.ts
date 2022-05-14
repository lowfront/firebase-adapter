import admin, { ServiceAccount } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from 'firebase-admin/firestore';

// How to get admin config: https://firebase.google.com/docs/admin/setup#initialize-sdk
if (!admin.apps.length) { // https://github.com/vercel/next.js/issues/1999#issuecomment-302244429
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_CONFIG_type,
      project_id: process.env.FIREBASE_ADMIN_CONFIG_project_id,
      private_key_id: process.env.FIREBASE_ADMIN_CONFIG_private_key_id,
      private_key: process.env.FIREBASE_ADMIN_CONFIG_private_key?.replace(/\\n/gm, '\n'), // https://github.com/gladly-team/next-firebase-auth/discussions/95#discussioncomment-473663
      client_email: process.env.FIREBASE_ADMIN_CONFIG_client_email,
      client_id: process.env.FIREBASE_ADMIN_CONFIG_client_id,
      auth_uri: process.env.FIREBASE_ADMIN_CONFIG_auth_uri,
      token_uri: process.env.FIREBASE_ADMIN_CONFIG_token_uri,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_CONFIG_auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CONFIG_client_x509_cert_url,
    } as ServiceAccount)
  });
}

export const app = admin.apps[0];

export const auth = getAuth();

export const db = getFirestore();

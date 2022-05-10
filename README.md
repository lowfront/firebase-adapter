# Firebase adapter

## Introduction

Adapter plug-in for NextAuth.js to use custom token method authentication. It is currently intended for Firestore Database, and will add a Realtime Database adapter later. Firebase can handle the database in the client, but there is not enough providers for authentication provided by Firebase. This package allows you to create rules in Firebase using credentials from various OAuth providers in NextAuth, and allows you to use Firebase in the client while the database is protected. Examples of use can be found [here](https://github.com/lowfront/firebase-adapter/tree/master/example).

## How to start

### Installation
```npm i @lowfront/firebase-adapter```

### Register NextAuth.js
The server uses the Firebase admin SDK. Initialize the app and db as follows:
```ts
// pages/api/auth/[...nextauth].ts
import { FirestoreAdapter } from "@lowfront/firebase-adapter";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const app = admin.initializeApp({
  // https://firebase.google.com/docs/admin/setup#initialize-sdk
  // It is recommended to make it an environment variable to distribute to vercel: https://github.com/lowfront/firebase-adapter/blob/master/example/lib/firebase-server.ts#L9-L18
  credential: admin.credential.cert({...} as ServiceAccount),
});

const db = getFirestore(app);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter(db),
})
```

### Register custom token API entry point
Endpoint for requesting the client to issue a cutomToken. You must use `/api/auth/firebase-cutom-token` as the endpoint.
```ts
// pages/api/auth/firebase-custom-token.ts
import { createFirebaseCustomTokenHandler } from "@lowfront/firebase-adapter";

export default createFirebaseCustomTokenHandler({
  db, // Firestore Database Initialized with Firebase admin SDK
  additionalClaims: (session) => ({}), // Additional data required by the database rule can be inserted : https://firebase.google.com/docs/auth/admin/create-custom-tokens#sign_in_using_custom_tokens_on_clients
});
```

### Set Firestore Database Rule
Set a rule in the client that allows users to access only their own data. If you do not set a rule, all data in the database can be accessed by the client, so it must be set.
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /store/{userId}/{document=**} {
    	allow read, write: if request.auth.uid == userId 
      // This line adds a read cost, but disables customToken issued after sign out.
      && exists(/databases/$(database)/documents/_next_auth_firebase_adapter_/store/customToken/$(request.auth.token.sessionToken));
    }
  }
}
```

### Example of using the client
Unlike servers, the client uses the Firebase SDK to access the database. So, initialize the app with Firebase config and pass the db object to the function provided by the package for use it. The CRUD function (setDoc, addDoc, getDoc, updateDoc, removeDoc...) in Firebase v9 must use the functions wrapped in the package.
```tsx
import { getUserDoc, getDoc } from '@lowfront/firebase-adapter';

// It is recommended to make it an environment variable to distribute to vercel: https://github.com/lowfront/firebase-adapter/blob/master/example/lib/firebase-web.ts#L12-L18
const firebaseConfig = { ... } as FirebaseOptions; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testDoc = getUserDoc(db, session?.user?.email, 'store', 'test');

const App: FC<{}> = () => {
  const { data: session } = useSession();

  const loadData = async () => {
    await getDoc(testDoc);
    alert('success load data');
  };

  return <div>
    <button onClick={loadData}>Load data</button>
  </div>
};
```
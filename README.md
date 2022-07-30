# Firebase adapter

Firebase can handle the database in the client, but there is not enough providers for authentication provided by Firebase. This package allows you to create rules in Firebase using credentials from various OAuth providers in NextAuth.js, and allows you to use Firebase in the client while the database is protected. 

## Introduction

This package is Adapter plug-in for NextAuth.js to use custom token method authentication. Supports both Cloud Firestore and Realtime Database. If you want to get started quickly, see the example below.

- [Firestore](https://github.com/lowfront/firebase-adapter/tree/master/examples/firestore)
- [Realtime Database](https://github.com/lowfront/firebase-adapter/tree/master/examples/firebase)

## How to start
### Installation
This package is compatible with NextAuth.js v4, Firebase-admin v10, and Firebase SDK v9. The [NextAuth.js](https://www.npmjs.com/package/next-auth) and [Firebase Admin SDK](https://www.npmjs.com/package/firebase-admin) must be installed. The [Firebase SDK](https://www.npmjs.com/package/firebase) must be installed to use the database on the client.

```
npm i @lowfront/firebase-adapter
```

### Register NextAuth.js
The server uses the Firebase admin SDK. Initialize the app and db as follows:

#### For Cloud Firestore
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
  providers: [GoogleProvider({ ... })],
  adapter: FirestoreAdapter(db),
});
```

#### For Realtime Database
```ts
// pages/api/auth/[...nextauth].ts
import { FirebaseAdapter } from "@lowfront/firebase-adapter";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const app = admin.initializeApp({
  // https://firebase.google.com/docs/admin/setup#initialize-sdk
  // It is recommended to make it an environment variable to distribute to vercel: https://github.com/lowfront/firebase-adapter/blob/master/example/lib/firebase-server.ts#L9-L18
  credential: admin.credential.cert({...} as ServiceAccount),

  // If you want to use the Realtime Database, add the databaseURL : https://firebase.google.com/docs/admin/setup#initialize-sdk
  databaseURL: '...',
});

const db = getDatabase(app);
export default NextAuth({
  providers: [GoogleProvider({ ... })],
  adapter: FirebaseAdapter(db),
});
```

### Register custom token API entry point
Endpoint for requesting the client to issue a cutomToken. You must use `/api/auth/firebase-cutom-token` as the endpoint.

```ts
// pages/api/auth/firebase-custom-token.ts
import { createFirebaseCustomTokenHandler } from "@lowfront/firebase-adapter";

export default createFirebaseCustomTokenHandler({
  db, // Cloud Firestore or Realtime Database Initialized with Firebase admin SDK
  // additionalClaims: (session) => ({}), // Additional data required by the database rule can be inserted : https://firebase.google.com/docs/auth/admin/create-custom-tokens#sign_in_using_custom_tokens_on_clients
});
```

### Set Firebase Database Rule
Set a rule in the client that allows users to access only their own data. If you do not set a rule, all data in the database can be accessed by the client, so Firebase database rule must be set up to protect user-specific data. In the example, we used path `/store/{userId}/{document=**}` as the user data storage path, but you can change it if you want. Check the official [document](https://firebase.google.com/docs/rules) for more information on the rules.
#### For Cloud Firestore
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

#### For Realtime Database
```
{
  "rules": {
    ".read": false,
    ".write": false,
    // Adds an index to the next-auth data for efficient search.
    "_next_auth_firebase_adapter_": {
      "account": {
        ".indexOn": ["providerAccountId"]
      },
      "session": {
        ".indexOn": ["sessionToken"]
      },
      "user": {
        ".indexOn": ["email"]
      },
      "verificationToken": {
        ".indexOn": ["token"]
      }
    },
    // Realtime Database cannot use the email address as a key, so it uses the value encoded in base64 for the email address stored in claims instead of the email address.The operation method is the same as the Firestore rule.
    "users": {
      "$uid": {
        ".write": "auth != null && $uid === auth.token.uid && root.child('_next_auth_firebase_adapter_').child('customToken').child(auth.token.sessionToken).exists()",
        ".read": "auth != null && $uid === auth.token.uid && root.child('_next_auth_firebase_adapter_').child('customToken').child(auth.token.sessionToken).exists()"
      }
    }
  }
}
```

### Example of using the client
Unlike servers, the client uses the Firebase SDK to access the database. So, initialize the app with Firebase config and pass the db object to the function provided by the package for use it. The CRUD function (setDoc, addDoc, getDoc, updateDoc, removeDoc...) in Firebase v9 must use the functions wrapped in the package. The wrapper functions have the same signature as Firebase SDK v9.

#### For Cloud Firestore
```tsx
import { getUserDoc, getDoc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from '@lowfront/firebase-adapter';

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

#### For Realtime Database

The current Realtime Database should wrap requests with a login check function instead of a wrapper function. See the [example code](https://github.com/lowfront/firebase-adapter/blob/master/examples/firebase/pages/index.tsx) for more information.

```ts
import { signInFirebase, trySignInWithCustomToken } from '@lowfront/firebase-adapter/web';
import { get, ref } from 'firebase/database';

async function loadData() {
  console.log(`users/${btoa(session?.user?.email ?? '')}`);
  try {
    await trySignInWithCustomToken(() => get(ref(db, `users/${btoa(session?.user?.email ?? '')}`)), getApp()); // The Realtime Database uses the value encoded as base64 as the user storage path because email is not available as a key.
    alert('success load data');
  } catch (err) {
    console.log(err);
    alert('Fail load data');
  }
}
```
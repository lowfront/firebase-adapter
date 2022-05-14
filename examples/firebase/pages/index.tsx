import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react';
import { getUserDoc, getDoc } from '@lowfront/firebase-adapter/web';
import { get, push, update, remove, ref } from 'firebase/database';
import { db } from '../lib/firebase-web';

const Home: NextPage = () => {
  const { data: session } = useSession();

  async function loadData() {
    try {
      // const testDoc = await get(ref(db, `_next_auth_firebase_adapter_/store/${session?.user?.email ?? ''}/test`));
      // alert('success load data');
    } catch (err) {
      console.log(err);
      // alert('Fail load data');
    }
  }

  if (session) {
    return <>
      Signed in as {session?.user?.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
      <p><button onClick={loadData}>Load data</button></p>
    </>;
  }
  return <>
    Not signed in <br />
    <button onClick={() => signIn('google')}>Sign in</button>
  </>;
};

export default Home;

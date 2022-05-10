import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react';
import { getUserDoc, getDoc } from '../../dist/cjs/web';
import { db } from '../lib/firebase-web';

const Home: NextPage = () => {
  const { data: session } = useSession();
  
  async function loadData() {
    try {
      const testDoc = getUserDoc(db, session?.user?.email, 'store', 'test');
      await getDoc(testDoc);
      alert('success load data');
    } catch {
      alert('Fail load data');
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

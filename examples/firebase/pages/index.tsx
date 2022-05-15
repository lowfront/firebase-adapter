import type { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react';
import { signInFirebase, trySignInWithCustomToken } from '@lowfront/firebase-adapter/web';;
import { get, ref } from 'firebase/database';
import { app, db } from '../lib/firebase-web';
import { useEffect } from 'react';
import { getApp, getApps } from 'firebase/app';

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    signInFirebase(getApp()).catch(console.error);
  }, [session]);

  async function loadData() {
    console.log(`users/${btoa(session?.user?.email ?? '')}`);
    try {
      await trySignInWithCustomToken(() => get(ref(db, `users/${btoa(session?.user?.email ?? '')}`)), getApp());
      alert('success load data');
    } catch (err) {
      console.log(err);
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

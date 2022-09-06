import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  User,
  onAuthStateChanged,
  getAuth,
  getRedirectResult,
} from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { Head_ } from "../components/head_";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Loader } from "../components/loader";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    };
    const app = initializeApp(firebaseConfig);

    const auth = getAuth();
    if (!auth.currentUser && process.env.NODE_ENV !== "production") {
      // エミュレーターはemulatorコンテナで動作しているが、フロントのコードはコンテナホストで動作するので、コンテナホストのホスト名(localhost)を指定する必要がある
      // コンテナ名を指定してもコンテナホストからは参照できない (firestore emulatorも同じ)
      connectAuthEmulator(auth, "http://localhost:9099");
      // cypressに動作に必要 https://zenn.dev/cauchye/articles/20210816_yutaro-elk
      const db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
      connectFirestoreEmulator(db, "localhost", 8080);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      const credential = await getRedirectResult(auth).catch((error) =>
        console.error(error),
      );
      if (credential) {
        const id = await credential.user.getIdToken();
        await fetch("/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session: id }),
        });
        router.reload();
        return;
      }
      setLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  return loaded ? (
    <div className="content">
      <Head_ />
      <Header />
      <Component {...pageProps} />
      <Footer className="footer" />
    </div>
  ) : (
    <>
      <Head_ />
      <Loader />
    </>
  );
}

export default MyApp;

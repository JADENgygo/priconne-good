import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Image from "next/image";
import nookies from "nookies";
import { signOut, getAuth } from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { initFirebaseAdminApp } from "../lib/firebase-admin";
import { useEffect } from "react";

type Props = {
  noSession: boolean;
};

const Home: NextPage<Props> = (props: Props) => {
  useEffect(() => {
    // ログイン中にユーザーがクッキーを削除した場合はログアウトする
    const f = async () => {
      if (props.noSession) {
        const auth = getAuth();
        await signOut(auth);
      }
    };
    f();
  }, []);

  return (
    <div>
      <div className="bg-secondary text-center text-white pt-5 pb-5">
        <div className="container">
          プリコネグッドは、クランメンバーへのいいね管理ツールです。
        </div>
      </div>

      <div className="text-center mt-5">
        <div className="container">
          <p className="fw-bold">クランメンバー全員にいいねを</p>
          プリコネグッドを使うことで、いいねの管理を効率的に行えます。誰に何回いいねしたのか簡単に記録することができます。
        </div>
      </div>

      <div className="container mt-5 mb-5 text-center d-flex justify-content-center align-items-center flex-wrap">
        <div className="me-lg-5 me-lg-5">
          <Image
            src="/img/priconne-good.webp"
            alt="カウンター"
            width={375}
            height={627}
          />
        </div>
        <div>
          <div className="mt-5 p-3 description">
            <p className="fw-bold">クランメンバーの記録</p>
            <p>クランメンバーの名前を記入してデータの管理ができます。</p>
          </div>
          <div className="mt-5 p-3 description">
            <p className="fw-bold">いいねのカウント</p>
            <p>＋/－ボタンでいいねのカウントを制御できます。</p>
          </div>
          <div className="mt-5 p-3 description">
            <p className="fw-bold">初期化</p>
            <p>リセットボタンでいいねのカウントを初期化できます。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = nookies.get(context);
  const session = cookie.session;
  if (!session) {
    return { props: { noSession: true } };
  }

  initFirebaseAdminApp();

  try {
    await getAdminAuth().verifySessionCookie(session, true);
    return {
      redirect: {
        permanent: false,
        destination: "/edit",
      },
    };
  } catch (error) {
    return { props: { noSession: true } };
  }
};

export default Home;

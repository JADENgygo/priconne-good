import styles from "../styles/Signin.module.css";
import React from "react";
import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  TwitterAuthProvider,
} from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import nookies from "nookies";
import { initFirebaseAdminApp } from "../lib/firebase-admin";
import { Accordion } from "react-bootstrap";

const Signin: NextPage = () => {
  const loginByTwitter = async () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <div className="col-lg-4"></div>
        <div className="col-lg-4 col-12">
          <button
            type="button"
            className={`btn btn-outline-dark mt-3 text-center ${styles["signin-button"]}`}
            onClick={loginByTwitter}
            id="twitterLogin"
          >
            <i className={`bi bi-twitter link ${styles.icon}`}></i>
            <span className="ms-1 align-text-bottom">
              &nbsp;Twitterで新規登録/ログイン
            </span>
          </button>
        </div>
        <div className="col-lg-4"></div>
      </div>
      <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>新規登録/ログインできない場合</Accordion.Header>
          <Accordion.Body>
            ブラウザの設定でCookieとトラッキングの制限を緩めてください。解決しない場合は、Edge/Chrome/Safariでのログインを試みてください。
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Signin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = nookies.get(context);
  const session = cookie.session;
  if (!session) {
    return { props: {} };
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
    console.error(error);
    return { props: {} };
  }
};

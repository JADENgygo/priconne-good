import styles from "../styles/Signin.module.css";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import {
  getAuth,
  signInWithRedirect,
  TwitterAuthProvider,
} from "firebase/auth";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import nookies from "nookies";
import { initFirebaseAdminApp } from "../lib/firebase-admin";
import { Button, Collapse } from "react-bootstrap";

type Props = {
  theme: "light" | "dark",
};

const Signin: NextPage<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);

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
            className={`btn ${props.theme === "light" ? "btn-outline-dark" : "btn-secondary"} mt-3 text-center ${styles["signin-button"]}`}
            onClick={loginByTwitter}
            id="twitterLogin"
          >
            <i className={`bi bi-twitter ${styles.icon}`}></i>
            <span className="ms-1 align-text-bottom">
              &nbsp;Twitterで新規登録/ログイン
            </span>
          </button>
        </div>
        <div className="col-lg-4"></div>
      </div>
      <div className="text-center mt-5">
        <Button variant={props.theme === "light" ? "outline-dark" : "secondary"} onClick={() => setOpen(!open)} aria-controls="collapse-text" aria-expanded={open}>
          新規登録/ログインできない場合 <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
        </Button>
      </div>
      <Collapse in={open}>
        <div id="collapse-text" className="mt-3">
          <div className={`card card-body ${props.theme === "light" ? "text-dark" : "text-light bg-secondary"}`}>

            ブラウザの設定でCookieとトラッキングの制限を緩めてください。解決しない場合は、Edge/Chrome/Safariでのログインを試みてください。
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Signin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = nookies.get(context);
  const session = cookie.session;
  const theme = context.query.theme === "dark" ? "dark" : "light";
  if (!session) {
    return { props: {theme} };
  }

  initFirebaseAdminApp();

  try {
    await getAdminAuth().verifySessionCookie(session, true);
    return {
      redirect: {
        permanent: false,
        destination: "/edit?theme=" + theme,
      },
    };
  } catch (error) {
    console.error(error);
    return { props: {theme} };
  }
};

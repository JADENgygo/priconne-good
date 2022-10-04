import React, { useState } from "react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore, collection } from "firebase/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import nookies from "nookies";
import { initFirebaseAdminApp } from "../lib/firebase-admin";

const Delete: NextPage = () => {
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();

  const confirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(event.target.value !== "プリコネ");
  };

  const deleteAccount = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "users");
    const auth = getAuth();
    const docRef = doc(collectionRef, auth.currentUser?.uid);
    await deleteDoc(docRef);

    await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };

  return (
    <div className="container mt-5">
      <div>
        アカウントを削除する場合は「プリコネ」と入力してください
        <input
          type="text"
          className="form-control mt-3"
          onChange={confirm}
          id="confirm"
        />
        <button
          type="button"
          className="mt-3 btn btn-danger"
          disabled={disabled}
          onClick={deleteAccount}
          id="deleteButton"
        >
          アカウント削除
        </button>
      </div>
    </div>
  );
};

export default Delete;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = nookies.get(context);
  const session = cookie.session;
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  initFirebaseAdminApp();

  try {
    await getAdminAuth().verifySessionCookie(session, true);
    return { props: {} };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};

import style from "../styles/Header.module.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

export const Header = () => {
  const router = useRouter();
  const auth = getAuth();

  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(auth.currentUser !== null);
  });

  const logOut = async () => {
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      bg="dark"
      className="pt-3 pb-3"
      variant="dark"
    >
      <Container>
        <Navbar.Brand className="fs-3">
          <Nav.Link href="#" className="link-light" onClick={() => router.push("/")}>プリコネグッド</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <div className="text-nowrap text-white row row-cols-auto">
              <div className="col">
                <Nav.Link href="#" className="link-light link" onClick={() => router.push("/")}>ホーム</Nav.Link>
              </div>
              {authenticated && (
                <div className="col" id="delete">
                  <Nav.Link href="#" className="link-light link" onClick={() => router.push("/delete")}>アカウント削除</Nav.Link>
                </div>
              )}
              <div className="col">
                {authenticated ? (
                  <Nav.Link href="#" id="logout" className="link-light link" onClick={logOut}>ログアウト</Nav.Link>
                ) : (
                  <div id="login">
                    <Nav.Link href="#" id="signin" className="link-light link" onClick={() => router.push("/signin")}>新規登録/ログイン</Nav.Link>
                  </div>
                )}
              </div>
              {authenticated && (
                <div className="col">
                  <Nav.Link href="#" className="text-light">@{(auth.currentUser as any)?.reloadUserInfo?.screenName}</Nav.Link>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

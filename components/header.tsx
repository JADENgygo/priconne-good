import { useRouter } from "next/router";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Loader } from "./loader";
import { parseCookies, setCookie } from "nookies";

export const Header = () => {
  const [loaded, setLoaded] = useState(true);
  const router = useRouter();
  const [theme, setTheme] = useState<"" | "light" | "dark">("");
  const [authenticated, setAuthenticated] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    setAuthenticated(auth.currentUser !== null);
  });

  useEffect(() => {
    const cookie = parseCookies();
    setTheme(cookie.theme === "dark" ? "dark" : "light");
  }, [])

  const changeTheme = () => {
    const cookie = parseCookies();
    setCookie(null, "theme", cookie.theme === "dark" ? "light" : "dark", {
      maxAge: 60 * 60 * 24 * 30 * 12 * 1,
      path: "/"
    });
    router.reload();
  };

  const logOut = async () => {
    setLoaded(false);
    await fetch("/api/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.reload();
  };

  if (!loaded) {
    return <Loader />;
  }

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      className="pt-3 pb-3"
      variant={theme}
    >
      <Container>
        <Navbar.Brand className="fs-3">
          <Nav.Link href="#" className="fw-bold" onClick={() => router.push("/")}>プリコネグッド</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <div className="text-nowrap row row-cols-auto">
              <div className="col">
                <Nav.Link href="#" className="active link" onClick={() => router.push("/")}>ホーム</Nav.Link>
              </div>
              {authenticated && (
                <div className="col" id="delete">
                  <Nav.Link href="#" className="active link" onClick={() => router.push("/delete")}>アカウント削除</Nav.Link>
                </div>
              )}
              <div className="col">
                {authenticated ? (
                  <Nav.Link href="#" id="logout" className="active link" onClick={logOut}>ログアウト</Nav.Link>
                ) : (
                  <div id="login">
                    <Nav.Link href="#" id="signin" className="active link" onClick={() => router.push("/signin")}>新規登録/ログイン</Nav.Link>
                  </div>
                )}
              </div>
              <div className="col" style={{visibility: theme === "" ? "hidden" : "visible"}}>
                <Nav.Link href="#" className="active link" onClick={changeTheme}>ダークモード: {theme === "light" ? "オフ": "オン"}</Nav.Link>
              </div>
              {authenticated && (
                <div className="col">
                  <Nav.Link href="#" className="active">@{(auth.currentUser as any)?.reloadUserInfo?.screenName}</Nav.Link>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

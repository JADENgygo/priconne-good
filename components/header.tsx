import { useRouter } from "next/router";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

type Props = {
  theme: "light" | "dark",
};

export const Header = (props: Props) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  const auth = getAuth();
  useEffect(() => {
    setAuthenticated(auth.currentUser !== null);
  });

  useEffect(() => {
    if (props.theme !== "light" && props.theme !== "dark") {
      return;
    }
    const classes = document.body.classList;
    if (props.theme === "light") {
      classes.remove("bg-dark", "text-light");
    }
    else {
      classes.add("bg-dark", "text-light");
    }
  }, [router]);

  const changeTheme = () => {
    router.push(router.pathname + `?theme=${props.theme === "light" ? "dark" : "light"}`);
  };

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
      bg={props.theme === "light" ? "white" : props.theme}
      className="pt-3 pb-3"
      variant={props.theme}
    >
      <Container>
        <Navbar.Brand className="fs-3">
          <Nav.Link href="#" className={props.theme === "light" ? "text-dark" : "text-light"} onClick={() => router.push("/?theme=" + props.theme)}>プリコネグッド</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <div className="text-nowrap text-white row row-cols-auto">
              <div className="col">
                <Nav.Link href="#" className={`link ${props.theme === "light" ? "text-dark" : "text-light"}`} onClick={() => router.push("/?theme=" + props.theme)}>ホーム</Nav.Link>
              </div>
              {authenticated && (
                <div className="col" id="delete">
                  <Nav.Link href="#" className={`link ${props.theme === "light" ? "text-dark" : "text-light"}`} onClick={() => router.push("/delete?theme=" + props.theme)}>アカウント削除</Nav.Link>
                </div>
              )}
              <div className="col">
                {authenticated ? (
                  <Nav.Link href="#" id="logout" className={`link ${props.theme === "light" ? "text-dark" : "text-light"}`} onClick={logOut}>ログアウト</Nav.Link>
                ) : (
                  <div id="login">
                    <Nav.Link href="#" id="signin" className={`link ${props.theme === "light" ? "text-dark" : "text-light"}`} onClick={() => router.push("/signin?theme=" + props.theme)}>新規登録/ログイン</Nav.Link>
                  </div>
                )}
              </div>
              <div className="col">
                <Nav.Link href="#" className={`theme ${props.theme === "light" ? "text-dark" : "text-light"}`} onClick={changeTheme}>ダークモード: {props.theme === "light" ? "オフ": "オン"}</Nav.Link>
              </div>
              {authenticated && (
                <div className="col">
                  <Nav.Link href="#" className={`${props.theme === "light" ? "text-dark" : "text-light"}`}>@{(auth.currentUser as any)?.reloadUserInfo?.screenName}</Nav.Link>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

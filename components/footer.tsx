type Props = {
  theme: "light" | "dark",
};

export const Footer = (props: Props) => {
  return (
    <footer
      className="text-center pt-3 pb-3"
    >
      <div className="container">
        <a href="https://twitter.com/JADENgygo">
          <i className="bi bi-twitter"></i>
        </a>
        <a
          href="https://priconne-portfolio.vercel.app"
          className={`ms-3 ${props.theme === "light" ? "link-dark" : "link-light"} link`}
        >
          闇プリン開発室
        </a>
      </div>
      <div>一部画像 &copy; Cygames, Inc.</div>
    </footer>
  );
};


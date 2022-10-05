import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="プリコネRのいいね管理ツール" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@JADENgygo" />
        <meta property="og:url" content="https://priconne-good.vercel.app" />
        <meta property="og:title" content="プリコネグッド" />
        <meta property="og:description" content="プリコネRのいいね管理ツール" />
        <meta
          property="og:image"
          content="https://priconne-good.vercel.app/img/peko.png"
        />
        <link rel="icon" href="/img/peko.png" />
      </Head>
      <body>
        <script src="/script.js" async />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

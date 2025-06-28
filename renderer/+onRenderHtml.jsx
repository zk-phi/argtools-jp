import { render } from "preact-render-to-string";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import "../resources/dark.css";
import "../src/style.css";

// TODO: Define type of PageContext and migrate to TypeScript
// https://vike.dev/pageContext#extend

export const onRenderHtml = ({ Page, config }) => {
  const prerendered = render(<Page />);

  const backlink = config.backlink ? (
    '<header><a href="/argtools-jp/">＜ 全てのツール</a></header>'
  ) : (
    ""
  );

  const details = config.details ? (
    escapeInject`<p>${config.details}</p>`
  ) : (
    ""
  );

  return escapeInject`<!DOCTYPE html>
    <html lang="ja">

      <head>
        <title>${config.title}</title>
        <meta name="description" content="${config.description ?? ""}">
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script async src="https://www.googletagmanager.com/gtag/js"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7SXT99VRH4');
        </script>
      </head>

      <body>
        ${dangerouslySkipEscape(backlink)}
        <h2>${config.title}</h2>
        <p>${config.description}</p>
        ${details}
        <div id="app">
          ${dangerouslySkipEscape(prerendered)}
        </div>
        <footer style="font-size:smaller">
          <div>
            Built with ♡ by
            <a href="https://zk-phi.github.io/" target="_blank" rel="noreferrer">zk-phi</a>
            (
            <a href="https://github.com/zk-phi/argtools-jp/" target="_blank" rel="noreferrer">ライセンス表示・ソースコード</a>
            )
            <a href="javascript: void" onclick="share()">🤝 X でシェア</a>
          </div>
          <div>
            このツールでは、アクセス数等の集計に Google Analytics (Cookie) を使用しています。
          </div>
        </footer>
        <script>
function share() {
  const title = document.title;
  const url = location.href;
  window.open("https://twitter.com/share?url=" + url + "&text=" + title + "&hashtags=ARGTOOLS");
}
        </script>
      </body>

    </html>`
};

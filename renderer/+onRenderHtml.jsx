import { render } from "preact-render-to-string";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import "./dark.css";

export const onRenderHtml = ({ Page, config }) => {
  const prerendered = render(<Page />);

  return escapeInject`<!DOCTYPE html>
    <html lang="ja">

      <head>
        <title>${config.title}</title>
        <meta name="description" content="${config.description ?? ""}">
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>

      <body>
        <div id="app">
          ${dangerouslySkipEscape(prerendered)}
        </div>
        <p>
          <small>
            Built with ♡ by
            <a href="https://zk-phi.github.io/" target="_blank" rel="noreferrer">zk-phi</a>
            (
            <a href="https://github.com/zk-phi/argtools-jp/" target="_blank" rel="noreferrer">ライセンス表示・ソースコード</a>
            )
          </small>
        </p>
      </body>

    </html>`
};

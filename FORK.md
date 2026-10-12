# This fork

This repository is [minzhang/NotionNext](https://github.com/minzhang/NotionNext), the copy that publishes Min Zhang's site. It tracks upstream NotionNext and keeps only the site defaults listed below.

## Upstream

| | |
| --- | --- |
| Canonical repository | [notionnext-org/NotionNext](https://github.com/notionnext-org/NotionNext) |
| Same history, previous name | [tangly1024/NotionNext](https://github.com/tangly1024/NotionNext) |
| This fork | [minzhang/NotionNext](https://github.com/minzhang/NotionNext) |
| Previous sync | 12 Oct 2022, NotionNext 3.4.5, commit `f411104` |
| Current sync | NotionNext 4.10.10, upstream commit `1c2c24f8` (11 Oct 2026) |

`notionnext-org/NotionNext` and `tangly1024/NotionNext` point at the same commit. GitHub records this fork's parent as `notionnext-org/NotionNext`.

Add the remote once:

```bash
git remote add upstream https://github.com/notionnext-org/NotionNext.git
```

To take a later upstream release, merge it and keep the defaults in the next section:

```bash
git fetch upstream
git merge upstream/main
```

Upstream moved personalization out of one large `blog.config.js` and into `blog.config.js` plus `conf/*.config.js`. Environment variables override those defaults. `.env.local` is gitignored.

## Site defaults kept from the 2022 fork

These values are the committed fallbacks, so a Vercel build does not need them set in the dashboard. An environment variable with the same name still wins.

| Setting | Value | File |
| --- | --- | --- |
| Author | Min Zhang | `blog.config.js` (`NEXT_PUBLIC_AUTHOR`) |
| Bio | 爱好杂乱会写代码 | `blog.config.js` (`NEXT_PUBLIC_BIO`) |
| Site URL | https://blog.minzhang.com | `blog.config.js` (`NEXT_PUBLIC_LINK`) |
| Keywords | Notion, 博客, Blog | `blog.config.js` (`NEXT_PUBLIC_KEYWORD`) |
| Notion page | `97233f23b56242a2b1d53f583107507a` | `blog.config.js` (`NOTION_PAGE_ID`) |
| Theme | `fukasawa` | `blog.config.js` (`NEXT_PUBLIC_THEME`) |
| Theme switch | on | `conf/widget.config.js` |
| Site since | 2010 | `blog.config.js` (`NEXT_PUBLIC_SINCE`) |
| Font | `font-mono tracking-wider subpixel-antialiased` | `conf/font.config.js` |
| Hexo greetings | 会写代码, 爱好杂乱, 欢迎来到我的博客🎉 | `blog.config.js` (`NEXT_PUBLIC_GREETING_WORDS`) |
| Comments | Utterances on `minzhang/NotionNext` | `conf/comment.config.js` |
| Google Analytics | `G-8N5K9G8Q11` | `conf/analytics.config.js` |

Email and GitHub contact fields stay empty. Fireworks stay off, which is also upstream's default.

The 2022 tree stored the Hexo greetings in `themes/hexo/config_hexo.js`. Upstream removed that file. The same three phrases now live in `GREETING_WORDS`.

Article pages use Utterances for the footer comment box. The 2022 site used Cusdis (`148a2b60-94e3-46b6-b317-847f875e2060`). That hosted service is down (Cloudflare 521) and the project was archived in July 2026, so the widget cannot load. Utterances stores new comments as GitHub issues on `minzhang/NotionNext`, keyed by the Notion page id. Older Cusdis threads are not imported.

Utterances only accepts comments after two GitHub settings on that repo: Issues are enabled, and the [utterances app](https://github.com/apps/utterances) is installed. Set `NEXT_PUBLIC_COMMENT_UTTERRANCES_REPO` to use a different `owner/repo`.

## Notion

The blog reads one public Notion database. No Notion token is committed, and the 2022 site did not use one.

- Page id: `97233f23b56242a2b1d53f583107507a`
- Public page: https://www.notion.so/97233f23b56242a2b1d53f583107507a
- Copied from the NotionNext template `02ab3b8678004aa69e9e415905ef32a5` (https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5)
- API base: `https://app.notion.com/api/v3` (`API_BASE_URL` in `blog.config.js`)
- Client: `notion-client` 7.12.1, matching `react-notion-x`

The database title and description override the author fields on the home page. For this database they are "Blog on Notion" and "Min Zhang's Blog". Posts, tags, and categories come from that database. Pages are generated with `getStaticProps` and revalidated on the interval in `NEXT_REVALIDATE_SECOND` (60 seconds unless overridden).

A private database needs `NOTION_TOKEN` or the older `NOTION_ACCESS_TOKEN` path documented in upstream `.env.example`. This fork does not set either.

## Runtime

From `package.json`:

- Node.js `>=22 <25`
- Yarn 1.22.22 (`packageManager`)
- Next.js 15, React 18

```bash
yarn
yarn dev
yarn build
yarn lint
yarn type-check
yarn test
```

`yarn dev` serves http://localhost:3000. Copy `.env.example` to `.env.local` only when overriding a default. Do not commit `.env.local`.

The old checkout committed `.env.local` with `NEXT_PUBLIC_VERSION=3.4.5`. Upstream ignores that file and reads the version from `package.json`, so it is no longer in git.

## Deployment

Production is Vercel, connected to this GitHub repository. Pushes to `main` created Production deployments. `vercel[bot]` recorded them from May 2022 through 12 Oct 2022. The last deploy before this catch-up was commit `f411104`.

| | |
| --- | --- |
| Vercel account | `minzhang` |
| Vercel project | `notion-next` |
| Stable project URL | https://notion-next-minzhang.vercel.app |
| Custom domain | https://blog.minzhang.com |
| Production branch | `main` |
| Last pre-catch-up deployment | https://notion-next-1bd4v3vz3-minzhang.vercel.app |

`blog.minzhang.com` still answers with `Server: Vercel`. There is no Vercel token or project id in the repo. After this catch-up is merged, the next push to `main` is what publishes the new version.

`.github/workflows/docker-ghcr.yaml` can build a container image. It is not the path that published the live site. GitHub's deployment list for this repo contains only Vercel.

## Cloud Agent dev server

A Cloud Agent environment proposed against the 3.4.5 tree starts `yarn dev` with a preload that rewrites Notion responses for `notion-client` 6. NotionNext 4.10.10 uses `notion-client` 7.12.1 and does not need that preload. After this branch is on `main`, the environment start command should be:

```bash
exec yarn dev -H 0.0.0.0 -p 3000
```

Leave the preload off. Install with `yarn install --frozen-lockfile` once `main` contains `yarn.lock`.

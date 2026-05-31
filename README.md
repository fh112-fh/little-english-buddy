# Little English Buddy

Mobile-first English learning tool for a 4-year-old child.

## Public Access

`127.0.0.1` and `192.168.x.x` links are only for local testing. They cannot be shared to a phone on a different network.

- Temporary public HTTPS link: run `npm.cmd run build`, then `npm.cmd run share:public`. This is useful for quick testing only. The URL can expire, disconnect, or change.
- Permanent public HTTPS link: deploy the static build to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or another static host. This is the correct option for a WeChat-shareable link that works from different networks over time.

Use the HTTPS public URL in WeChat. Microphone recording requires HTTPS; local HTTP links will show a gentle fallback button instead of blocking the lesson.

## Permanent Deployment

The app is a static front-end app. It does not need a custom server after build.

- Build command: `npm.cmd run build:static`
- Publish directory: `dist`
- GitHub Pages: this repo includes `.github/workflows/deploy-pages.yml`; push to `main`, then enable Pages with "GitHub Actions" as the source.
- Vercel: use build command `npm.cmd run build:static` and output directory `dist`.
- Netlify: `netlify.toml` is included; use output directory `dist`.
- Cloudflare Pages: use build command `npm.cmd run build:static` and output directory `dist`.

The Vite build uses relative asset paths so the app can also work under a project subpath, such as a GitHub Pages URL.

## Commands

- `npm.cmd install`
- `npm.cmd run build`
- `npm.cmd run build:static`
- `npm.cmd run share:public`
- `npm.cmd run serve:phone` for same-Wi-Fi testing only

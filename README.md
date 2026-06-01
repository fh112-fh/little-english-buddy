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

## WeChat Mini Program

The `miniprogram` folder is a native WeChat Mini Program version using AppID `wx01ebbc05d75c95e5`.

Open it with WeChat DevTools:

1. Download WeChat DevTools: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. Open WeChat DevTools and sign in with the administrator WeChat account.
3. Click `Import Project`.
4. Project directory: choose `C:\Users\ehafo\Documents\生活小助手\miniprogram`.
5. AppID: `wx01ebbc05d75c95e5`.
6. Project name: `little-english-buddy`.
7. Click `Import`.
8. Click `Compile`, then use `Preview` to scan with WeChat on a phone.

The Mini Program version keeps the same core flows: kid mode, parent mode, word cards, matching, recording practice, local progress, daily check-in, month calendar, and daily learning library.

Note: browser speech synthesis is not available inside native Mini Programs. The current Mini Program build keeps a safe pronunciation button with haptic/toast feedback; production-grade English pronunciation should be connected next with local MP3 assets or an approved WeChat Mini Program speech/audio plugin.

To upload a trial/review build after testing:

1. Open WeChat DevTools.
2. Make sure the administrator WeChat account is logged in.
3. Open `Settings` -> `Security` and enable the service port if command-line upload is needed.
4. Import `C:\Users\ehafo\Documents\生活小助手\miniprogram`.
5. Click `Compile` and test kid mode, parent mode, recording, check-in, and month switching.
6. Click `Upload`, or run:
   `C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat upload --project C:\Users\ehafo\Documents\生活小助手\miniprogram --version 0.2.0 --desc "Fix responsive layout and core flows"`
7. In the Mini Program admin console, submit the uploaded version for review: https://mp.weixin.qq.com/

## Commands

- `npm.cmd install`
- `npm.cmd run build`
- `npm.cmd run build:static`
- `npm.cmd run share:public`
- `npm.cmd run serve:phone` for same-Wi-Fi testing only

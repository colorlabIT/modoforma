# MODOFORMA — static site

A clean static rebuild of the live [modoforma.com](https://www.modoforma.com) (previously Framer), used as a free, low-maintenance placeholder until the full site is built. Pure static HTML/CSS — no build step, no database, no subscription.

## What's here

- `index.html` — single page: hero (looping YouTube background video + poster image, tagline, CTA), a marquee of partner-brand logos (MODOFORMA, MODDDO, colorlab., NERO Cucine, Canova), and a footer with contact info.
- `assets/` — self-hosted images (JPEG + WebP where relevant) and the Clash Display font (self-hosted, was loaded from Fontshare via Framer).
- `robots.txt`, `sitemap.xml`, `llms.txt` — basic SEO / AI-crawler files.
- `.htaccess` — Apache caching/compression config (ignored by GitHub Pages, kept for portability if this ever moves to Apache hosting).
- `CNAME` — already set to `modoforma.com` for GitHub Pages' custom domain.

## What changed from the live site

- Removed Google Analytics (`gtag.js`) — no tracking of any kind now.
- All images and fonts self-hosted; nothing loads from `framerusercontent.com` or Fontshare's CDN.
- The background video is still a YouTube embed (unchanged) — YouTube hosting is free and this avoids storing/serving a large video file directly.
- Same copy, same contact details, same partner-logo marquee as the live site.

## Deploying

This repo is already wired up to GitHub Pages with `modoforma.com` as its custom domain — pushing to `main` is the entire deployment. See the main colorlab.ca project's README for the DNS-side steps needed to point `modoforma.com` at GitHub Pages instead of Framer.

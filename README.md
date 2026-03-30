# GPT Sites

![GPT Sites](src/imgs/gptsites_readme.png)

**Discover the best Get Paid To sites, tips, and guides to maximize your online earnings.**

GPT Sites is a React + Vite web application that helps users find and compare the top Get Paid To (GPT) platforms — sites where you can earn real cash, crypto, and gift cards by completing surveys, watching videos, and doing simple tasks. The site features curated guides, practical tips, and a comprehensive FAQ to help both beginners and experienced earners get the most out of their time.

> Check out the **Guides** page for the best current offers, or visit the **Tips & FAQ** pages to level up your strategy.

---

## Running Locally

Create a `.env` file in the project root:

```bash
# Leave VITE_API_BASE_URL unset to use same-origin /api (recommended)
# VITE_API_BASE_URL=https://gpt-sites.onrender.com
```

1. **Install dependencies**
```bash
npm install
```

2. **Start the development server**
```bash
npm run dev
```

3. Open the URL shown in the terminal (usually http://localhost:5173)

## Production Build

If the frontend and backend are on different origins in Render, set:

```bash
VITE_API_BASE_URL=https://gpt-sites.onrender.com
```

```bash
npm run build
npm run preview
```

## Render Deployment

Use a Node Web Service (not Static Site) so `/api` is served by Express.

1. Build Command: `npm ci && npm run build`
2. Start Command: `npm start`
3. Health Check Path: `/healthz`
4. Leave `VITE_API_BASE_URL` unset for same-origin `/api`

This repository includes [render.yaml](render.yaml) with these settings.

### AdToWall Offer Availability

The backend now pulls AdToWall offers from the `offersrunnable` feed, so `/api/offers/adtowall` returns only offers that are runnable on your wall (instead of all catalog offers).

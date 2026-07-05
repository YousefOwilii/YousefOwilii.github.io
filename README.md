# The Application Race — Yousef vs Adham

A friendly competition counter for job applications. React + Vite, no other libraries.

## Run locally

```
npm install
npm run dev
```

## Deploy (Vercel)

Import the GitHub repo on [vercel.com/new](https://vercel.com/new) — it auto-detects Vite. Done.

## Shared cloud sync (optional, free)

Out of the box the counts save in each browser (localStorage). To share one scoreboard between both of you:

1. In the Vercel project → **Storage** → create an **Upstash Redis** database (free tier) and connect it.
2. That adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars automatically. Redeploy.
3. The footer will switch from "Saved on this device" to "Synced to the cloud".

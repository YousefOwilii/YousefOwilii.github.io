# Deployment Guide

This project can be deployed in two ways:

## 1. GitHub Pages Deployment (Static, without AI chat functionality)

GitHub Pages only supports static websites, so the AI chat functionality won't work directly.

1. Make sure your `next.config.js` is set up for static export (with `output: 'export'`)
2. Build your project: `npm run build`
3. Deploy to GitHub Pages

## 2. Vercel Deployment (With API routes for AI chat)

For full functionality including the AI chat:

1. Fork/push this repository to GitHub
2. Sign up for Vercel (https://vercel.com)
3. Connect your GitHub repository to Vercel
4. Set the following environment variables in Vercel:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
5. Deploy your project

## 3. Hybrid Approach (Recommended)

Use both GitHub Pages for the main site and Vercel for the API:

1. Deploy the API part to Vercel
2. Update the API endpoint URL in `src/components/ChatWidget.tsx` to point to your Vercel deployment:
   ```javascript
   apiResponse = await fetch("https://your-vercel-deployment-url.vercel.app/api/chat", {
   ```
3. Deploy the static part to GitHub Pages

## Troubleshooting

If the chat functionality isn't working:

1. Check browser console for errors
2. Verify your API key is correctly set in Vercel environment variables
3. Make sure the API endpoint URL is correct in your code
4. Check if CORS is properly configured (may need to add your GitHub Pages domain to allowed origins)

The code has a fallback mechanism that will try to use a direct API call if the Vercel endpoint fails, but this is not recommended for production as it exposes your API key. 
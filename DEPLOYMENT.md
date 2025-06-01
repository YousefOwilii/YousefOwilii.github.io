# Deployment Guide

This project can now be deployed directly to GitHub Pages without the need for a separate API server.

## GitHub Pages Deployment

1. Push your code to GitHub
2. Set up GitHub Pages deployment for your repository
3. The chat widget should work correctly without any additional configuration

## What's Changed

We've simplified the approach to directly use the OpenRouter API with their free model tier:

1. The chat widget now makes direct API calls to OpenRouter
2. We're using the "deepseek/deepseek-r1:free" model which is available for free use
3. No need for a separate server to hide API keys

## Troubleshooting

If the chat functionality isn't working:

1. Check browser console for errors
2. Make sure the API key in the code is still valid
3. Verify that the OpenRouter API is accessible and the free tier is still available
4. Check if you've exceeded the rate limits for free models (50 requests per day for free users)

## Getting Your Own API Key

For production use, you should get your own OpenRouter API key:

1. Create an account at https://openrouter.ai/
2. Click on "Keys" in the dashboard
3. Click "Create Key" and give it a name
4. Copy your API key and replace it in the code

## Rate Limits

Free model variants (with IDs ending in `:free`) are limited to:
- 20 requests per minute
- 50 requests per day for free accounts
- 1000 requests per day for accounts that have purchased at least 10 credits 
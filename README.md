# Yousef Owili's Personal Website

A modern, responsive personal portfolio website built with Next.js and Tailwind CSS.

## Features

- Responsive design for all screen sizes
- Dark/light mode toggle
- Modern UI with smooth animations
- Contact form with validation
- Project showcase section
- About section
- Deployed with GitHub Actions

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YousefOwilii/YousefOwilii.github.io.git
   ```

2. Navigate to the project directory
   ```bash
   cd YousefOwilii.github.io
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

This website is automatically deployed to GitHub Pages using GitHub Actions. Any push to the main branch will trigger a new deployment.

## License

MIT

## Contact

Yousef Owili - yousefowili_official@outlook.com

# AI Chat Widget

A React-based chat widget that uses OpenRouter API to provide AI responses.

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file in the root directory with your OpenRouter API key:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Run the development server with `npm run dev`

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the following environment variable in Vercel dashboard:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key

## Deployment on GitHub Pages

When deploying to GitHub Pages, the app uses a Vercel serverless function to handle API calls securely.

1. Push your code to GitHub
2. Set up Vercel for the API part:
   - Connect your repository to Vercel
   - Set up the `OPENROUTER_API_KEY` environment variable in Vercel
   - Deploy
3. Update the API endpoint URL in `src/components/ChatWidget.tsx` to your Vercel deployment URL:
   ```javascript
   apiResponse = await fetch("https://your-vercel-deployment-url.vercel.app/api/chat", {
   ```
4. Deploy to GitHub Pages using GitHub Actions or manual deployment

## Important Note

Never expose your API keys in client-side code when deploying to production. Always use environment variables and server-side API endpoints to handle sensitive data.

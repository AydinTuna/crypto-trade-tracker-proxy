# Binance API Proxy Server

This is a simple proxy server that relays requests to the Binance API. It's designed to be deployed in a region where Binance API is accessible (e.g., Europe or Asia) and then used by applications deployed in regions where Binance API is restricted (e.g., US).

## Features

- Proxies requests to Binance Futures API
- Handles rate limiting to prevent abuse
- Supports fetching single or multiple symbols
- CORS enabled for your application domain

## Deployment Options

### Option 1: Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Select a region in Europe or Asia
4. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `ALLOWED_ORIGIN`: Your Vercel app's domain (e.g., `https://your-app.vercel.app`)

### Option 2: Deploy to DigitalOcean

1. Create a Droplet in a European or Asian region
2. SSH into your Droplet
3. Clone your repository
4. Install Node.js and npm
5. Run `npm install`
6. Set up PM2 for process management: `npm install -g pm2`
7. Start the server: `pm2 start index.js`
8. Set up Nginx as a reverse proxy (recommended)

### Option 3: Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select a European or Asian region
4. Add environment variables:
   - `ALLOWED_ORIGIN`: Your Vercel app's domain
   - `PORT`: 3000 (or your preferred port)

## Usage

Once deployed, update your main application to use the proxy server instead of directly calling Binance:

```typescript
// In your app/api/prices/route.ts file
const proxyUrl = 'https://your-proxy-server.com/api/binance/prices';

// Then use proxyUrl instead of the direct Binance URL
```

## Local Development

1. Clone this repository
2. Run `npm install`
3. Start the server: `npm run dev`
4. The server will be available at `http://localhost:3001`

## Security Considerations

- Consider adding API key authentication to your proxy
- Set up proper CORS restrictions to only allow your application
- Monitor usage to detect and prevent abuse 
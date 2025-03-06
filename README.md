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

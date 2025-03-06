const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Vercel app's domain
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Proxy server is running');
});

// Proxy endpoint for Binance Futures API
app.get('/api/binance/prices', async (req, res) => {
    try {
        const { symbols } = req.query;
        const binanceUrl = 'https://fapi.binance.com/fapi/v1/ticker/price';

        // Handle multiple symbols
        if (symbols) {
            const symbolList = symbols.split(',');

            if (symbolList.length > 1) {
                // For multiple symbols, fetch them in parallel
                const promises = symbolList.map(symbol =>
                    axios.get(`${binanceUrl}?symbol=${symbol}`, {
                        timeout: 5000,
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
                        }
                    })
                        .then(response => response.data)
                        .catch(err => {
                            console.warn(`Failed to fetch ${symbol}:`, err.message);
                            return null;
                        })
                );

                const results = await Promise.all(promises);
                const formattedData = results.filter(Boolean);

                return res.json(formattedData);
            } else {
                // For a single symbol
                const response = await axios.get(`${binanceUrl}?symbol=${symbolList[0]}`, {
                    timeout: 5000,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
                    }
                });

                return res.json([response.data]);
            }
        } else {
            // If no symbols provided, fetch all available prices
            const response = await axios.get(binanceUrl, {
                timeout: 5000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Crypto-Trade-Tracker/1.0.0'
                }
            });

            return res.json(response.data);
        }
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch prices from Binance',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
}); 
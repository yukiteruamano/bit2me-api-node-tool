
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT_QUOTES = process.env.END_QUOTES || "/v1/currency/prices";
const ENDPOINT_CANDLE = "/v1/trading/candle";

/**
 * Fetches market overview (Prices + OHLCV)
 * 
 * @async
 * @function getMarketOverview
 * @returns {Promise<Array>} List of market data objects
 */
const getMarketOverview = async () => {
    try {
        // 1. Get current prices from quotes
        // We use EUR as base
        const quotesResponse = await axios.get(
            `${process.env.SERVER}${ENDPOINT_QUOTES}?currency=USDC`,
            getAuthHeaders(`${ENDPOINT_QUOTES}?currency=USDC`)
        );
        
        const prices = quotesResponse.data;
        const symbols = Object.keys(prices);
        
        // 2. Define major currencies to fetch candles for (to avoid rate limits for now)
        // In a real app, we might fetch all or paginate
        const majorSymbols = ['BTC', 'ETH', 'B2M', 'ADA', 'SOL', 'DOT', 'XRP', 'LTC', 'LINK', 'MATIC'];
        
        const results = [];
        
        // We'll process symbols that we have prices for
        // Cross-reference with majorSymbols to keep it fast
        const symbolsToFetch = symbols.filter(s => majorSymbols.includes(s));
        
        console.log(`Fetching overview for ${symbolsToFetch.length} symbols...`);
        
        for (const symbol of symbolsToFetch) {
            const currentPrice = prices[symbol][0]?.price || 0;
            const pair = `${symbol}/USDC`;
            
            let candle = { o: 0, h: 0, l: 0, c: 0, v: 0 };
            
            try {
                // Fetch last 1h candle
                // interval=60 (1 hour)
                const candleUrl = `${ENDPOINT_CANDLE}?symbol=${encodeURIComponent(pair)}&interval=60`;
                const candleResponse = await axios.get(
                    `${process.env.SERVER}${candleUrl}`,
                    getAuthHeaders(candleUrl)
                );
                
                const candles = candleResponse.data;
                if (candles && candles.length > 0) {
                    const latest = candles[candles.length - 1];
                    // Format from API: [timestamp, open, high, low, close, volume]
                    candle = {
                        o: latest[1],
                        h: latest[2],
                        l: latest[3],
                        c: latest[4],
                        v: latest[5],
                        t: latest[0]
                    };
                }
            } catch (e) {
                // If pair doesn't exist or error, we just keep default candle
                // console.warn(`Could not fetch candles for ${pair}`);
            }
            
            results.push({
                symbol,
                price: parseFloat(currentPrice),
                candle,
                lastUpdate: new Date().toISOString()
            });
        }
        
        return results;
    } catch (error) {
        console.error('Error fetching market overview:', error.message);
        throw error;
    }
};

// Execute getMarketOverview if run directly
if (require.main === module) {
    getMarketOverview();
}

module.exports = { getMarketOverview };

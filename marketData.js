/**
 * Bit2Me Market Data Module
 *
 * This script retrieves detailed market data for specific cryptocurrencies.
 * It provides comprehensive information about currency markets.
 *
 * @module marketData
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_MARKET_DATA;

const args = process.argv.slice(2);

if(args.length < 1){
    console.error("Usage: npm run market-data <currency>");
    process.exit(1);
}

const CURRENCY = args[0];

/**
 * Retrieves market data for a specific cryptocurrency
 *
 * This function fetches comprehensive market information including
 * price, volume, market cap, and other metrics.
 *
 * @async
 * @function marketData
 * @param {string} currency - Cryptocurrency symbol to get data for
 */
const marketData = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}?currency=${CURRENCY}`,
            getAuthHeaders(`${ENDPOINT}?currency=${CURRENCY}`)
        );

        console.log(response.data);
    } catch (error) {
        console.error('Error fetching market data:', error.response?.data || error.message);
    }
};

// Execute market data retrieval
marketData();
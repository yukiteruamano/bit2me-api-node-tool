/**
 * Bit2Me Ticker Info Module
 *
 * This script retrieves ticker information for a specific market.
 *
 * @module getTickerInfo
 * @author Bit2Me
 * @dev Get ticker info in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_TRADING_TICKERS || "/v2/trading/tickers";

const args = process.argv.slice(2);

// Args check moved to execution block

const MARKET = args[0];

/**
 * Retrieves Ticker Information
 *
 * This function sends a request to the Bit2Me API to get ticker data.
 *
 * @async
 * @function getTickerInfo
 * @returns {Promise<Object>} Ticker info response
 */
const getTickerInfo = async (market) => {
    // If market argument provided, use it, otherwise use global const from args
    const targetMarket = market || MARKET;
    
    if (!targetMarket) {
         console.error("No market specified.");
         return null;
    }

    try {
        console.log(`Fetching Ticker Info for ${targetMarket}...`);
        
        // Construct path with query parameter
        const pathWithQuery = `${PATH}?symbol=${targetMarket}`;

        // Send ticker info request
        const response = await axios.get(
            `${process.env.SERVER}${pathWithQuery}`,
            getAuthHeaders(pathWithQuery)
        );

        const tickers = response.data;
        
        console.log("Ticker Info Found:");
        console.log(tickers);

        return tickers;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
        throw e;
    }
}

// Execute ticker info retrieval if run directly
if (require.main === module) {
    if(args.length < 1){
        console.error("Usage: npm run get-ticker-info <market> (e.g. BTC/EUR)");
        process.exit(1);
    }
    getTickerInfo();
}

module.exports = { getTickerInfo };

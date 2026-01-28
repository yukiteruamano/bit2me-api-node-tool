/**
 * Bit2Me Market Data Config Module
 *
 * This script retrieves market configuration data.
 *
 * @module getMarketData
 * @author Bit2Me
 * @dev Get market data config in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_PRO_MARKET || "/v1/trading/market-config";

const args = process.argv.slice(2);

if(args.length < 1){
    console.error("Usage: npm run get-market-data <market> (e.g. BTC/EUR)");
    process.exit(1);
}

const MARKET = args[0];

/**
 * Retrieves Market Data Configuration
 *
 * This function sends a request to the Bit2Me API to get market configurations.
 *
 * @async
 * @function getMarketData
 * @returns {Promise<Object>} Market data response
 */
const getMarketData = async () => {
    try {
        console.log(`Fetching Market Data for ${MARKET}...`);
        // Send market data request
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );

        const markets = response.data;
        
        let found = false;
        
        // Handle if response is array or object containing list
        // Assuming array or object with keys matching market names or a list inside
        
        // If array of objects check property 'name' or 'symbol'
        // Common pattern: [{ symbol: "BTC/EUR", ... }] or keys "BTC/EUR": {...}
        
        if (Array.isArray(markets)) {
            const marketData = markets.find(m => m.name === MARKET || m.symbol === MARKET || m.pair === MARKET);
             if (marketData) {
                console.log("Market Data Found:");
                console.log(marketData);
                found = true;
            }
        } else if (typeof markets === 'object') {
             // Check if key exists directly
             if (markets[MARKET]) {
                 console.log("Market Data Found:");
                 console.log(markets[MARKET]);
                 found = true;
             } else {
                 // Iterate values if it's a map
                 const marketList = Object.values(markets);
                 const marketData = marketList.find(m => m.name === MARKET || m.symbol === MARKET || m.pair === MARKET);
                 if (marketData) {
                    console.log("Market Data Found:");
                    console.log(marketData);
                    found = true;
                }
             }
        }

        if (!found) {
            console.log(`Market ${MARKET} not found in configuration.`);
            console.log("Available markets (excerpt):", Array.isArray(markets) ? markets.slice(0, 5).map(m => m.name || m.symbol) : Object.keys(markets).slice(0, 5));
        }

        return response.data;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute market data retrieval
getMarketData();

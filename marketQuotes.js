/**
 * Bit2Me Market Quotes Module
 *
 * This script retrieves current market quotes for cryptocurrencies.
 * It provides real-time pricing information and exchange rates.
 *
 * @module marketQuotes
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_MARKET_QUOTES;

const args = process.argv.slice(2);
const CURRENCY = args[0] || "EUR"; // Default to EUR if no currency specified

/**
 * Retrieves market quotes for cryptocurrencies
 *
 * This function fetches current market pricing information for cryptocurrencies.
 * It can return quotes in the specified fiat currency or default to EUR.
 *
 * @async
 * @function marketQuotes
 * @param {string} [currency="EUR"] - Base currency for quotes (EUR, USD, etc.)
 * @returns {Promise<Object>} Market quotes data
 *
 * @example
 * // Get market quotes in EUR (default)
 * const quotes = await marketQuotes();
 *
 * @example
 * // Get market quotes in USD
 * const usdQuotes = await marketQuotes('USD');
 *
 * @example
 * // Response structure:
 * // {
 * //   BTC: { EUR: 42000.50, USD: 45000.75, ... },
 * //   ETH: { EUR: 3200.25, USD: 3450.50, ... },
 * //   ...
 * // }
 */
const marketQuotes = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}?currency=${CURRENCY}`,
            getAuthHeaders(`${ENDPOINT}?currency=${CURRENCY}`)
        );

        console.log(`Market Quotes (base: ${CURRENCY}):`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching market quotes:', error.response?.data || error.message);
    }
};

// Execute market quotes retrieval
marketQuotes();
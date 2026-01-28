/**
 * Bit2Me Currency Listing Module
 *
 * This script retrieves a comprehensive list of all available currencies
 * on the Bit2Me platform, including their properties and supported operations.
 *
 * @module listCurrencies
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_CURRENCIES;

/**
 * Lists all available currencies on Bit2Me platform
 *
 * This function retrieves detailed information about all supported cryptocurrencies,
 * including their symbols, names, available networks, withdrawal fees, and supported operations.
 *
 * @async
 * @function listCurrencies
 * @returns {Promise<Array>} Array of currency objects with detailed information
 *
 * @example
 * // Response includes comprehensive currency data:
 * // [
 * //   {
 * //     symbol: 'BTC',
 * //     name: 'Bitcoin',
 * //     networks: ['BITCOIN', 'LIGHTNING'],
 * //     withdrawalFees: { BITCOIN: '0.0005', LIGHTNING: '0.0001' },
 * //     operations: ['BUY', 'SELL', 'SWAP', 'WITHDRAW', 'DEPOSIT']
 * //   },
 * //   ...
 * // ]
 */
const listCurrencies = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT)
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching currencies:', error.response?.data || error.message);
        throw error;
    }
};

// Execute currency listing
listCurrencies();
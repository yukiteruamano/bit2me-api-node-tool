/**
 * Bit2Me Pocket Retrieval Utility
 *
 * This utility module provides functions for retrieving wallet/pocket information
 * from the Bit2Me platform. Pockets represent cryptocurrency wallets for specific currencies.
 *
 * @module getPocket
 * @author Bit2Me
 * @dev Get pocket in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_POCKET;

/**
 * Retrieves pocket/wallet information for specific currencies
 *
 * This function fetches pocket data from the Bit2Me API and can filter
 * results by currency if specified. Pockets represent cryptocurrency wallets.
 *
 * @async
 * @function getPocket
 * @param {string} [currency] - Optional currency filter (e.g., 'BTC', 'ETH')
 * @param {string} [subaccount=""] - Optional subaccount ID
 * @returns {Promise<Array>} Array of pocket objects matching the criteria
 *
 * @example
 * // Get all pockets for main account
 * const allPockets = await getPocket();
 *
 * @example
 * // Get BTC pockets for specific subaccount
 * const btcPockets = await getPocket('BTC', 'subaccount-123');
 *
 * @example
 * // Response structure:
 * // [
 * //   {
 * //     id: 'pocket-id',
 * //     currency: 'BTC',
 * //     name: 'My Bitcoin Wallet',
 * //     balance: '0.00000000',
 * //     available: '0.00000000',
 * //     ...
 * //   }
 * // ]
 */
const getPocket = async (currency, subaccount = "") => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH, subaccount)
        );

        // Filter by currency if specified, otherwise return all pockets
        return (currency) ? response.data.filter(item => item.currency === currency) : response.data;
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

module.exports = { getPocket }
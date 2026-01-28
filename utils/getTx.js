/**
 * Bit2Me Transaction Retrieval Utility
 *
 * This utility module provides functions for retrieving detailed transaction
 * information from the Bit2Me platform.
 *
 * @module getTx
 * @author Bit2Me
 * @dev Get tx in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_WALLET_TX;

/**
 * Retrieves detailed information about a specific transaction
 *
 * This function fetches comprehensive transaction data including status,
 * amounts, fees, timestamps, and other metadata from the Bit2Me API.
 *
 * @async
 * @function getTx
 * @param {string} tx - Transaction ID or reference
 * @param {string} [subaccount=""] - Optional subaccount ID
 * @returns {Promise<Object>} Transaction object with detailed information
 *
 * @example
 * // Get transaction details for main account
 * const transaction = await getTx('tx-12345');
 *
 * @example
 * // Get transaction details for subaccount
 * const subTx = await getTx('tx-67890', 'subaccount-123');
 *
 * @example
 * // Response structure:
 * // {
 * //   id: 'tx-12345',
 * //   type: 'BUY',
 * //   status: 'COMPLETED',
 * //   amount: '0.01000000',
 * //   currency: 'BTC',
 * //   fee: '0.00010000',
 * //   createdAt: '2023-01-01T12:00:00Z',
 * //   updatedAt: '2023-01-01T12:05:00Z',
 * //   ...additional transaction details
 * // }
 */
const getTx = async (tx, subaccount = "") => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}${tx}`,
            getAuthHeaders(`${PATH}${tx}`, subaccount)
        );
        return response.data;
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

module.exports = { getTx }
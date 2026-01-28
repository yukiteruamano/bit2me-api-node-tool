/**
 * Bit2Me Network Information Utility
 *
 * This utility module provides functions for retrieving available blockchain
 * networks for specific cryptocurrencies. It helps users determine which
 * networks are supported for deposits and withdrawals.
 *
 * @module getNetworks
 * @author Bit2Me
 * @dev Get all available networks for a currency in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

/**
 * Retrieves available blockchain networks for a cryptocurrency
 *
 * This function fetches the list of supported blockchain networks for the
 * specified cryptocurrency, including network-specific details like fees,
 * confirmation requirements, and status.
 *
 * @async
 * @function getNetworks
 * @param {string} currency - Cryptocurrency symbol (e.g., 'BTC', 'ETH', 'USDT')
 * @returns {Promise<Array|undefined>} Array of network objects or undefined if currency not provided/error
 *
 * @example
 * // Get networks for Bitcoin
 * const btcNetworks = await getNetworks('BTC');
 *
 * @example
 * // Get networks for USDT
 * const usdtNetworks = await getNetworks('USDT');
 *
 * @example
 * // Response structure:
 * // [
 * //   {
 * //     name: 'BITCOIN',
 * //     displayName: 'Bitcoin Network',
 * //     minDeposit: '0.0001',
 * //     minWithdrawal: '0.0001',
 * //     withdrawalFee: '0.0005',
 * //     confirmationsRequired: 3,
 * //     status: 'ACTIVE',
 * //     contractAddress: null // For native coins
 * //   },
 * //   {
 * //     name: 'LIGHTNING',
 * //     displayName: 'Lightning Network',
 * //     minDeposit: '0.00001',
 * //     minWithdrawal: '0.00001',
 * //     withdrawalFee: '0.0001',
 * //     confirmationsRequired: 1,
 * //     status: 'ACTIVE',
 * //     contractAddress: null
 * //   }
 * // ]
 *
 * @example
 * // Response for token (USDT):
 * // [
 * //   {
 * //     name: 'ETHEREUM',
 * //     displayName: 'Ethereum ERC-20',
 * //     minDeposit: '10',
 * //     minWithdrawal: '10',
 * //     withdrawalFee: '5',
 * //     confirmationsRequired: 12,
 * //     status: 'ACTIVE',
 * //     contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
 * //   },
 * //   {
 * //     name: 'TRON',
 * //     displayName: 'TRON TRC-20',
 * //     minDeposit: '1',
 * //     minWithdrawal: '1',
 * //     withdrawalFee: '1',
 * //     confirmationsRequired: 1,
 * //     status: 'ACTIVE',
 * //     contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
 * //   }
 * // ]
 */
const getNetworks = async (currency) => {
    // Return undefined if no currency provided
    if(!currency) return;

    try {
        // Construct API path for currency networks
        const path = `${process.env.END_WA_CURRENCY}${currency}/network`;

        // Fetch network information from Bit2Me API
        const response = await axios.get(
            `${process.env.SERVER}${path}`,
            getAuthHeaders(path)
        );

        return response.data;
    } catch {
        // Return undefined on error to maintain consistent return type
        return;
    }
}

module.exports = { getNetworks }
/**
 * Bit2Me Currency Withdrawal Configuration Utility
 *
 * This utility module provides functions for retrieving currency withdrawal
 * configuration information from the Bit2Me platform. It includes details
 * about withdrawal limits, fees, and supported networks for each currency.
 *
 * @module getCurrencyWdInfo
 * @author Bit2Me
 * @dev Get currency config in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

/**
 * Retrieves currency withdrawal configuration information
 *
 * This function fetches comprehensive withdrawal configuration data from the Bit2Me API,
 * including withdrawal limits, fees, minimum amounts, and supported networks for all
 * available cryptocurrencies.
 *
 * @async
 * @function getCurrencyWdInfo
 * @returns {Promise<Object|undefined>} Currency withdrawal configuration object or undefined on error
 *
 * @example
 * // Get withdrawal configuration for all currencies
 * const config = await getCurrencyWdInfo();
 *
 * @example
 * // Response structure:
 * // {
 * //   BTC: {
 * //     networks: {
 * //       BITCOIN: {
 * //         minWithdrawal: '0.0001',
 * //         maxWithdrawal: '10',
 * //         fee: '0.0005',
 * //         confirmations: 3,
 * //         status: 'ACTIVE'
 * //       },
 * //       LIGHTNING: {
 * //         minWithdrawal: '0.00001',
 * //         maxWithdrawal: '0.1',
 * //         fee: '0.0001',
 * //         confirmations: 1,
 * //         status: 'ACTIVE'
 * //       }
 * //     },
 * //     dailyLimit: '50',
 * //     requires2FA: true
 * //   },
 * //   ETH: {
 * //     networks: {
 * //       ETHEREUM: {
 * //         minWithdrawal: '0.01',
 * //         maxWithdrawal: '100',
 * //         fee: '0.005',
 * //         confirmations: 12,
 * //         status: 'ACTIVE'
 * //       }
 * //     },
 * //     dailyLimit: '200',
 * //     requires2FA: true
 * //   },
 * //   ...additional currencies
 * // }
 */
const getCurrencyWdInfo = async () => {
    try {
        const path = `${process.env.END_CUR_CONFIG}`;
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

module.exports = { getCurrencyWdInfo }
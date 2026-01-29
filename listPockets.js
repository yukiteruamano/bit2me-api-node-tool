/**
 * Bit2Me Pocket Listing Module
 *
 * This script lists all available pockets/wallets for a Bit2Me account.
 * It provides a comprehensive view of all cryptocurrency wallets.
 *
 * @module listPockets
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_POCKET;

const args = process.argv.slice(2);
const CURRENCY = args[0];
const SUBACCOUNT = args[1];

/**
 * Lists all pockets/wallets for an account
 *
 * This function retrieves and displays all cryptocurrency pockets.
 * It can filter by specific currency if provided.
 *
 * @async
 * @function listPockets
 * @param {string} [currency] - Optional currency filter
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Array>} Array of pocket objects
 *
 * @example
 * // List all pockets for main account
 * const allPockets = await listPockets();
 *
 * @example
 * // List Bitcoin pockets only
 * const btcPockets = await listPockets('BTC');
 *
 * @example
 * // List pockets for subaccount
 * const subPockets = await listPockets(null, 'subaccount-123');
 */
const listPockets = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT, SUBACCOUNT)
        );

        // Filter by currency if specified
        const pockets = CURRENCY
            ? response.data.filter(pocket => pocket.currency === CURRENCY)
            : response.data;

        console.log(`Pockets ${CURRENCY ? `for ${CURRENCY}` : 'List'}:`);
        console.log(`Total: ${pockets.length} pockets`);

        pockets.forEach((pocket, index) => {
            console.log(`\n${index + 1}. ${pocket.name} (${pocket.currency})`);
            console.log(`   ID: ${pocket.id}`);
            console.log(`   Balance: ${pocket.balance} ${pocket.currency}`);
            console.log(`   Available: ${pocket.available} ${pocket.currency}`);
            console.log(`   Status: ${pocket.status}`);
        });

        return pockets;
    } catch (error) {
        console.error('Error listing pockets:', error.response?.data || error.message);
    }
};

// Execute listPockets if run directly
if (require.main === module) {
    listPockets();
}

module.exports = { listPockets };
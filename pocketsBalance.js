/**
 * Bit2Me Pocket Balance Module
 *
 * This script calculates and displays the balance across all pockets/wallets.
 * It provides a comprehensive view of the user's cryptocurrency holdings.
 *
 * @module pocketsBalance
 * @author Bit2Me
 */
const { getPocket } = require('./utils/getPocket');

const args = process.argv.slice(2);
const CURRENCY = args[0];
const SUBACCOUNT = args[1];

/**
 * Calculates the total balance from pocket data
 *
 * This helper function sums up the available balances from all pockets
 * to provide a total balance figure.
 *
 * @function calcBalance
 * @param {Array} pockets - Array of pocket objects
 * @returns {number} Total balance across all pockets
 */
const calcBalance = (pockets) => {
    return pockets.reduce((total, pocket) => {
        return total + parseFloat(pocket.available);
    }, 0);
};

/**
 * Retrieves and displays pocket balances
 *
 * This function fetches pocket information and calculates the total balance.
 * It can filter by specific currency if provided.
 *
 * @async
 * @function pocketsBalance
 * @param {string} [currency] - Optional currency filter
 * @param {string} [subaccount] - Optional subaccount ID
 */
const pocketsBalance = async () => {
    try {
        // Get pockets, filtered by currency if specified
        const pockets = await getPocket(CURRENCY, SUBACCOUNT);

        if (!pockets || pockets.length === 0) {
            console.log('No pockets found');
            return;
        }

        // Calculate total balance
        const totalBalance = calcBalance(pockets);

        // Display detailed balance information
        console.log(`Total balance: ${totalBalance} ${CURRENCY || 'across all currencies'}`);

        // Show individual pocket balances
        pockets.forEach(pocket => {
            console.log(`- ${pocket.name} (${pocket.currency}): ${pocket.available} available`);
        });

    } catch (error) {
        console.error('Error retrieving balance:', error.message);
    }
};

// Execute pocketsBalance if run directly
if (require.main === module) {
    pocketsBalance();
}

module.exports = { pocketsBalance };
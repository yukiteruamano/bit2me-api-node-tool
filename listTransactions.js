/**
 * Bit2Me Transaction Listing Module
 *
 * This script lists all transactions for a Bit2Me account.
 * It provides a comprehensive transaction history with filtering options.
 *
 * @module listTransactions
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_TX;

const args = process.argv.slice(2);
const SUBACCOUNT = args[0];

/**
 * Lists all transactions for an account
 *
 * This function retrieves and displays the complete transaction history.
 * It supports filtering by subaccount if provided.
 *
 * @async
 * @function listTransactions
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Array>} Array of transaction objects
 *
 * @example
 * // List all transactions for main account
 * const transactions = await listTransactions();
 *
 * @example
 * // List transactions for subaccount
 * const subTransactions = await listTransactions('subaccount-123');
 */
const listTransactions = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT, SUBACCOUNT)
        );

        const transactions = response.data;

        console.log(`Transaction History ${SUBACCOUNT ? `for Subaccount ${SUBACCOUNT}` : ''}:`);
        console.log(`Total: ${transactions.length} transactions`);

        transactions.forEach((tx, index) => {
            console.log(`\n${index + 1}. Transaction #${tx.id}`);
            console.log(`   Type: ${tx.type}`);
            console.log(`   Status: ${tx.status}`);
            console.log(`   Amount: ${tx.amount} ${tx.currency}`);
            console.log(`   Fee: ${tx.fee || '0'} ${tx.currency}`);
            console.log(`   Created: ${new Date(tx.createdAt).toLocaleString()}`);
            console.log(`   Updated: ${new Date(tx.updatedAt).toLocaleString()}`);
        });

        return transactions;
    } catch (error) {
        console.error('Error listing transactions:', error.response?.data || error.message);
    }
};

// Execute listTransactions if run directly
if (require.main === module) {
    listTransactions();
}

module.exports = { listTransactions };
/**
 * Bit2Me Transaction Retrieval Module
 *
 * This script retrieves detailed information about specific transactions.
 * Users can get comprehensive data about their transaction history.
 *
 * @module getTransaction
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_TX;

const args = process.argv.slice(2);

if(args.length < 1){
    console.error("Usage: npm run read-tx <tx-id> [subaccount-id]");
    process.exit(1);
}

const TX_ID = args[0];
const SUBACCOUNT = args[1];

/**
 * Retrieves detailed information about a specific transaction
 *
 * This function fetches comprehensive transaction data including
 * status, amounts, fees, timestamps, and other metadata.
 *
 * @async
 * @function getTransaction
 * @param {string} txId - Transaction ID to retrieve
 * @param {string} [subaccount] - Optional subaccount ID
 */
const getTransaction = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}/${TX_ID}`,
            getAuthHeaders(`${ENDPOINT}/${TX_ID}`, SUBACCOUNT)
        );

        console.log(response.data);
    } catch (error) {
        console.error('Error fetching transaction:', error.response?.data || error.message);
    }
};

// Execute getTransaction if run directly
if (require.main === module) {
    getTransaction();
}

module.exports = { getTransaction };
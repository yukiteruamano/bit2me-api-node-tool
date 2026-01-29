/**
 * Bit2Me List Earn Wallets Module
 *
 * This script retrieves the list of Earn wallets for the authenticated user.
 *
 * @module listEarnWallets
 * @author Bit2Me
 * @dev Get Earn wallets in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_EARN_WALLET || "/v1/earn/wallet";

/**
 * Retrieves Earn wallets
 *
 * This function sends a request to the Bit2Me API to get the list of Earn wallets.
 *
 * @async
 * @function listEarnWallets
 * @returns {Promise<Array>} List of Earn wallets
 */
const listEarnWallets = async () => {
    try {
        console.log("Fetching Earn Wallets...");
        // Send earn wallets request
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );

        console.log("Earn Wallets:");
        const wallets = response.data;
        
        if (Array.isArray(wallets)) {
            console.log(`Total: ${wallets.length} wallets`);
            wallets.forEach((wallet, index) => {
                console.log(`\n${index + 1}. Wallet ID: ${wallet.id}`);
                console.log(`   Currency: ${wallet.currency}`);
                console.log(`   Balance: ${wallet.balance} ${wallet.currency}`);
                console.log(`   APY: ${wallet.apy}%`);
            });
        } else {
            console.log(wallets);
        }

        return wallets;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute listEarnWallets if run directly
if (require.main === module) {
    listEarnWallets();
}

module.exports = { listEarnWallets };

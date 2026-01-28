/**
 * Bit2Me Pocket Creation Module
 *
 * This script creates new cryptocurrency wallets (pockets) for specific currencies.
 * Pockets allow users to store and manage different cryptocurrencies separately.
 *
 * @module createPocket
 * @author Bit2Me
 * @dev Create pocket in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_POCKET;

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run create-pocket <currency> <name> [subaccount-id]")
    process.exit(1);
}

const CURRENCY = args[0];
const POCKET_NAME = args[1];
const SUBACCOUNT = args[2];

/**
 * Creates a new cryptocurrency pocket/wallet
 *
 * This function sends a request to the Bit2Me API to create a new pocket
 * for the specified cryptocurrency with the given name.
 *
 * @async
 * @function createPocket
 * @param {string} currency - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
 * @param {string} name - Name for the new pocket
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} Pocket creation response
 *
 * @example
 * // Create Bitcoin pocket for main account
 * await createPocket('BTC', 'My Bitcoin Wallet');
 *
 * @example
 * // Create Ethereum pocket for subaccount
 * await createPocket('ETH', 'Ethereum Savings', 'subaccount-123');
 */
const createPocket = async () => {
    try {
        // Prepare request body with currency and pocket name
        const body = {
            'currency': CURRENCY,
            'name': POCKET_NAME
        };

        // Send pocket creation request
        const response = await axios.post(
            `${process.env.SERVER}${PATH}`,
            body,
            getAuthHeaders(PATH, SUBACCOUNT, body)
        );

        console.log(response.data);
        return response.data;
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

// Execute pocket creation
createPocket();
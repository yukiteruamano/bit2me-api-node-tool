/**
 * Bit2Me Crypto Sales Module
 *
 * This script allows users to sell cryptocurrency for EUR.
 * The process involves converting crypto assets to fiat currency.
 *
 * @module sell
 * @author Bit2Me
 * @dev Sell crypto in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { getPocket } = require('./utils/getPocket');
const { getTx } = require('./utils/getTx');

const PROFORMA_PATH = process.env.END_W_PROFORMA;
const EXECUTE_PROFORMA_PATH = process.env.END_WALLET_TX;

const args = process.argv.slice(2);

if(args.length < 2){
    console.error("Usage: npm run sell <amount> <crypto> [subaccount-id]");
    process.exit(1);
}

const FIATCURRENCY = "EUR"
const AMOUNT = args[0];
const CRYPTO = args[1];
const SUBACCOUNT = args[2];

/**
 * Retrieves the source (crypto) and destination (EUR) pockets for the sell operation
 *
 * @returns {Promise<Array>} Array containing [cryptoPocketId, fiatPocketId]
 * @throws {Error} If required pockets don't exist
 */
const retrievePockets = async () => {
    const cryptoPockets = await getPocket(CRYPTO, SUBACCOUNT);
    const fiatPockets = await getPocket(FIATCURRENCY, SUBACCOUNT);

    if(cryptoPockets.length == 0){
        console.error(`No ${CRYPTO} pockets, please use npm run create-pocket ${CRYPTO} <name> [subaccount-id]`)
        process.exit(1);
    }

    if(fiatPockets.length == 0){
        console.error(`No ${FIATCURRENCY} pockets, please use npm run create-pocket ${FIATCURRENCY} <name> [subaccount-id]`)
        process.exit(1);
    }

    return [cryptoPockets[0].id, fiatPockets[0].id]
}

/**
 * Executes a cryptocurrency sale
 *
 * This function handles the complete sell process:
 * 1. Retrieves source (crypto) and destination (EUR) pockets
 * 2. Creates a proforma order
 * 3. Executes the order
 * 4. Returns transaction details
 *
 * @async
 * @function sell
 */
const sell = async () => {
    const [origin, destination] = await retrievePockets();

    // Build proforma request body for selling crypto
    let proformaBody = {
        "pocket": origin,
        "destination": {
            "pocket": destination,
        },
        "amount": AMOUNT,
        "currency": CRYPTO
    };

    try{
        // Step 1: Create proforma order
        const proformaResponse = await axios.post(
            `${process.env.SERVER}${PROFORMA_PATH}`,
            proformaBody,
            getAuthHeaders(PROFORMA_PATH, SUBACCOUNT, proformaBody)
        );

        if(proformaResponse.data){
            const orderId = proformaResponse.data.id;
            const execBody = {
                "proforma": orderId
            }

            // Step 2: Execute the order
            const response = await axios.post(
                `${process.env.SERVER}${EXECUTE_PROFORMA_PATH}`,
                execBody,
                getAuthHeaders(EXECUTE_PROFORMA_PATH, SUBACCOUNT, execBody)
            );

            if (response.data) {
                // Step 3: Display transaction details
                console.log(await getTx(response.data.id, SUBACCOUNT))
            }
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

// Execute the sell operation
sell()
/**
 * Bit2Me EUR Deposit Module
 *
 * This script provides bank account information for EUR deposits via bank transfer.
 * It handles the complete EUR deposit process including bank account details
 * and transaction monitoring via WebSocket.
 *
 * @module depositEUR
 * @author Bit2Me
 * @dev Deposit EUR in Bit2Me (bank transfer)
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { openWss } = require('./bit2me_logic/ws');
const { getPocket } = require('./utils/getPocket');

const PROFORMA_PATH = process.env.END_TELLER_PROF;
const EXECUTE_PROFORMA_PATH = process.env.END_TELLER_EXEC;

const args = process.argv.slice(2);
const SUBACCOUNT = args[2];
const CURRENCY = "EUR";

/**
 * Handles EUR deposit process via bank transfer
 *
 * This function manages the complete EUR deposit workflow:
 * 1. Retrieves the EUR pocket/wallet
 * 2. Gets bank account information for deposits
 * 3. Monitors deposit completion via WebSocket
 * 4. Provides transaction confirmation
 *
 * @async
 * @function depositEUR
 * @param {string} [subaccount] - Optional subaccount ID
 */
const depositEUR = async () => {
    // Retrieve EUR pockets for the specified account
    const pockets = await getPocket(CURRENCY, SUBACCOUNT);

    if(pockets.length == 0){
        console.error(`No ${CURRENCY} pockets, please use npm run create-pocket ${CURRENCY} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;

    try{
        // Get pocket reference path for bank account information
        const path = `${process.env.END_POCKET_REF}/?pocketId=${pocket}`;

        // Retrieve bank account details for EUR deposits
        const response = await axios.get(
            `${process.env.SERVER}${path}`,
            getAuthHeaders(path, SUBACCOUNT)
        );

        if(response.data){
            console.log(`Now, you can make a secure bank transfer to deposit EUR.`);
            console.log(response.data.bankAccounts);
            console.log("Once the deposit has been received, the execution of this script will be cut off. In case your balance is not credited, please contact the Bit2Me team.");

            // Monitor deposit completion via WebSocket
            const successMessage = await openWss(process.env.WS_EUR_DEPOSIT);
            console.log("Transaction successful:", successMessage);
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

// Execute depositEUR if run directly
if (require.main === module) {
    depositEUR();
}

module.exports = { depositEUR };
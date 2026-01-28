/**
 * Bit2Me Social Pay Module
 *
 * This script enables cryptocurrency transfers between Bit2Me users.
 * It allows users to send crypto to other Bit2Me accounts using their UUIDs.
 *
 * @module socialPay
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_SOCIAL_PAY;

const args = process.argv.slice(2);

if(args.length < 5){
    console.error("Usage: npm run pay <amount> <crypto> <alice> <bob> <alice-TOTP>");
    process.exit(1);
}

const AMOUNT = args[0];
const CRYPTO = args[1];
const ALICE = args[2];
const BOB = args[3];
const TOTP = args[4];

/**
 * Displays usage information for the social pay command
 *
 * This function shows how to use the social pay feature with all required parameters.
 */
const usage = () => {
    console.log(`
Bit2Me Social Pay - Transfer cryptocurrency between users

Usage: npm run pay <amount> <crypto> <alice> <bob> <alice-TOTP>

Parameters:
  <amount>     - Amount of cryptocurrency to transfer
  <crypto>     - Cryptocurrency symbol (e.g., BTC, ETH)
  <alice>      - Sender's UUID
  <bob>        - Recipient's UUID (must have an alias set)
  <alice-TOTP> - Sender's TOTP code for 2FA

Example:
  npm run pay 0.01 ETH 9fb38ddd-3b09-4823-9a2e-668e9bc96964 4512ec8e-f269-4b62-aeea-c64041865b83 123456

Note: The recipient (bob) must have an alias set using: npm run set-alias <alias> <bob>
    `);
};

/**
 * Executes a social pay transfer between Bit2Me users
 *
 * This function handles the complete transfer process including:
 * 1. Validating parameters
 * 2. Creating the transfer request
 * 3. Executing the transfer with 2FA
 * 4. Returning transaction details
 *
 * @async
 * @function socialPay
 * @param {string} amount - Amount to transfer
 * @param {string} crypto - Cryptocurrency symbol
 * @param {string} alice - Sender's UUID
 * @param {string} bob - Recipient's UUID
 * @param {string} totp - Sender's TOTP code
 */
const socialPay = async () => {
    try {
        // Prepare transfer request body
        const body = {
            "amount": AMOUNT,
            "currency": CRYPTO,
            "alice": ALICE,
            "bob": BOB,
            "totp": TOTP
        };

        // Execute the social pay transfer
        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT, "", body)
        );

        console.log("Social pay transfer successful:");
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error('Social pay error:', error.response?.data || error.message);
        console.log("\nPossible issues:");
        console.log("- Recipient doesn't have an alias set");
        console.log("- Invalid TOTP code");
        console.log("- Insufficient funds");
        console.log("- Invalid UUIDs");
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
};

// Execute social pay transfer
socialPay();
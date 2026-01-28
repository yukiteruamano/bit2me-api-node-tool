/**
 * Bit2Me EUR Withdrawal Module
 *
 * This script handles EUR withdrawals from Bit2Me accounts to bank accounts.
 * It supports fiat currency withdrawals with 2FA verification.
 *
 * @module withdrawEUR
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_WITHDRAW_EUR;

const args = process.argv.slice(2);

if(args.length < 2){
    console.error("Usage: npm run wd-fiat <amount> <TOTP> [subaccount-id]");
    process.exit(1);
}

const AMOUNT = args[0];
const TOTP = args[1];
const SUBACCOUNT = args[2];

/**
 * Executes EUR withdrawal to bank account
 *
 * This function handles the complete EUR withdrawal process:
 * 1. Validates withdrawal parameters
 * 2. Creates withdrawal request with 2FA verification
 * 3. Executes the withdrawal to registered bank account
 * 4. Returns transaction confirmation
 *
 * @async
 * @function withdrawEUR
 * @param {string} amount - Amount to withdraw in EUR
 * @param {string} totp - TOTP code for 2FA verification
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} Withdrawal transaction response
 *
 * @example
 * // Withdraw EUR to bank account
 * const result = await withdrawEUR('1000', '123456');
 *
 * @example
 * // Withdraw EUR from subaccount
 * const subResult = await withdrawEUR('500', '654321', 'subaccount-123');
 */
const withdrawEUR = async () => {
    try {
        // Prepare withdrawal request body
        const body = {
            "amount": AMOUNT,
            "totp": TOTP
        };

        // Execute withdrawal request
        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT, SUBACCOUNT, body)
        );

        console.log("EUR withdrawal successful:");
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error('Withdrawal error:', error.response?.data || error.message);
        console.log("\nPossible issues:");
        console.log("- Invalid or insufficient TOTP code");
        console.log("- Insufficient funds");
        console.log("- Bank account not registered");
        console.log("- Withdrawal limits exceeded");
        console.log("- Daily withdrawal limit reached");
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
};

// Execute EUR withdrawal
withdrawEUR();
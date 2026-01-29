/**
 * Bit2Me Cryptocurrency Withdrawal Module
 *
 * This script handles cryptocurrency withdrawals from Bit2Me wallets.
 * It supports withdrawals to external blockchain addresses with 2FA verification.
 *
 * @module withdrawCrypto
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_WITHDRAW_CRYPTO;

const args = process.argv.slice(2);

if(args.length < 5){
    console.error("Usage: npm run wd-crypto <amount> <crypto> <network> <address> <TOTP> [subaccount-id]");
    process.exit(1);
}

const AMOUNT = args[0];
const CRYPTO = args[1];
const NETWORK = args[2];
const ADDRESS = args[3];
const TOTP = args[4];
const SUBACCOUNT = args[5];

/**
 * Executes cryptocurrency withdrawal to external address
 *
 * This function handles the complete withdrawal process:
 * 1. Validates withdrawal parameters
 * 2. Creates withdrawal request with 2FA verification
 * 3. Executes the withdrawal
 * 4. Returns transaction confirmation
 *
 * @async
 * @function withdrawCrypto
 * @param {string} amount - Amount to withdraw
 * @param {string} crypto - Cryptocurrency symbol
 * @param {string} network - Blockchain network
 * @param {string} address - Destination blockchain address
 * @param {string} totp - TOTP code for 2FA verification
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} Withdrawal transaction response
 *
 * @example
 * // Withdraw Bitcoin to external address
 * const result = await withdrawCrypto(
 *   '0.01', 'BTC', 'BITCOIN',
 *   '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
 *   '123456'
 * );
 *
 * @example
 * // Withdraw Ethereum from subaccount
 * const subResult = await withdrawCrypto(
 *   '0.1', 'ETH', 'ETHEREUM',
 *   '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
 *   '654321', 'subaccount-123'
 * );
 */
const withdrawCrypto = async () => {
    try {
        // Prepare withdrawal request body
        const body = {
            "amount": AMOUNT,
            "currency": CRYPTO,
            "network": NETWORK,
            "address": ADDRESS,
            "totp": TOTP
        };

        // Execute withdrawal request
        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT, SUBACCOUNT, body)
        );

        console.log("Cryptocurrency withdrawal successful:");
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error('Withdrawal error:', error.response?.data || error.message);
        console.log("\nPossible issues:");
        console.log("- Invalid or insufficient TOTP code");
        console.log("- Insufficient funds");
        console.log("- Invalid destination address");
        console.log("- Network not supported for this currency");
        console.log("- Withdrawal limits exceeded");
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
};

// Execute withdrawCrypto if run directly
if (require.main === module) {
    withdrawCrypto();
}

module.exports = { withdrawCrypto };
/**
 * Bit2Me Alias Management Module
 *
 * This script sets aliases for Bit2Me accounts. Aliases are used for
 * social pay transfers and other account identification purposes.
 *
 * @module setAlias
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_ALIAS;

const args = process.argv.slice(2);

if(args.length < 1){
    console.error("Usage: npm run set-alias <alias> [subaccount-id]");
    process.exit(1);
}

const ALIAS = args[0];
const SUBACCOUNT = args[1];

/**
 * Sets an alias for a Bit2Me account
 *
 * This function assigns an alias to either the main account or a subaccount.
 * Aliases are required for receiving social pay transfers and other operations.
 *
 * @async
 * @function setAlias
 * @param {string} alias - The alias to set (e.g., 'john.doe', 'crypto-trader')
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} Alias setting response
 *
 * @example
 * // Set alias for main account
 * const result = await setAlias('john.doe');
 *
 * @example
 * // Set alias for subaccount
 * const subResult = await setAlias('trading-bot', 'subaccount-123');
 *
 * @example
 * // Response structure:
 * // {
 * //   success: true,
 * //   alias: 'john.doe',
 * //   accountId: 'account-id'
 * // }
 */
const setAlias = async () => {
    try {
        const body = {
            "alias": ALIAS
        };

        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT, SUBACCOUNT, body)
        );

        console.log("Alias set successfully:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error setting alias:', error.response?.data || error.message);
        console.log("\nNote: Aliases must be unique and follow Bit2Me's naming conventions.");
    }
};

// Execute alias setting
setAlias();
/**
 * Bit2Me Account Information Module
 *
 * This script retrieves detailed account information for Bit2Me users.
 * It provides comprehensive data about user accounts and their configuration.
 *
 * @module readAccount
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_ACCOUNT;

const args = process.argv.slice(2);
const SUBACCOUNT = args[0];

/**
 * Retrieves detailed account information
 *
 * This function fetches comprehensive account data from the Bit2Me API.
 * It can retrieve information for either the main account or a specific subaccount.
 *
 * @async
 * @function readAccount
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} Account information object
 *
 * @example
 * // Get main account information
 * const mainAccount = await readAccount();
 *
 * @example
 * // Get subaccount information
 * const subAccount = await readAccount('subaccount-123');
 *
 * @example
 * // Response structure:
 * // {
 * //   id: 'account-id',
 * //   name: 'John',
 * //   surname: 'Doe',
 * //   email: 'john@example.com',
 * //   phone: '+34123456789',
 * //   country: 'ES',
 * //   language: 'es',
 * //   alias: 'john-doe',
 * //   status: 'VERIFIED',
 * //   createdAt: '2023-01-01T00:00:00Z',
 * //   ...additional account details
 * // }
 */
const readAccount = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT, SUBACCOUNT)
        );

        console.log("Account Information:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error reading account:', error.response?.data || error.message);
    }
};

// Execute readAccount if run directly
if (require.main === module) {
    readAccount();
}

module.exports = { readAccount };
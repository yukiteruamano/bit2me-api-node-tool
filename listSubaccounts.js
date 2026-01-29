/**
 * Bit2Me Subaccount Listing Module
 *
 * This script lists all subaccounts associated with a Bit2Me main account.
 * It provides a comprehensive view of all subaccounts and their status.
 *
 * @module listSubaccounts
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_SUBACCOUNT || "/v1/account/subaccount";

/**
 * Lists all subaccounts for the main account
 *
 * This function retrieves and displays all subaccounts associated
 * with the main Bit2Me account, including their details and status.
 *
 * @async
 * @function listSubaccounts
 * @returns {Promise<Array>} Array of subaccount objects
 *
 * @example
 * // List all subaccounts
 * const subaccounts = await listSubaccounts();
 *
 * @example
 * // Response structure:
 * // [
 * //   {
 * //     id: 'subaccount-123',
 * //     name: 'Trading Account',
 * //     alias: 'trader',
 * //     email: 'trading@example.com',
 * //     status: 'ACTIVE',
 * //     createdAt: '2023-01-01T00:00:00Z',
 * //     ...additional subaccount details
 * //   },
 * //   ...
 * // ]
 */
const listSubaccounts = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT)
        );

        const subaccounts = response.data.data || [];

        console.log("Subaccounts List:");
        console.log(`Total: ${subaccounts.length} subaccounts`);

        subaccounts.forEach((subaccount, index) => {
            console.log(`\n${index + 1}. ${subaccount.alias || subaccount.name || subaccount.id}`);
            console.log(`   ID: ${subaccount.id}`);
            console.log(`   Email: ${subaccount.email || 'Not set'}`);
            console.log(`   Status: ${subaccount.state === 1 ? 'ACTIVE' : 'INACTIVE'} (State: ${subaccount.state})`);
            console.log(`   Created: ${new Date(subaccount.createdAt).toLocaleString()}`);
        });

        return subaccounts;
    } catch (error) {
        console.error('Error listing subaccounts:', error.response?.data || error.message);
        throw error;
    }
};

// Execute subaccount listing if run directly
if (require.main === module) {
    listSubaccounts();
}

module.exports = { listSubaccounts };
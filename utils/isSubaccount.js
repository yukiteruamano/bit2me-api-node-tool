/**
 * Bit2Me Subaccount Verification Utility
 *
 * This utility module provides functions for verifying whether an account
 * is a subaccount within the Bit2Me platform.
 *
 * @module isSubaccount
 * @author Bit2Me
 * @dev Checks if account is subaccount
 */
const { getUser } = require('./getUser');

/**
 * Checks if an account is a subaccount
 *
 * This function verifies whether the specified account ID belongs to a subaccount
 * by attempting to retrieve the email field from the account data.
 *
 * @async
 * @function isSubaccount
 * @param {string} account - Account ID to check
 * @returns {Promise<boolean>} True if the account is a subaccount, false otherwise
 *
 * @example
 * // Check if account is a subaccount
 * const result = await isSubaccount('account-id-123');
 * if (result) {
 *   console.log('This is a subaccount');
 * } else {
 *   console.log('This is the main account');
 * }
 *
 * @example
 * // Use in conditional logic
 * if (await isSubaccount('some-account-id')) {
 *   // Handle subaccount case
 * } else {
 *   // Handle main account case
 * }
 */
const isSubaccount = async (account) => {
    try {
        // Attempt to get email field - if successful, it's a valid subaccount
        return !!(await getUser("email", account));
    } catch {
        // Return undefined if there's an error (account doesn't exist or other issue)
        return;
    }
}

module.exports = { isSubaccount }
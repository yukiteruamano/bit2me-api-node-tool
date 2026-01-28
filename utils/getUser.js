/**
 * Bit2Me User Information Utility
 *
 * This utility module provides functions for retrieving user account
 * information from the Bit2Me platform.
 *
 * @module getUser
 * @author Bit2Me
 * @dev Get user details Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_ACCOUNT;

/**
 * Retrieves user account information
 *
 * This function fetches user data from the Bit2Me API and can return
 * either the complete user object or specific fields if requested.
 *
 * @async
 * @function getUser
 * @param {string} [data] - Optional specific data field to retrieve
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<*>} User data object or specific field value
 *
 * @example
 * // Get complete user information
 * const user = await getUser();
 *
 * @example
 * // Get specific field (e.g., email)
 * const email = await getUser('email');
 *
 * @example
 * // Get user info for subaccount
 * const subUser = await getUser(null, 'subaccount-123');
 *
 * @example
 * // Response structure (complete user):
 * // {
 * //   id: 'user-id',
 * //   name: 'John',
 * //   surname: 'Doe',
 * //   email: 'john@example.com',
 * //   phone: '+34123456789',
 * //   country: 'ES',
 * //   language: 'es',
 * //   alias: 'john-doe',
 * //   ...additional user details
 * // }
 */
const getUser = async (data, subaccount) => {
    try {
        const response = await axios.get(`${process.env.SERVER}${PATH}`, getAuthHeaders(PATH, subaccount));

        // Return specific field if requested, otherwise return complete user object
        return (data) ? response.data[data] : response.data;
    } catch {
        return;
    }
}

module.exports = { getUser }
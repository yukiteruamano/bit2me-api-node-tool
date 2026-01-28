/**
 * Bit2Me Subaccount Creation Module
 *
 * This script creates new subaccounts within the Bit2Me platform.
 * Subaccounts allow users to manage multiple accounts under one main account.
 *
 * @module createSubaccount
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_CREATE_SUBACCOUNT;

/**
 * Creates a new subaccount
 *
 * This function sends a request to the Bit2Me API to create a subaccount
 * with the specified configuration.
 *
 * @async
 * @function createSubaccount
 * @returns {Promise<Object>} Subaccount creation response containing userId
 *
 * @example
 * // Response example: { userId: 'subaccount-id' }
 */
const createSubaccount = async () => {
    // Configuration for the new subaccount
    const body = {
        "alias": "subaccount-alias",
        "name": "Subaccount Name",
        "surname": "Subaccount Surname",
        "email": "subaccount@example.com",
        "phone": "+34123456789",
        "country": "ES",
        "language": "es"
    };

    try {
        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT)
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating subaccount:', error.response?.data || error.message);
        throw error;
    }
};

// Execute subaccount creation
createSubaccount();
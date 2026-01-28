/**
 * Bit2Me Account Details Module
 *
 * This script retrieves account details for the authenticated user.
 *
 * @module accountDetails
 * @author Bit2Me
 * @dev Get account details in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_ACCOUNT || "/v1/account";

/**
 * Retrieves Bit2Me account details
 *
 * This function sends a request to the Bit2Me API to get the account profile information.
 *
 * @async
 * @function getAccountDetails
 * @returns {Promise<Object>} Account details response
 */
const getAccountDetails = async () => {
    try {
        // Send account details request
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );

        console.log(response.data);
        return response.data;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute account details retrieval
getAccountDetails();

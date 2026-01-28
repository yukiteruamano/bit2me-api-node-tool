/**
 * Bit2Me Identity Verification Status Module
 *
 * This script retrieves the identity verification status for the authenticated user.
 *
 * @module checkIdentityStatus
 * @author Bit2Me
 * @dev Get identity verification status in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_ID_ACCOUNT || "/v1/account/verify/identity";

/**
 * Retrieves Bit2Me identity verification status
 *
 * This function sends a request to the Bit2Me API to get the identity verification status.
 *
 * @async
 * @function checkIdentityStatus
 * @returns {Promise<Object>} Identity verification status response
 */
const checkIdentityStatus = async () => {
    try {
        // Send identity status request
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );

        console.log("Identity Verification Status:");
        console.log(response.data);
        return response.data;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute identity status check
checkIdentityStatus();

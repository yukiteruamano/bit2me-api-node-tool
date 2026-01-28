/**
 * Bit2Me Earn Summary Module
 *
 * This script retrieves the Earn summary for the authenticated user.
 *
 * @module showEarnSummary
 * @author Bit2Me
 * @dev Get Earn summary in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PATH = process.env.END_EARN_SUMMARY || "/v1/earn/summary";

/**
 * Retrieves Earn summary
 *
 * This function sends a request to the Bit2Me API to get the Earn summary.
 *
 * @async
 * @function showEarnSummary
 * @returns {Promise<Object>} Earn summary response
 */
const showEarnSummary = async () => {
    try {
        console.log("Fetching Earn Summary...");
        // Send earn summary request
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(PATH)
        );

        console.log("Earn Summary Data:");
        console.log(response.data);
        return response.data;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute earn summary retrieval
showEarnSummary();

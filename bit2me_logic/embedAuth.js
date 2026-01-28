/**
 * Bit2Me Embedded Authentication Module
 *
 * This module provides functions for generating authentication tokens
 * that can be used for embedded Bit2Me widgets and integrations.
 *
 * @module embedAuth
 * @author Bit2Me
 * @dev Resource to get embed token
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./utils');

const EMBED = process.env.END_EMBED;
const AUTH = process.env.END_AUTH;

/**
 * Retrieves an authentication token for API access
 *
 * This function generates an access token that can be used for authenticated
 * API requests. The token can be generated for either the main account or a subaccount.
 *
 * @async
 * @function getAuthToken
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<string|null>} Access token or null if request fails
 *
 * @example
 * // Get token for main account
 * const mainToken = await getAuthToken();
 *
 * @example
 * // Get token for subaccount
 * const subToken = await getAuthToken('subaccount-123');
 */
const getAuthToken = async (subaccount) => {
    // Prepare request body - include userId only if subaccount is specified
    const body = (subaccount) ? { 'userId': subaccount } : {};
    const config = getAuthHeaders(AUTH, "", body);

    const response = await axios.post(
        `${process.env.SERVER}${AUTH}`,
        body,
        config
    );

    // Return token if request was successful, otherwise return null
    return (response.status !== 200) ? null : response.data.accessToken.token;
}

/**
 * Retrieves an embed token for widget integration
 *
 * This function generates an embed token that can be used for integrating
 * Bit2Me widgets into third-party applications. Requires a valid access token.
 *
 * @async
 * @function getEmbedToken
 * @param {string} accessToken - Valid access token from getAuthToken()
 * @returns {Promise<string|null>} Embed token or null if request fails
 *
 * @example
 * const authToken = await getAuthToken();
 * const embedToken = await getEmbedToken(authToken);
 * // Use embedToken in widget initialization
 */
const getEmbedToken = async (accessToken) => {
    // Return null if no valid access token provided
    if(!accessToken) return null;

    const body = {
        "accessToken" : accessToken
    }
    const config = getAuthHeaders(EMBED, "", body);

    const response = await axios.post(
        `${process.env.SERVER}${EMBED}`,
        body,
        config
    );

    // Return embed token if request was successful, otherwise return null
    return (response.status !== 200) ? null : response.data.accessToken.token;
}

module.exports = { getEmbedToken, getAuthToken };
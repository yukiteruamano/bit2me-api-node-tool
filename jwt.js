/**
 * Bit2Me JWT Token Generation Module
 *
 * This script generates JSON Web Tokens (JWT) for authentication.
 * JWT tokens can be used for client-side authentication without exposing API keys.
 *
 * @module jwt
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_JWT;

const args = process.argv.slice(2);
const SUBACCOUNT = args[0];

/**
 * Generates a JWT token for authentication
 *
 * This function requests a JSON Web Token from the Bit2Me API that can be
 * used for authenticated requests. JWT tokens are particularly useful for
 * client-side applications where API keys should not be exposed.
 *
 * @async
 * @function getJWT
 * @param {string} [subaccount] - Optional subaccount ID
 * @returns {Promise<Object>} JWT token object
 *
 * @example
 * // Get JWT for main account
 * const token = await getJWT();
 * // Use in client: Authorization: Bearer ${token.jwt}
 *
 * @example
 * // Get JWT for subaccount
 * const subToken = await getJWT('subaccount-123');
 *
 * @example
 * // Response structure:
 * // {
 * //   jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 * //   exp: 1735689600, // Expiration timestamp
 * //   iat: 1704153600  // Issued at timestamp
 * // }
 */
const getJWT = async () => {
    try {
        const body = (SUBACCOUNT) ? { 'userId': SUBACCOUNT } : {};
        const config = getAuthHeaders(ENDPOINT, "", body);

        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            config
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error generating JWT:', error.response?.data || error.message);
        throw error;
    }
};

// Execute getJWT if run directly
if (require.main === module) {
    getJWT();
}

module.exports = { getJWT };
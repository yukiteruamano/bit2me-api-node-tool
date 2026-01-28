/**
 * Bit2Me API Authentication Utilities
 *
 * This module provides functions for generating authenticated API requests
 * to the Bit2Me cryptocurrency exchange platform.
 */
const { getMessageSignature } = require('./common');

/**
 * Creates the message string that needs to be signed for API authentication
 *
 * Formats the message according to Bit2Me API specifications:
 * - With body: "nonce:url:body"
 * - Without body: "nonce:url"
 *
 * @param {number} nonce - Timestamp for request uniqueness
 * @param {string} url - API endpoint URL/path
 * @param {Object} [body] - Optional request body
 * @returns {string} Formatted message string ready for signing
 *
 * @example
 * // With body
 * getClientMessageToSign(123456789, '/api/endpoint', { key: 'value' });
 * // Returns: "123456789:/api/endpoint:{"key":"value"}"
 *
 * @example
 * // Without body
 * getClientMessageToSign(123456789, '/api/endpoint');
 * // Returns: "123456789:/api/endpoint"
 */
const getClientMessageToSign = (nonce, url, body) => {
    const hasBody = !!body && Object.keys(body).length > 0;

    return hasBody
      ? `${nonce}:${url}:${JSON.stringify(body)}`
      : `${nonce}:${url}`;
};

/**
 * Generates authentication headers for Bit2Me API requests
 *
 * Creates all required headers including API key, signature, and nonce.
 * Automatically handles subaccount headers when provided.
 *
 * @param {string} path - API endpoint path
 * @param {string} [subaccount] - Optional subaccount ID
 * @param {Object} [body] - Optional request body
 * @returns {Object} Axios request configuration with authentication headers
 *
 * @example
 * const headers = getAuthHeaders('/api/balance', 'subaccount-123', { currency: 'BTC' });
 * // Returns: { headers: { 'x-api-key': '...', 'api-signature': '...', 'x-nonce': '...', 'x-subaccount-id': 'subaccount-123' } }
 */
const getAuthHeaders = (path, subaccount, body) => {
  const nonce = Date.now();
  const messageToSign = getClientMessageToSign(nonce, path, body);
  const signature = getMessageSignature(messageToSign, process.env.SECRET);

  const response = {
    headers: {
      'x-api-key': process.env.API_KEY,
      'api-signature': signature,
      'x-nonce': nonce
    }
  };

  if(subaccount) response.headers['x-subaccount-id'] = subaccount;

  return response;
};

module.exports = {
    getClientMessageToSign,
    getAuthHeaders
};

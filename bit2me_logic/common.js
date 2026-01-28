const crypto = require('crypto');

/**
 * Generates a cryptographic signature for Bit2Me API authentication
 *
 * This function implements a two-step signing process:
 * 1. First creates a SHA-256 hash of the message
 * 2. Then creates an HMAC-SHA-512 signature using the hash digest and secret
 *
 * @param {string} message - The message to be signed (typically a formatted string with nonce, URL, and payload)
 * @param {string} secret - The API secret key for signing
 * @returns {string} HMAC-SHA-512 signature encoded in base64 format
 *
 * @example
 * const signature = getMessageSignature("nonce:endpoint:payload", "api-secret-key");
 * // Returns base64 encoded HMAC signature
 */
const getMessageSignature = (message, secret) => {
    // Step 1: Create SHA-256 hash of the message
    const hash = new crypto.createHash('sha256');

    // Step 2: Create HMAC-SHA-512 using the secret and hash digest
    const hmac = new crypto.createHmac('sha512', secret);

    // Generate hash digest in binary format
    const hashDigest = hash.update(message).digest('binary');

    // Generate HMAC digest using the hash digest, then encode in base64
    const hmacDigest = hmac.update(hashDigest, 'binary').digest('base64');

    return hmacDigest;
};

/**
 * Generates a cryptographic signature for commerce operations
 *
 * This function creates an HMAC-SHA-256 signature for commerce-related API calls.
 * It's simpler than getMessageSignature as it only requires one HMAC operation.
 *
 * @param {Object} payload - The data payload to be signed (will be stringified)
 * @param {string} secret - The API secret key for signing
 * @returns {string} HMAC-SHA-256 signature encoded in hexadecimal format
 *
 * @example
 * const payload = { amount: 100, currency: 'EUR', orderId: '12345' };
 * const signature = commerceSignature(payload, "api-secret-key");
 * // Returns hex encoded HMAC signature
 */
const commerceSignature = (payload, secret) => crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

module.exports = {
  getMessageSignature,
  commerceSignature
};
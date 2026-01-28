/**
 * Bit2Me TOTP (2FA) Setup Module
 *
 * This script retrieves TOTP (Time-based One-Time Password) secrets for
 * setting up two-factor authentication on Bit2Me accounts.
 *
 * @module getTOTP
 * @author Bit2Me
 * @dev Get TOTP secret for 2FA setup
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_TOTP;

const args = process.argv.slice(2);

if(args.length < 1){
    console.error("Usage: npm run get-totp <subaccount-id>");
    process.exit(1);
}

const SUBACCOUNT = args[0];

/**
 * Retrieves TOTP secret for 2FA setup
 *
 * This function requests a TOTP secret from the Bit2Me API that can be
 * used to configure two-factor authentication in authenticator apps.
 *
 * @async
 * @function getTOTP
 * @param {string} subaccount - Subaccount ID for 2FA setup
 * @returns {Promise<Object>} TOTP secret object
 *
 * @example
 * // Get TOTP secret for subaccount
 * const totpSecret = await getTOTP('subaccount-123');
 *
 * @example
 * // Response structure:
 * // {
 * //   secret: 'JBSWY3DPEHPK3PXP', // TOTP secret key
 * //   uri: 'otpauth://totp/Bit2Me:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Bit2Me'
 * // }
 */
const getTOTP = async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT, SUBACCOUNT)
        );

        console.log("TOTP Setup Information:");
        console.log("1. Scan this QR code in your authenticator app:");
        console.log(response.data.uri);
        console.log("\n2. Or manually enter this secret:");
        console.log(response.data.secret);
        console.log("\n3. Use the generated codes to complete 2FA setup with:");
        console.log("   npm run set-2fa <subaccount-id> <TOTP_CODE>");

        return response.data;
    } catch (error) {
        console.error('Error retrieving TOTP secret:', error.response?.data || error.message);
        console.log("\nNote: For main account 2FA setup, please use the Bit2Me web interface.");
    }
};

// Execute TOTP retrieval
getTOTP();
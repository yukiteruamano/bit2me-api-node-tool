/**
 * Bit2Me Cryptocurrency Deposit Module
 *
 * This script generates deposit addresses for cryptocurrency deposits.
 * Users can deposit various cryptocurrencies to their Bit2Me wallets.
 *
 * @module depositCrypto
 * @author Bit2Me
 */
const axios = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils');

const ENDPOINT = process.env.END_DEPOSIT_CRYPTO;

const args = process.argv.slice(2);

if(args.length < 2){
    console.error("Usage: npm run deposit-crypto <crypto> <network> [subaccount-id]");
    process.exit(1);
}

const CRYPTO = args[0];
const NETWORK = args[1];
const SUBACCOUNT = args[2];

/**
 * Generates a cryptocurrency deposit address
 *
 * This function requests a deposit address from the Bit2Me API for the specified
 * cryptocurrency and network.
 *
 * @async
 * @function depositCrypto
 */
const depositCrypto = async () => {
    const body = {
        "currency": CRYPTO,
        "network": NETWORK
    };

    try {
        const response = await axios.post(
            `${process.env.SERVER}${ENDPOINT}`,
            body,
            getAuthHeaders(ENDPOINT, SUBACCOUNT, body)
        );

        console.log(response.data);
    } catch (error) {
        console.error('Error generating deposit address:', error.response?.data || error.message);
    }
};

// Execute deposit address generation
depositCrypto();
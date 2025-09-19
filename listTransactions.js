/**
 * @author Bit2Me
 * @dev Get transactions list from Bit2Me
 */

// Bit2me logic
const axios  = require('axios');
const { getAuthHeaders } = require('./bit2me_logic/utils')

const PATH = process.env.END_GET_WALLET_TX;

const args = process.argv.slice(2);
const SUBACCOUNT = args[0]

const listTransactions= async () => {
    try {
        const response = await axios.get(
            `${process.env.SERVER}${PATH}`,
            getAuthHeaders(`${PATH}`, SUBACCOUNT)
        );
        console.log(response.data);
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

listTransactions()
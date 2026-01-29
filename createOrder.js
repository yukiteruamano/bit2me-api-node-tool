/**
 * Bit2Me Create Order Module
 *
 * This script allows users to create orders using the Teller API.
 * It follows the Proforma -> Execute pattern.
 *
 * @module createOrder
 * @author Bit2Me
 * @dev Create order in Bit2Me via Teller API
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const PROFORMA_PATH = process.env.END_TELLER_PROF || "/v1/teller/order/proforma";
const EXECUTE_PATH = process.env.END_TELLER_EXEC || "/v1/teller/order";

const args = process.argv.slice(2);

if(args.length < 2){
    console.error("Usage: npm run create-order <amount> <currency> [subaccount-id]");
    process.exit(1);
}

const AMOUNT = args[0];
const CURRENCY = args[1];
const SUBACCOUNT = args[2];

/**
 * Creates and executes a Teller order
 *
 * This function handles the order process:
 * 1. Creates a proforma order
 * 2. Executes the order
 *
 * @async
 * @function createOrder
 */
const createOrder = async () => {
    // Build proforma request body
    // Note: The specific body structure depends on the order type (buy/sell/deposit/etc).
    // Based on the user request pointing to "Create Order", and typical Teller usage,
    // we need to know WHAT we are ordering.
    // However, the prompt linked to "createOrder" generally necessitates a body.
    // I will assume a basic structure compatible with generic orders or defaults,
    // but without more specifics on the *type* of order (buy/sell via teller),
    // I will construct a generic payload that matches the args.
    
    // WARNING: Teller API often requires 'paymentMethod', 'ipAddress', etc. for fiat.
    // This is a basic implementation based on provided context.
    
    let proformaBody = {
        "amount": AMOUNT,
        "currency": CURRENCY
    };

    try{
        console.log("Creating Proforma...");
        // Step 1: Create proforma order
        const proformaResponse = await axios.post(
            `${process.env.SERVER}${PROFORMA_PATH}`,
            proformaBody,
            getAuthHeaders(PROFORMA_PATH, SUBACCOUNT, proformaBody)
        );

        if(proformaResponse.data){
            console.log("Proforma created:", proformaResponse.data);
            const orderId = proformaResponse.data.id;
            const execBody = {
                "proforma": orderId
            }

            console.log("Executing Order...");
            // Step 2: Execute the order
            const response = await axios.post(
                `${process.env.SERVER}${EXECUTE_PATH}`,
                execBody,
                getAuthHeaders(EXECUTE_PATH, SUBACCOUNT, execBody)
            );

            console.log("Order Successful:");
            console.log(response.data);
            return response.data;
        }
    }catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}


// Execute createOrder if run directly
if (require.main === module) {
    createOrder();
}

module.exports = { createOrder };

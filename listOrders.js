/**
 * Bit2Me List Orders Module
 *
 * This script lists pending orders from the Teller API.
 *
 * @module listOrders
 * @author Bit2Me
 * @dev List pending orders in Bit2Me
 */
const axios = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils.js');

const ENDPOINT = process.env.END_TELLER_EXEC || "/v1/teller/order";

const args = process.argv.slice(2);
const SUBACCOUNT = args[0];

/**
 * Lists pending orders
 *
 * This function retrieves pending orders from the Teller API.
 *
 * @async
 * @function listOrders
 * @returns {Promise<Array>} Array of pending orders
 */
const listOrders = async () => {
    try {
        console.log("Fetching pending orders...");
        // Send list orders request
        const response = await axios.get(
            `${process.env.SERVER}${ENDPOINT}`,
            getAuthHeaders(ENDPOINT, SUBACCOUNT)
        );

        const orders = response.data;
        
        console.log("Pending Orders:");
        if (Array.isArray(orders)) {
            console.log(`Total: ${orders.length} orders`);
            orders.forEach((order, index) => {
                console.log(`\n${index + 1}. Order ID: ${order.id}`);
                console.log(`   Amount: ${order.amount} ${order.currency}`);
                console.log(`   Status: ${order.status}`);
                console.log(`   Created: ${order.createdAt}`);
            });
        } else {
            console.log(orders);
        }
        
        return orders;
    }
    catch(e) {
        console.error(e.response ? e.response.data : e.message);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
}

// Execute list orders
listOrders();

/**
 * Bit2Me WebSocket Client Module
 *
 * This module provides WebSocket connectivity for real-time communication
 * with the Bit2Me API. It handles authentication, message processing,
 * and automatic reconnection with exponential backoff.
 *
 * @module ws
 */
const { getEmbedToken, getAuthToken } = require('./embedAuth');
const WebSocket = require("ws")

/**
 * WebSocket connection instance
 * @type {WebSocket}
 */
let ws;

/**
 * Current reconnection interval in milliseconds
 * @type {number}
 */
let reconnectInterval = 1000; // 1 second

/**
 * Maximum reconnection interval in milliseconds
 * @type {number}
 */
let maxReconnectInterval = 30000; // 30 seconds

/**
 * Number of reconnection attempts
 * @type {number}
 */
let reconnectAttempts = 0;

/**
 * Opens a WebSocket connection to the Bit2Me API
 *
 * This function establishes a WebSocket connection, authenticates with the API,
 * and processes incoming messages. It automatically handles reconnection
 * with exponential backoff for robustness.
 *
 * @async
 * @function openWss
 * @param {string} [action="listen"] - Action type to listen for
 * @returns {Promise<string>} Resolves with the action type when received
 * @throws {Error} If WebSocket connection or authentication fails
 *
 * @example
 * // Connect and listen for specific message type
 * const result = await openWss('currency.rates');
 * console.log('Received:', result);
 */
const openWss = async (action = "listen") => {
    return new Promise((resolve, reject) => {
        // Close existing connection if any
        if(ws) ws.close();

        // Initialize new WebSocket connection
        ws = new WebSocket(process.env.WSS);

        /**
         * Error event handler
         * @param {Error} err - WebSocket error
         */
        ws.addEventListener('error', err => {
            console.error('websocket error:', err);
            reject(err);
        });

        /**
         * Connection open event handler
         * @async
         */
        ws.addEventListener('open', async () => {
            // Reset reconnection attempts on successful connection
            reconnectAttempts = 0;

            try {
                // Authenticate with the WebSocket server
                const auth = await getAuthToken();
                if(!auth) return;

                // Send authentication message
                ws.send(JSON.stringify({
                    type: 'authenticate',
                    payload: { token: auth }
                }));
            } catch(e) {
                console.error(e.response.data);
                reject(e);
            }
        });

        /**
         * Message event handler
         * @param {MessageEvent} message - WebSocket message event
         */
        ws.addEventListener('message', message => {
            const msg = JSON.parse(message.data);

            // Debug logging (commented out by default)
            // console.log(`websocket message: type: ${msg.type}, id: ${msg.id}, time: ${new Date().toLocaleString('es-ES', { timeZone: 'UTC' })} UTC`);
            // if(msg.type !== 'currency.rates' && msg.type !== 'earn-current-apys.change') {
            //     console.log(msg.payload)
            // }

            // Resolve promise when target action is received
            if(msg.type === action){
                ws.close();
                resolve(msg.type);
            }
        });

        /**
         * Connection close event handler
         * @param {CloseEvent} evt - WebSocket close event
         */
        ws.addEventListener('close', evt => {
            if (evt.code === 4000) {
                console.log(`Error while authenticating: ${evt.code}/${evt.reason}`);
                reject(new Error(`Authentication error: ${evt.reason}`));
            }
            else if (evt.code === 4001) {
                console.log(`Error rate limit: ${evt.code}/${evt.reason}`);
                handleReconnect(action);
            }
        });
    });
}

/**
 * Handles WebSocket reconnection with exponential backoff
 *
 * This function implements an exponential backoff strategy for reconnection,
 * doubling the reconnection interval up to the maximum limit.
 *
 * @function handleReconnect
 * @param {string} action - Action type to listen for after reconnection
 */
const handleReconnect = (action) => {
    reconnectAttempts++;
    ////TRACE: console.log(`trying to reconnect... (attempt ${reconnectAttempts})`);

    // Apply exponential backoff with maximum limit
    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);

    // Schedule reconnection attempt
    setTimeout(() => {
        openWss(action);
    }, reconnectInterval);
}

module.exports = { openWss }
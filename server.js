/**
 * Bit2Me Visualization Server
 *
 * Serves static HTML/JS for ticker visualization and exposes API endpoint.
 */
const express = require('express');
const app = express();
const path = require('path');
const { getTickerInfo } = require('./getTickerInfo.js');
const { getAccountDetails } = require('./accountDetails.js');
const { getEarnSummary } = require('./showEarnSummary.js');
const { checkIdentityStatus } = require('./checkIdentityStatus.js');
const { listSubaccounts } = require('./listSubaccounts.js');
const { getMarketOverview } = require('./getMarketOverview.js');
const http = require('http');
const { Server } = require('ws');

const PORT = 3000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    clients.add(ws);
    
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

// Broadcast helper
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
            client.send(message);
        }
    });
}

// Background Task: Update market data every 60 seconds
setInterval(async () => {
    try {
        console.log('Background update: Fetching market overview...');
        const data = await getMarketOverview();
        broadcast({ type: 'market-update', data });
    } catch (e) {
        console.error('Background update failed:', e.message);
    }
}, 60000); // 60 seconds

// Serve static files from html-test directory
app.use(express.static(path.join(__dirname, 'html-test')));

// API Endpoint to get ticker info
app.get('/api/ticker', async (req, res) => {
    const market = req.query.market;
    if (!market) {
        return res.status(400).json({ error: 'Market query parameter required' });
    }

    try {
        console.log(`API request for ${market}`);
        const data = await getTickerInfo(market);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ticker info' });
    }
});

// API Endpoint to get account details
app.get('/api/account', async (req, res) => {
    try {
        console.log('API request for account details');
        const data = await getAccountDetails();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch account details' });
    }
});

// API Endpoint to get earn summary
app.get('/api/earn/summary', async (req, res) => {
    try {
        console.log('API request for earn summary');
        const data = await getEarnSummary();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch earn summary' });
    }
});

// API Endpoint to get identity status
app.get('/api/identity', async (req, res) => {
    try {
        console.log('API request for identity status');
        const data = await checkIdentityStatus();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch identity status' });
    }
});

// API Endpoint to get subaccounts
app.get('/api/subaccounts', async (req, res) => {
    try {
        console.log('API request for subaccounts');
        const data = await listSubaccounts();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subaccounts' });
    }
});

// API Endpoint to get market overview
app.get('/api/market/overview', async (req, res) => {
    try {
        console.log('API request for market overview');
        const data = await getMarketOverview();
        res.json(data);
    } catch (error) {
        console.error('Market overview error:', error.message);
        res.status(500).json({ error: 'Failed to fetch market overview' });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/tickerInfo.html in your browser`);
});

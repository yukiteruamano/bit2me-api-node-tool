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

const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/tickerInfo.html in your browser`);
});

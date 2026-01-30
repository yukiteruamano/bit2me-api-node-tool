
let socket;

// Initialize WebSocket on page load
window.onload = () => {
    setupWebSocket();
};

function setupWebSocket() {
    // Determine the WS protocol based on the current page protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    console.log(`Connecting to WebSocket: ${wsUrl}`);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'market-update') {
            console.log('Received market update via WebSocket');
            renderMarket(msg.data);
        }
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected. Retrying in 5s...');
        setTimeout(setupWebSocket, 5000);
    };

    socket.onerror = (err) => {
        console.error('WebSocket error:', err);
    };
}

function switchView(viewName) {
    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Find the button that was clicked or matching button
    const activeBtn = event && event.currentTarget ? event.currentTarget : [...document.querySelectorAll('.nav-btn')].find(btn => btn.onclick.toString().includes(viewName));
    if (activeBtn) activeBtn.classList.add('active');

    // Update views
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');

    // Hide messages
    document.getElementById('errorMsg').style.display = 'none';

    // Auto-fetch data if needed
    if (viewName === 'account' && document.getElementById('accountResult').style.display === 'none') {
        fetchAccount();
    } else if (viewName === 'market') {
        fetchMarketOverview();
    }
}

async function fetchMarketOverview() {
    const loader = document.getElementById('loader');
    const updateTag = document.getElementById('lastMarketUpdate');

    loader.style.display = 'block';
    updateTag.textContent = 'Updating...';

    try {
        const response = await fetch('/api/market/overview');
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch market data');

        renderMarket(data);
    } catch (err) {
        console.error('Market fetch error:', err);
        document.getElementById('errorMsg').textContent = `Market Error: ${err.message}`;
        document.getElementById('errorMsg').style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

function renderMarket(data) {
    const body = document.getElementById('marketBody');
    const updateTag = document.getElementById('lastMarketUpdate');

    if (!data || data.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align: center;">No market data available</td></tr>';
        return;
    }

    body.innerHTML = '';
    data.forEach(item => {
        const candle = item.candle || {};
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><span class="crypto-symbol">${item.symbol} / USDC</span></td>
            <td class="price-cell">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })} €</td>
            <td class="candle-val">${(candle.h || '-')}</td>
            <td class="candle-val">${(candle.l || '-')}</td>
            <td class="candle-val">${(candle.v || '-')}</td>
        `;
        body.appendChild(tr);
    });

    updateTag.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
}

async function fetchAccount() {
    const loader = document.getElementById('loader');
    const result = document.getElementById('accountResult');
    const errorMsg = document.getElementById('errorMsg');

    loader.style.display = 'block';
    result.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
        // Fetch Account Details
        const response = await fetch('/api/account');
        const data = await response.json();

        if (!response.ok || !data) {
            throw new Error(data.error || 'Account details failed');
        }

        // Fetch Portfolio Value (Earn Summary)
        let portfolioValue = '-';
        try {
            const earnResponse = await fetch('/api/earn/summary');
            if (earnResponse.ok) {
                const earnData = await earnResponse.json();
                if (earnData && earnData.totalBalance !== undefined) {
                    portfolioValue = `${earnData.totalBalance} ${earnData.currency || 'EUR'}`;
                }
            }
        } catch (e) {
            console.warn("Failed to fetch earn summary", e);
        }

        // Fetch Identity Status
        try {
            const idResponse = await fetch('/api/identity');
            if (idResponse.ok) {
                const idData = await idResponse.json();
                document.getElementById('identityStatus').textContent = idData.status || '-';
                document.getElementById('identityStatus').style.color = idData.status === 'verified' ? 'var(--success-color)' : 'var(--text-primary)';
                document.getElementById('riskLevel').textContent = idData.risk?.level || '-';
                document.getElementById('verificationTier').textContent = idData.tier !== undefined ? `Tier ${idData.tier}` : '-';
            }
        } catch (e) {
            console.warn("Failed to fetch identity status", e);
        }

        // Fetch Subaccounts
        try {
            const subResponse = await fetch('/api/subaccounts');
            if (subResponse.ok) {
                const subData = await subResponse.json();
                const listEl = document.getElementById('subaccountsList');
                if (subData && subData.length > 0) {
                    listEl.innerHTML = subData.map(s => `<div class="info-row"><span class="info-label">${s.name || s.alias || 'Subaccount'}</span><span class="info-value" style="font-size: 13px;">${s.id}</span></div>`).join('');
                } else {
                    listEl.textContent = 'No subaccounts found';
                }
            }
        } catch (e) {
            console.warn("Failed to fetch subaccounts", e);
        }

        // Populate account data
        document.getElementById('userId').textContent = data.id || '-';
        document.getElementById('userEmail').textContent = data.email || 'Hidden';

        const twoFactor = data.secondFactorAuth?.enabled ? 'Enabled' : 'Disabled';
        document.getElementById('twoFactorStatus').textContent = twoFactor;
        document.getElementById('twoFactorStatus').style.color = data.secondFactorAuth?.enabled ? 'var(--success-color)' : 'var(--danger-color)';

        const person = data.person || {};
        document.getElementById('userName').textContent = person.name || '-';
        document.getElementById('userSurname').textContent = person.surname || '-';

        const phone = data.phone || {};
        if (phone.number) {
            document.getElementById('userPhone').textContent = `+${phone.countryCode || ''} ${phone.number}`;
        } else {
            document.getElementById('userPhone').textContent = typeof data.phone === 'string' ? data.phone : '-';
        }

        const profile = data.profile || {};
        const currency = profile.currencyCode || data.currency || 'EUR';
        document.getElementById('userCurrency').textContent = currency.toUpperCase();

        document.getElementById('portfolioValue').textContent = portfolioValue;

        if (data.kyc_level !== undefined) {
            document.getElementById('kycStatus').textContent = `Level ${data.kyc_level}`;
        } else {
            document.getElementById('kycStatus').textContent = 'Active';
        }

        result.style.display = 'block';
    } catch (err) {
        errorMsg.textContent = `Error: ${err.message}`;
        errorMsg.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

async function fetchTicker() {
    const market = document.getElementById('marketInput').value.trim();
    if (!market) return;

    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const errorMsg = document.getElementById('errorMsg');

    loader.style.display = 'block';
    result.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
        const response = await fetch(`/api/ticker?market=${encodeURIComponent(market)}`);
        const data = await response.json();

        if (!response.ok || !data) {
            throw new Error(data.error || 'Ticker not found');
        }

        let ticker = data;
        if (Array.isArray(data)) {
            const found = data.find(t => t.symbol === market || t.pair === market);
            ticker = found || data[0];
        } else if (data[market]) {
            ticker = data[market];
        }

        if (!ticker) throw new Error('Ticker data malformed');

        document.getElementById('symbolDisplay').textContent = market.toUpperCase();
        document.getElementById('lastPrice').textContent = `${ticker.last || ticker.close || '-'} €`;
        document.getElementById('askPrice').textContent = ticker.ask || '-';
        document.getElementById('bidPrice').textContent = ticker.bid || '-';
        document.getElementById('highPrice').textContent = ticker.high || '-';
        document.getElementById('lowPrice').textContent = ticker.low || '-';
        document.getElementById('volume').textContent = ticker.baseVolume || ticker.volume || '-';
        document.getElementById('timestamp').textContent = new Date(ticker.timestamp || Date.now()).toLocaleString();

        result.style.display = 'block';
    } catch (err) {
        errorMsg.textContent = `Error: ${err.message}`;
        errorMsg.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

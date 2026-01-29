
function switchView(viewName) {
    // Update buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // Note: using event.currentTarget to be safer than event.target when clicking button contents
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    // Update views
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');

    // Hide messages
    document.getElementById('errorMsg').style.display = 'none';

    // Auto-fetch if account view selected and no data yet
    if (viewName === 'account' && document.getElementById('accountResult').style.display === 'none') {
        fetchAccount();
    }
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
            if(earnResponse.ok) {
                const earnData = await earnResponse.json();
                if(earnData && earnData.totalBalance !== undefined) {
                    portfolioValue = `${earnData.totalBalance} ${earnData.currency || 'EUR'}`;
                }
            }
        } catch(e) {
            console.warn("Failed to fetch earn summary", e);
        }

        // Fetch Identity Status
        try {
            const idResponse = await fetch('/api/identity');
            if(idResponse.ok) {
                const idData = await idResponse.json();
                document.getElementById('identityStatus').textContent = idData.status || '-';
                document.getElementById('identityStatus').style.color = idData.status === 'verified' ? 'var(--success-color)' : 'var(--text-primary)';
                document.getElementById('riskLevel').textContent = idData.risk?.level || '-';
                document.getElementById('verificationTier').textContent = idData.tier !== undefined ? `Tier ${idData.tier}` : '-';
            }
        } catch(e) {
            console.warn("Failed to fetch identity status", e);
        }

        // Fetch Subaccounts
        try {
            const subResponse = await fetch('/api/subaccounts');
            if(subResponse.ok) {
                const subData = await subResponse.json();
                const listEl = document.getElementById('subaccountsList');
                if(subData && subData.length > 0) {
                    listEl.innerHTML = subData.map(s => `<div class="info-row"><span class="info-label">${s.name || s.alias || 'Subaccount'}</span><span class="info-value" style="font-size: 13px;">${s.id}</span></div>`).join('');
                } else {
                    listEl.textContent = 'No subaccounts found';
                }
            }
        } catch(e) {
            console.warn("Failed to fetch subaccounts", e);
        }
        
        // Populate account data
        // Correct mapping based on debug findings
        
        document.getElementById('userId').textContent = data.id || '-';
        document.getElementById('userEmail').textContent = data.email || 'Hidden';
        
        // 2FA Status
        const twoFactor = data.secondFactorAuth?.enabled ? 'Enabled' : 'Disabled';
        document.getElementById('twoFactorStatus').textContent = twoFactor;
        document.getElementById('twoFactorStatus').style.color = data.secondFactorAuth?.enabled ? 'var(--success-color)' : 'var(--danger-color)';

        // Name and Surname are in 'person' object
        const person = data.person || {};
        document.getElementById('userName').textContent = person.name || '-';
        document.getElementById('userSurname').textContent = person.surname || '-';
        
        // Phone is an object
        const phone = data.phone || {};
        if (phone.number) {
            document.getElementById('userPhone').textContent = `+${phone.countryCode || ''} ${phone.number}`;
        } else {
             document.getElementById('userPhone').textContent = typeof data.phone === 'string' ? data.phone : '-';
        }

        // Currency is in profile
        const profile = data.profile || {};
        const currency = profile.currencyCode || data.currency || 'EUR';
        document.getElementById('userCurrency').textContent = currency.toUpperCase();
        
         // Porfolio Value from Earn Summary
         document.getElementById('portfolioValue').textContent = portfolioValue;
         
         // KYC Level
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
    if(!market) return;

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
        
        // Handle different response formats (Array vs Object map)
        let ticker = data;
        
        if (Array.isArray(data)) {
            // unexpected array from some endpoints or standard formatted list
            // If it's an array, look for the matching symbol or just take the first one if it's the only one 
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

# Bit2Me API Node Tool - Complete Documentation

## Project Overview

This is a Node.js command-line tool for interacting with the Bit2Me cryptocurrency exchange API. It provides a comprehensive set of functions for managing accounts, wallets, transactions, and trading operations.

## Core Utility Functions

### `bit2me_logic/common.js`

#### `getMessageSignature(message, secret)`
- **Purpose**: Generates a cryptographic signature for API authentication
- **Parameters**:
  - `message`: The message to sign
  - `secret`: The API secret key
- **Returns**: HMAC-SHA512 signature in base64 format
- **Process**:
  1. Creates SHA256 hash of the message
  2. Creates HMAC-SHA512 using the secret and hash digest
  3. Returns the base64 encoded signature

#### `commerceSignature(payload, secret)`
- **Purpose**: Generates signature for commerce operations
- **Parameters**:
  - `payload`: The data payload to sign
  - `secret`: The API secret key
- **Returns**: HMAC-SHA256 signature in hex format

### `bit2me_logic/utils.js`

#### `getClientMessageToSign(nonce, url, body)`
- **Purpose**: Creates the message string that needs to be signed for API authentication
- **Parameters**:
  - `nonce`: Timestamp for request uniqueness
  - `url`: API endpoint URL
  - `body`: Request body (optional)
- **Returns**: Formatted string for signing

#### `getAuthHeaders(path, subaccount, body)`
- **Purpose**: Generates authentication headers for API requests
- **Parameters**:
  - `path`: API endpoint path
  - `subaccount`: Subaccount ID (optional)
  - `body`: Request body (optional)
- **Returns**: Object with authentication headers including:
  - `x-api-key`: API key
  - `api-signature`: Generated signature
  - `x-nonce`: Timestamp nonce
  - `x-subaccount-id`: Subaccount ID (if provided)

## Main Functionality Modules

### Account Management

#### `createSubaccount.js` - `createSubaccount()`
- **Purpose**: Creates a new subaccount
- **Process**:
  1. Sends POST request to subaccount creation endpoint
  2. Returns user ID of the created subaccount

#### `setAlias.js` - `setAlias(alias, subaccount)`
- **Purpose**: Sets an alias for an account
- **Parameters**:
  - `alias`: The alias to set
  - `subaccount`: Subaccount ID (optional)

#### `readAccount.js` - `readAccount(subaccount)`
- **Purpose**: Retrieves account information
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

#### `accountDetails.js` - `getAccountDetails()`
- **Purpose**: Retrieves account details for the authenticated user
- **Returns**: detailed account object including profile info

#### `checkIdentityStatus.js` - `checkIdentityStatus()`
- **Purpose**: Retrieves identity verification status
- **Returns**: Status object indicating verification level and requirements

### Wallet/Pocket Management

#### `createPocket.js` - `createPocket(currency, name, subaccount)`
- **Purpose**: Creates a new cryptocurrency wallet/pocket
- **Parameters**:
  - `currency`: Cryptocurrency symbol
  - `name`: Pocket name
  - `subaccount`: Subaccount ID (optional)

#### `listPockets.js` - `listPockets(currency, subaccount)`
- **Purpose**: Lists available pockets/wallets
- **Parameters**:
  - `currency`: Filter by currency (optional)
  - `subaccount`: Subaccount ID (optional)

#### `pocketsBalance.js` - `pocketsBalance(currency, subaccount)`
- **Purpose**: Calculates and displays account balance
- **Parameters**:
  - `currency`: Filter by currency (optional)
  - `subaccount`: Subaccount ID (optional)
- **Helper Function**: `calcBalance(pockets)` - Calculates total balance from pocket data

### Trading Operations

#### `buy.js` - `buy(amount, currencyType, crypto, subaccount)`
- **Purpose**: Buys cryptocurrency
- **Parameters**:
  - `amount`: Amount to buy
  - `currencyType`: "-" for crypto amount or "EUR" for fiat amount
  - `crypto`: Cryptocurrency to buy
  - `subaccount`: Subaccount ID (optional)
- **Process**:
  1. Retrieves source (EUR) and destination (crypto) pockets
  2. Creates proforma order
  3. Executes the order
  4. Returns transaction details

#### `sell.js` - `sell(amount, crypto, subaccount)`
- **Purpose**: Sells cryptocurrency for EUR
- **Parameters**:
  - `amount`: Amount to sell
  - `crypto`: Cryptocurrency to sell
  - `subaccount`: Subaccount ID (optional)
- **Process**:
  1. Retrieves source (crypto) and destination (EUR) pockets
  2. Creates proforma order
  3. Executes the order
  4. Returns transaction details

#### `swap.js` - `swap(amount, originCrypto, destinationCrypto, subaccount)`
- **Purpose**: Swaps one cryptocurrency for another
- **Parameters**:
  - `amount`: Amount to swap
  - `originCrypto`: Source cryptocurrency
  - `destinationCrypto`: Target cryptocurrency
  - `subaccount`: Subaccount ID (optional)
- **Process**:
  1. Retrieves source and destination pockets
  2. Creates proforma order
  3. Executes the swap
  4. Returns transaction details

#### `createOrder.js` - `createOrder(amount, currency, subaccount)`
- **Purpose**: Creates an order via Teller API
- **Parameters**:
  - `amount`: Amount for the order
  - `currency`: Currency symbol
  - `subaccount`: Subaccount ID (optional)
- **Process**: Uses Proforma -> Execute pattern

#### `listOrders.js` - `listOrders(subaccount)`
- **Purpose**: Lists pending orders
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

### Deposit Operations

#### `depositEUR.js` - `depositEUR(subaccount)`
- **Purpose**: Displays bank account information for EUR deposits
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

#### `depositCrypto.js` - `depositCrypto(crypto, network, subaccount)`
- **Purpose**: Generates deposit address for cryptocurrency
- **Parameters**:
  - `crypto`: Cryptocurrency symbol
  - `network`: Blockchain network
  - `subaccount`: Subaccount ID (optional)

### Withdrawal Operations

#### `withdrawCrypto.js` - `withdrawCrypto(amount, crypto, network, address, totp, subaccount)`
- **Purpose**: Withdraws cryptocurrency to external address
- **Parameters**:
  - `amount`: Amount to withdraw
  - `crypto`: Cryptocurrency symbol
  - `network`: Blockchain network
  - `address`: Destination address
  - `totp`: 2FA code
  - `subaccount`: Subaccount ID (optional)

#### `withdrawEUR.js` - `withdrawEUR(amount, totp, subaccount)`
- **Purpose**: Withdraws EUR to bank account
- **Parameters**:
  - `amount`: Amount to withdraw
  - `totp`: 2FA code
  - `subaccount`: Subaccount ID (optional)

### Transaction Management

#### `getTransaction.js` - `getTransaction(txId, subaccount)`
- **Purpose**: Retrieves details of a specific transaction
- **Parameters**:
  - `txId`: Transaction ID
  - `subaccount`: Subaccount ID (optional)

#### `listTransactions.js` - `listTransactions(subaccount)`
- **Purpose**: Lists all transactions
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

### Market Data

#### `listCurrencies.js` - `listCurrencies()`
- **Purpose**: Lists all available currencies with their properties
- **Returns**: Comprehensive currency information including networks and fees

#### `marketQuotes.js` - `marketQuotes(currency)`
- **Purpose**: Gets market quotes for currencies
- **Parameters**:
  - `currency`: Specific currency (optional, defaults to EUR)

#### `marketData.js` - `marketData(currency)`
- **Purpose**: Gets detailed market data for a specific currency
- **Parameters**:
  - `currency`: Cryptocurrency symbol

### Security Features

#### `getTOTP.js` - `getTOTP(subaccount)`
- **Purpose**: Retrieves TOTP secret for 2FA setup
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

#### `setTOTP.js` - `setTOTP(subaccount, totp)`
- **Purpose**: Completes TOTP setup with verification code
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)
  - `totp`: TOTP code from authenticator app

#### `jwt.js` - `getJWT(subaccount)`
- **Purpose**: Generates JWT token for authentication
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

### Earn Operations

#### `showEarnSummary.js` - `showEarnSummary()`
- **Purpose**: Retrieves Earn program summary for the user
- **Returns**: Summary of earn assets and total value

#### `listEarnWallets.js` - `listEarnWallets()`
- **Purpose**: Lists all Earn wallets
- **Returns**: Array of earn wallets with APY and balance

### Market Data

#### `getMarketData.js` - `getMarketData(market)`
- **Purpose**: Retrieves configuration data for a specific market
- **Parameters**:
  - `market`: Market pair (e.g. BTC/EUR)

#### `getTickerInfo.js` - `getTickerInfo(market)`
- **Purpose**: Retrieves ticker information (price, volume, etc.)
- **Parameters**:
  - `market`: Market pair (e.g. BTC/EUR)

### Social Payments

#### `socialPay.js` - `socialPay(amount, crypto, alice, bob, aliceTotp)`
- **Purpose**: Transfers cryptocurrency between Bit2Me users
- **Parameters**:
  - `amount`: Amount to transfer
  - `crypto`: Cryptocurrency symbol
  - `alice`: Sender's UUID
  - `bob`: Recipient's UUID
  - `aliceTotp`: Sender's TOTP code

## Utility Functions

### `utils/getPocket.js` - `getPocket(currency, subaccount)`
- **Purpose**: Retrieves pocket information for a specific currency
- **Parameters**:
  - `currency`: Cryptocurrency symbol
  - `subaccount`: Subaccount ID (optional)

### `utils/getTx.js` - `getTx(txId, subaccount)`
- **Purpose**: Retrieves transaction details
- **Parameters**:
  - `txId`: Transaction ID
  - `subaccount`: Subaccount ID (optional)

### `utils/getUser.js` - `getUser(subaccount)`
- **Purpose**: Retrieves user information
- **Parameters**:
  - `subaccount`: Subaccount ID (optional)

### `utils/getCurrencyWdInfo.js` - `getCurrencyWdInfo(currency)`
- **Purpose**: Retrieves withdrawal information for a currency
- **Parameters**:
  - `currency`: Cryptocurrency symbol

### `utils/getNetworks.js` - `getNetworks()`
- **Purpose**: Retrieves available blockchain networks

### `utils/isSubaccount.js` - `isSubaccount(id)`
- **Purpose**: Checks if an ID belongs to a subaccount
- **Parameters**:
  - `id`: Account ID to check

## Authentication Flow

All API requests follow this authentication pattern:
1. Generate a nonce (current timestamp)
2. Create message to sign using `getClientMessageToSign()`
3. Generate signature using `getMessageSignature()`
4. Include authentication headers using `getAuthHeaders()`

## Error Handling

All functions include comprehensive error handling that:
- Catches and displays API errors
- Provides user-friendly error messages
- Includes debug information (reqId) for support

## Usage Patterns

The tool follows these common patterns:
1. **Command-line interface**: All functions are executed via npm scripts
2. **Environment configuration**: Uses `.env` file for API credentials
3. **Subaccount support**: Most functions accept optional subaccount parameter
4. **2FA requirement**: Withdrawal operations require TOTP codes
5. **Transaction tracking**: Returns transaction details after operations

## Security Considerations

- All API requests are signed with HMAC signatures
- Sensitive operations require 2FA
- JWT tokens can be used for client-side authentication
- API keys and secrets are stored in environment variables
'use strict'

// ----------------------------------------------------------------------------

const [processPath, , exchangeId = null, exchangeSymbol = null] = process.argv.filter ((x) => !x.startsWith ('--'));
const verbose = process.argv.includes ('--verbose') || false;
const debug = process.argv.includes ('--debug') || false;

// ----------------------------------------------------------------------------

const fs = require ('fs')
    , assert = require ('assert')
    , { Agent } = require ('https')
    , ccxt = require ('../../ccxt.js'); // eslint-disable-line import/order

// ----------------------------------------------------------------------------

process.on ('uncaughtException',  (e) => { console.log (e, e.stack); process.exit (1) });
process.on ('unhandledRejection', (e) => { console.log (e, e.stack); process.exit (1) });

// ----------------------------------------------------------------------------

console.log ('\nTESTING', { 'exchange': exchangeId, 'symbol': exchangeSymbol || 'all' }, '\n');

// ----------------------------------------------------------------------------

const proxies = [
    '',
    'https://cors-anywhere.herokuapp.com/'
];

//-----------------------------------------------------------------------------

const enableRateLimit = true;

const httpsAgent = new Agent ({
    'ecdhCurve': 'auto',
});

const timeout = 20000;

const exchange = new (ccxt)[exchangeId] ({
    httpsAgent,
    verbose,
    enableRateLimit,
    debug,
    timeout,
});

//-----------------------------------------------------------------------------

const tests = {};
const properties = Object.keys (exchange.has);
properties
    // eslint-disable-next-line no-path-concat
    .filter ((property) => fs.existsSync (__dirname + '/Exchange/test.' + property + '.js'))
    .forEach ((property) => {
        // eslint-disable-next-line global-require, import/no-dynamic-require, no-path-concat
        tests[property] = require (__dirname + '/Exchange/test.' + property + '.js');
    });

const errors = require ('../base/errors.js');

Object.keys (errors)
    // eslint-disable-next-line no-path-concat
    .filter ((error) => fs.existsSync (__dirname + '/errors/test.' + error + '.js'))
    .forEach ((error) => {
        // eslint-disable-next-line global-require, import/no-dynamic-require, no-path-concat
        tests[error] = require (__dirname + '/errors/test.' + error + '.js');
    });

//-----------------------------------------------------------------------------

const keysGlobal = 'keys.json';
const keysLocal = 'keys.local.json';

const keysFile = fs.existsSync (keysLocal) ? keysLocal : keysGlobal;
// eslint-disable-next-line import/no-dynamic-require, no-path-concat
const settings = require (__dirname + '/../../' + keysFile)[exchangeId];

if (settings) {
    const keys = Object.keys (settings);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (settings[key]) {
            settings[key] = ccxt.deepExtend (exchange[key] || {}, settings[key]);
        }
    }
}

Object.assign (exchange, settings);

// check auth keys in env var
const requiredCredentials = exchange.requiredCredentials;
for (const [credential, isRequired] of Object.entries (requiredCredentials)) {
    if (isRequired && exchange[credential] === undefined) {
        const credentialEnvName = (exchangeId + '_' + credential).toUpperCase (); // example: KRAKEN_APIKEY
        const credentialValue = process.env[credentialEnvName];
        if (credentialValue) {
            exchange[credential] = credentialValue;
        }
    }
}

if (settings && settings.skip) {
    console.log ('[Skipped]', { 'exchange': exchangeId, 'symbol': exchangeSymbol || 'all' });
    process.exit ();
}


// ### common language specific methods ###

async function runTesterMethod(exchange, methodName, ... args) {
    return await tests[methodName](exchange, ... args);
}

function testMethodAvailableForCurrentLang(methodName) {
    return tests[methodName] !== undefined;
}

function findValueIndexInArray (arr, value) {
    return arr.indexOf (value);
}

function exceptionHint (exc) {
    return '[' + exc.constructor.name + '] ' + exc.message.slice (0, 200);
}
// ### end of language specific common methods ###

// ----------------------------------------------------------------------------
// ### AUTO-TRANSPILER-START ###
// ----------------------------------------------------------------------------

async function test (methodName, exchange, ... args) {
    if (exchange.has[methodName]) {
        if (testMethodAvailableForCurrentLang(methodName)) {
            console.log ('Testing', exchange.id, methodName, '(', ... args, ')');
            return await runTesterMethod(exchange, methodName, ... args);
        } else {
            console.log (' # Skipping Test : ',  exchange.id, '->', methodName, ' (test method not available in current language)');
        }
    } else {
        console.log (' # Skipping Test : ',  exchange.id, '->', methodName, ' (method not supported)');
    }
}

async function testSymbol (exchange, symbol) {

    await test ('loadMarkets', exchange);
    await test ('fetchCurrencies', exchange);
    await test ('fetchTicker', exchange, symbol);
    await test ('fetchTickers', exchange, symbol);
    await test ('fetchOHLCV', exchange, symbol);
    await test ('fetchTrades', exchange, symbol);

    if (exchange.id === 'coinbase') {

        // nothing for now

    } else {

        await test ('fetchOrderBook', exchange, symbol);
        await test ('fetchL2OrderBook', exchange, symbol);
        await test ('fetchOrderBooks', exchange);
    }
}

//-----------------------------------------------------------------------------

async function loadExchange (exchange) {

    const markets = await exchange.loadMarkets ();

    assert (exchange.isObject (exchange.markets), '.markets is not an object');
    assert (exchange.isArray (exchange.symbols), '.symbols is not an array');
    const symbolsLength = exchange.symbols.length;
    assert (symbolsLength > 0, '.symbols count <= 0 (less than or equal to zero)');
    const marketKeys = Object.keys (exchange.markets);
    const marketKeysLength = marketKeys.length;
    assert (marketKeysLength > 0, '.markets objects keys length <= 0 (less than or equal to zero)');
    assert (symbolsLength === marketKeysLength, 'number of .symbols is not equal to the number of .markets');

    const symbols = [
        'BTC/CNY',
        'BTC/USD',
        'BTC/USDT',
        'BTC/EUR',
        'BTC/ETH',
        'ETH/BTC',
        'BTC/JPY',
        'ETH/EUR',
        'ETH/JPY',
        'ETH/CNY',
        'ETH/USD',
        'LTC/CNY',
        'DASH/BTC',
        'DOGE/BTC',
        'BTC/AUD',
        'BTC/PLN',
        'USD/SLL',
        'BTC/RUB',
        'BTC/UAH',
        'LTC/BTC',
        'EUR/USD',
    ];

    const resultSymbols = [];
    const exchangeSpecificSymbols = exchange.symbols;
    for (let i = 0; i < exchangeSpecificSymbols.length; i++) {
        const symbol = exchangeSpecificSymbols[i];
        if (exchange.inArray(symbol, symbols)) {
            resultSymbols.push (symbol);
        }
    }

    let resultMsg = '';
    const resultLength = resultSymbols.length;
    const exchangeSymbolsLength = exchange.symbols.length;
    if (resultLength > 0) {
        if (exchangeSymbolsLength > resultLength) {
            resultMsg = resultSymbols.join (', ') + ' + more...';
        } else {
            resultMsg = resultSymbols.join (', ');
        }
    }

    console.log (exchangeSymbolsLength, 'symbols', resultMsg);
}

//-----------------------------------------------------------------------------

function getTestSymbol (exchange, symbols) {
    let symbol = undefined;
    for (let i = 0; i < symbols.length; i++) {
        const s = symbols[i];
        const market = exchange.safeValue (exchange.markets, s);
        if (market !== undefined) {
            const active = exchange.safeValue (market, 'active');
            if (active || (active === undefined)) {
                symbol = s;
                break;
            }
        }
    }
    return symbol;
}

async function testExchange (exchange) {

    await loadExchange (exchange);

    const codes = [
        'BTC',
        'ETH',
        'XRP',
        'LTC',
        'BCH',
        'EOS',
        'BNB',
        'BSV',
        'USDT',
        'ATOM',
        'BAT',
        'BTG',
        'DASH',
        'DOGE',
        'ETC',
        'IOTA',
        'LSK',
        'MKR',
        'NEO',
        'PAX',
        'QTUM',
        'TRX',
        'TUSD',
        'USD',
        'USDC',
        'WAVES',
        'XEM',
        'XMR',
        'ZEC',
        'ZRX',
    ];

    let code = undefined;
    for (let i = 0; i < codes.length; i++) {
        if (codes[i] in exchange.currencies) {
            code = codes[i];
        }
    }

    let symbol = getTestSymbol (exchange, [
        'BTC/USD',
        'BTC/USDT',
        'BTC/CNY',
        'BTC/EUR',
        'BTC/ETH',
        'ETH/BTC',
        'ETH/USD',
        'ETH/USDT',
        'BTC/JPY',
        'LTC/BTC',
        'ZRX/WETH',
        'EUR/USD',
    ]);

    if (symbol === undefined) {
        for (let i = 0; i < codes.length; i++) {
            const marketKeys = Object.keys (exchange.markets);
            const marketsForBaseCode = [];
            for (let i = 0; i < marketKeys.length; i++) {
                const key = marketKeys[i];
                const market = exchange.markets[key];
                if (market['base'] === codes[i]) {
                    marketsForBaseCode.push (market);
                }
            }

            const lengthOfMarketsForBaseCode = marketsForBaseCode.length;
            if (lengthOfMarketsForBaseCode > 0) {
                const symbolsForBaseCode = [];
                const keysOfMarketsOfBaseCode = Object.keys (marketsForBaseCode);
                for (let i = 0; i < keysOfMarketsOfBaseCode.length; i++) {
                    const key = keysOfMarketsOfBaseCode[i];
                    const market = marketsForBaseCode[key];
                    symbolsForBaseCode.push (market['symbol']);
                }
                symbol = getTestSymbol (exchange, symbolsForBaseCode);
                break;
            }
        }
    }

    if (symbol === undefined) {
        const marketKeys = Object.keys (exchange.markets);
        const activeMarkets = [];
        for (let i = 0; i < marketKeys.length; i++) {
            const key = marketKeys[i];
            const market = exchange.markets[key];
            if (exchange.safeValue (market, 'active') !== false) {
                activeMarkets.push (market);
            }
        }
        const activeSymbols = [];
        const keysOfActiveMarketsForCode = Object.keys (activeMarkets);
        for (let i = 0; i < keysOfActiveMarketsForCode.length; i++) {
            const key = keysOfActiveMarketsForCode[i];
            const market = activeMarkets[key];
            activeSymbols.push (market['symbol']);
        }
        symbol = getTestSymbol (exchange, activeSymbols)
    }

    if (symbol === undefined) {
        symbol = getTestSymbol (exchange, exchange.symbols);
    }

    if (symbol === undefined) {
        symbol = exchange.symbols[0];
    }

    console.log ('SYMBOL:', symbol);
    if ((symbol.indexOf ('.d') < 0)) {
        await testSymbol (exchange, symbol);
    }

    if (!exchange.privateKey && (!exchange.apiKey || (exchange.apiKey === ''))) {
        return true;
    }

    exchange.checkRequiredCredentials ();

    await test ('signIn', exchange);

    // move to testnet/sandbox if possible before accessing the balance
    // if (exchange.urls['test'])
    //    exchange.urls['api'] = exchange.urls['test']

    const balance = await test ('fetchBalance', exchange);

    await test ('fetchAccounts', exchange);
    await test ('fetchTransactionFees', exchange);
    await test ('fetchTradingFees', exchange);
    await test ('fetchStatus', exchange);

    await test ('fetchOpenInterestHistory', exchange, symbol);
    await test ('fetchOrders', exchange, symbol);
    await test ('fetchOpenOrders', exchange, symbol);
    await test ('fetchClosedOrders', exchange, symbol);
    await test ('fetchMyTrades', exchange, symbol);
    await test ('fetchLeverageTiers', exchange, symbol);
    await test ('fetchOpenInterestHistory', exchange, symbol);

    await test ('fetchPositions', exchange, symbol);

    if ('fetchLedger' in tests) {
        await test ('fetchLedger', exchange, code);
    }

    await test ('fetchTransactions', exchange, code);
    await test ('fetchDeposits', exchange, code);
    await test ('fetchWithdrawals', exchange, code);
    await test ('fetchBorrowRate', exchange, code);
    await test ('fetchBorrowRates', exchange);
    await test ('fetchBorrowInterest', exchange, code);
    await test ('fetchBorrowInterest', exchange, code, symbol);

    if (exchange.extendedTest) {

        await test ('InvalidNonce', exchange, symbol);
        await test ('OrderNotFound', exchange, symbol);
        await test ('InvalidOrder', exchange, symbol);
        await test ('InsufficientFunds', exchange, symbol, balance); // danger zone - won't execute with non-empty balance
    }
}

//-----------------------------------------------------------------------------

async function tryAllProxies (exchange, proxies) {

    const index = findValueIndexInArray (proxies, exchange.proxy);
    let currentProxy = (index >= 0) ? index : 0;
    const maxRetries = proxies.length;

    if (settings && ('proxy' in settings)) {
        currentProxy = findValueIndexInArray (proxies, settings.proxy);
    }

    for (let numRetries = 0; numRetries < maxRetries; numRetries++) {

        try {

            exchange.proxy = proxies[currentProxy];

            // add random origin for proxies
            const proxiesLength = exchange.proxy;
            if (proxiesLength > 0) {
                exchange.origin = exchange.uuid ();
            }

            await testExchange (exchange);

            break;

        } catch (e) {

            currentProxy = (currentProxy + 1) % maxRetries;
            console.log (exceptionHint (e));
            if (e instanceof ccxt.DDoSProtection) {
                continue;
            } else if (e instanceof ccxt.RequestTimeout) {
                continue;
            } else if (e instanceof ccxt.ExchangeNotAvailable) {
                continue;
            } else if (e instanceof ccxt.AuthenticationError) {
                return;
            } else if (e instanceof ccxt.InvalidNonce) {
                return;
            } else {
                throw e;
            }
        }
    }
}

//-----------------------------------------------------------------------------

async function main () {

    if (exchangeSymbol) {

        await loadExchange (exchange);
        await testSymbol (exchange, exchangeSymbol);

    } else {

        await tryAllProxies (exchange, proxies);
    }

}

// ----------------------------------------------------------------------------
// ### AUTO-TRANSPILER-END ###
// ----------------------------------------------------------------------------

main ();

'use strict';

// ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, BadRequest, InvalidOrder, OrderNotFound, ArgumentsRequired, InsufficientFunds } = require ('./base/errors');
const { TICK_SIZE } = require ('./base/functions/number');
const Precise = require ('./base/Precise');

// ---------------------------------------------------------------------------

module.exports = class coinflex extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'coinflex',
            'name': 'CoinFLEX',
            'countries': [ 'SC' ], // Seychelles
            'rateLimit': 120, // 2500 requests per 5 minutes, 100 requests per minute
            'version': 'v3',
            'certified': false,
            'userAgent': this.userAgents['chrome100'],
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': undefined,
                'swap': true,
                'future': true,
                'option': undefined,
                'addMargin': undefined,
                'cancelAllOrders': undefined,
                'cancelOrder': undefined,
                'cancelOrders': undefined,
                'createDepositAddress': undefined,
                'createLimitOrder': true,
                'createMarketOrder': true,
                'createOrder': true,
                'createPostOnlyOrder': undefined,
                'createStopLimitOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'editOrder': 'emulated',
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchBidsAsks': undefined,
                'fetchBorrowInterest': undefined,
                'fetchBorrowRate': undefined,
                'fetchBorrowRateHistory': undefined,
                'fetchBorrowRates': undefined,
                'fetchBorrowRatesPerSymbol': undefined,
                'fetchCanceledOrders': false,
                'fetchClosedOrder': undefined,
                'fetchClosedOrders': false,
                'fetchCurrencies': true,
                'fetchDeposit': undefined,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchFundingFee': undefined,
                'fetchFundingFees': undefined,
                'fetchFundingHistory': undefined,
                'fetchFundingRate': undefined,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': undefined,
                'fetchIndexOHLCV': undefined,
                'fetchL2OrderBook': undefined,
                'fetchLedger': undefined,
                'fetchLedgerEntry': undefined,
                'fetchLeverageTiers': undefined,
                'fetchMarketLeverageTiers': undefined,
                'fetchMarkets': true,
                'fetchMarkOHLCV': undefined,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': true,
                'fetchOrder': true, // or maybe emulated, actually getting it from fetchOrders
                'fetchOrderBook': true,
                'fetchOrderBooks': undefined,
                'fetchOrders': true,
                'fetchOrderTrades': undefined,
                'fetchPermissions': undefined,
                'fetchPosition': true,
                'fetchPositions': true,
                'fetchPositionsRisk': undefined,
                'fetchPremiumIndexOHLCV': undefined,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': undefined,
                'fetchTrades': true,
                'fetchTradingFee': undefined,
                'fetchTradingFees': undefined,
                'fetchTradingLimits': undefined,
                'fetchTransactions': undefined,
                'fetchTransfers': true,
                'fetchWithdrawal': true,
                'fetchWithdrawals': true,
                'loadMarkets': true,
                'privateAPI': true,
                'publicAPI': true,
                'reduceMargin': undefined,
                'setLeverage': undefined,
                'setMarginMode': undefined,
                'setPositionMode': undefined,
                'signIn': undefined,
                'transfer': undefined,
                'withdraw': undefined,
            },
            'timeframes': {
                '1m': '60s',
                '5m': '300s',
                '15m': '900s',
                '30m': '1800s',
                '1h': '3600s',
                '2h': '7200s',
                '4h': '14400s',
                '1d': '86400s',
            },
            'urls': {
                'logo': '',
                'api': {
                    'public': 'https://v2api.coinflex.com',
                    'private': 'https://v2api.coinflex.com',
                },
                'www': 'https://coinflex.com/',
                'doc': [
                    'https://docs.coinflex.com/',
                ],
                'fees': [
                    'https://coinflex.com/fees/',
                ],
                'test': {
                    'public': 'https://v2stgapi.coinflex.com',
                    'private': 'https://v2stgapi.coinflex.com',
                },
            },
            'api': {
                'public': {
                    'get': {
                        'v2/all/markets': 1, // superceded by v3
                        'v2/all/assets': 1, // superceded by v3
                        'v2/publictrades/{marketCode}': 1,
                        'v2/ticker': 1, // superceded by v3
                        'v2/delivery/public/funding': 1, // superceded by v3
                        'v2.1/deliver-auction/{instrumentId}': 1, // superceded by v3
                        'v2/candles/{marketCode}': 1, // superceded by v3
                        'v2/funding-rates/{marketCode}': 1, // meant for only: BTC-USD-REPO-LIN, ETH-USD-REPO-LIN
                        'v2/depth/{marketCode}/{level}': 1, // superceded by v3
                        'v2/ping': 1,
                        'v2/flex-protocol/balances/{flexProtocol}': 1,
                        'v2/flex-protocol/positions/{flexProtocol}': 1,
                        'v2/flex-protocol/orders/{flexProtocol}': 1,
                        'v2/flex-protocol/trades/{flexProtocol}/{marketCode}': 1,
                        'v2/flex-protocol/delivery/orders/{flexProtocol}': 1,
                        'v3/markets': 1,
                        'v3/assets': 1,
                        'v3/tickers': 1,
                        'v3/auction': 1,
                        'v3/funding-rates': 1,
                        'v3/candles': 1,
                        'v3/depth': 1,
                        'v3/flexasset/balances': 1,
                        'v3/flexasset/positions': 1,
                        'v3/flexasset/yields': 1,
                    },
                    'post': {
                        'v3/flexasset/redeem': 1,
                        'v3/AMM/redeem': 1,
                    },
                },
                'private': {
                    'get': {
                        'v2/accountinfo': 1, // superceded by v3
                        'v2/balances': 1, // superceded by v3
                        'v2/balances/{instrumentId}': 1, // superceded by v3
                        'v2/positions': 1,
                        'v2/positions/{instrumentId}': 1,
                        'v2/trades/{marketCode}': 1,
                        'v2/orders': 1,
                        'v2.1/orders': 1,
                        'v2.1/delivery/orders': 1,
                        'v2/mint/{asset}': 1,
                        'v2/redeem/{asset}': 1,
                        'v2/funding-payments': 1, // TO_DO ?
                        'v2/AMM': 1,
                        'v3/account': 1,
                        'v3/deposit-addresses': 1,
                        'v3/deposit': 1,
                        'v3/withdrawal-addresses': 1,
                        'v3/withdrawal': 1,
                        'v3/withdrawal-fee': 1,
                        'v3/transfer': 1,
                        'v3/flexasset/mint': 1,
                        'v3/flexasset/redeem': 1,
                        'v3/flexasset/earned': 1,
                        'v3/AMM': 1,
                        'v3/AMM/balances': 1,
                        'v3/AMM/positions': 1,
                        'v3/AMM/orders': 1,
                        'v3/AMM/trades': 1,
                        'v3/AMM/hash-token': 1,
                        'v2/borrow/{asset}': 1, // TO_DO : Get borrow history by asset (but doesn't match directly to any unified method)
                        'v2/repay/{asset}': 1, // TO_DO: Get repay history by asset (but doesn't match directly to any unified method)
                        'v2/borrowingSummary': 1, // TO_DO : Get borrowing summary
                    },
                    'post': {
                        'v2.1/delivery/orders': 1,
                        'v2/orders/place': 1, // Note: supports batch/bulk orders
                        'v2/orders/modify': 1, // TO_DO
                        'v2/mint': 1,
                        'v2/redeem': 1,
                        'v2/borrow': 1,
                        'v2/repay': 1,
                        'v2/borrow/close': 1,
                        'v2/AMM/create': 1,
                        'v2/AMM/redeem': 1,
                        'v3/withdrawal': 1, // TO_DO
                        'v3/transfer': 1, // TO_DO
                        'v3/flexasset/mint': 1,
                        'v3/AMM/create': 1,
                    },
                    'delete': {
                        'v2/cancel/orders/{marketCode}': 1,
                        'v2.1/delivery/orders/{deliveryOrderId}': 1,
                        'v2/orders/cancel': 1, // TO_DO
                        'v2/cancel/orders': 1, // TO_DO
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.000'),
                    'taker': this.parseNumber ('0.008'),
                },
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'baseApiDomain': 'v2api.coinflex.com',
                'defaultType': 'spot', // spot, swap
                'networks': {
                    'ERC20': 'ERC20',
                    'BEP20': 'BEP20',
                    // 'SOLANA': 'SPL',
                },
                'networksByIds': {
                    'ERC20': 'ERC20',
                    'BEP20': 'BEP20',
                    // 'SPL': 'SOLANA',
                },
            },
            'commonCurrencies': {
            },
            'exceptions': {
                'exact': {
                    '40001': BadRequest,
                    '40035': OrderNotFound,
                    '710003': InvalidOrder,
                    '710006': InsufficientFunds,
                },
                'broad': {
                    'sanity bound check as price': InvalidOrder,
                    'balance check as balance': InsufficientFunds, // "FAILED balance check as balance (0.8037741278120500) < value (5.20000)"
                    'Open order not found with clientOrderId or orderId': OrderNotFound,
                },
            },
        });
    }

    async fetchStatus (params = {}) {
        const response = await this.publicGetV2Ping (params);
        //
        //     {
        //         "success": "true"
        //     }
        //
        const statusRaw = this.safeString (response, 'success');
        const status = this.safeString ({ 'true': 'ok', 'false': 'maintenance' }, statusRaw, statusRaw);
        return {
            'status': status,
            'updated': this.milliseconds (),
            'eta': undefined,
            'url': undefined,
            'info': response,
        };
    }

    async fetchMarkets (params = {}) {
        // v3 markets has a few less fields available for market-objects, but still enough to precede.
        const response = await this.publicGetV3Markets (params);
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "marketCode": "BTC-USD",
        //                 "name": "BTC/USD",
        //                 "referencePair": "BTC/USD",
        //                 "base": "BTC",
        //                 "counter": "USD",
        //                 "type": "SPOT", // SPOT, FUTURE, REPO, SPREAD
        //                 "tickSize": "1",
        //                 "minSize": "0.001",
        //                 "listedAt": "1593316800000",
        //                 "upperPriceBound": "40632",
        //                 "lowerPriceBound": "37506",
        //                 "markPrice": "39069",
        //                 "lastUpdatedAt": "1651240365178"
        //             },
        //
        //         futures/spreads/repo markets just have the same structure, but different namings
        //
        //             {
        //                 "marketCode": "BTC-USD-SWAP-LIN",
        //                 "name": "BTC/USD Perp",
        //                 "referencePair": "BTC/USD",
        //                 "base": "BTC",
        //                 "counter": "USD",
        //                 "type": "FUTURE",
        //                 ...
        //             },
        //             {
        //                 "marketCode": "BTC-USD-220624-LIN",
        //                 "name": "BTC/USD Q220624",
        //                 "referencePair": "BTC/USD",
        //                 "base": "BTC",
        //                 "counter": "USD",
        //                 "type": "FUTURE",
        //                 "settlementAt": "1656072000000",
        //                 ...
        //             },
        //             {
        //                 "marketCode": "BTC-USD-REPO-LIN",
        //                 "name": "BTC/USD Repo",
        //                 "referencePair": "BTC/USD",
        //                 "base": "BTC-USD",
        //                 "counter": "BTC-USD-SWAP-LIN",
        //                 "type": "REPO",
        //                 ...
        //             },
        //             {
        //                 "marketCode": "BTC-USD-SPR-220624P-LIN",
        //                 "name": "BTC/USD SPR Q220624",
        //                 "referencePair": "BTC/USD",
        //                 "base": "BTC-USD-220624-LIN",
        //                 "counter": "BTC-USD-SWAP-LIN",
        //                 "type": "SPREAD",
        //                 "settlementAt": "1656072000000",
        //                 ...
        //             },
        //         ],
        //     }
        //
        const data = this.safeValue (response, 'data');
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const market = data[i];
            const id = this.safeString (market, 'marketCode');
            const baseId = this.safeString (market, 'base');
            const quoteId = this.safeString (market, 'counter');
            const settleId = this.safeString (market, 'counter');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const settle = this.safeCurrencyCode (settleId);
            const type = this.safeString (market, 'type');
            const settlementTime = this.safeInteger (market, 'settlementAt');
            let symbol = base + '/' + quote;
            let marketType = undefined;
            let linear = undefined;
            let inverse = undefined;
            if (type === 'SPOT') {
                marketType = 'spot';
            } else if (type === 'FUTURE') {
                inverse = false;
                linear = true;
                if (settlementTime === undefined) {
                    marketType = 'swap';
                    symbol += ':' + settle;
                } else {
                    marketType = 'future';
                    symbol += ':' + settle + '-' + this.yymmdd (settlementTime);
                }
            } else if (type === 'SPREAD' || type === 'REPO') {
                symbol = id;
            }
            result.push ({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': marketType,
                'spot': marketType === 'spot',
                'margin': false,
                'future': marketType === 'future',
                'swap': marketType === 'swap',
                'option': false,
                'active': true,
                'contract': (marketType === 'future' || marketType === 'swap'),
                'linear': linear,
                'inverse': inverse,
                'contractSize': undefined,
                'expiry': settlementTime,
                'expiryDatetime': this.iso8601 (settlementTime),
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.safeNumber (market, 'minSize'),
                    'price': this.safeNumber (market, 'tickSize'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': this.safeNumber (market, 'upperPriceBound'),
                        'max': this.safeNumber (market, 'lowerPriceBound'),
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'info': market,
            });
        }
        return result;
    }

    async fetchCurrencies (params = {}) {
        const response = await this.publicGetV3Assets (params);
        //
        //     {
        //         "success": true,
        //         "data": [
        //           {
        //             "asset": "BTC",
        //             "isCollateral": true,
        //             "loanToValue": "0.950000000",
        //             "networkList": [
        //               {
        //                 "network": "BTC",
        //                 "transactionPrecision": "8",
        //                 "isWithdrawalFeeChargedToUser": true,
        //                 "canDeposit": true,
        //                 "canWithdraw": true,
        //                 "minDeposit": "0.00010",
        //                 "minWithdrawal": "0.00010",
        //                 // "tokenId": "730136783b0cb167727361cd3cbe47bfe3a327e2e91850948d1cb5e2ca8ce7de", // some coins have this prop
        //               }
        //             ]
        //           },
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data');
        const result = {};
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const id = this.safeString (entry, 'asset');
            const code = this.safeCurrencyCode (id);
            let isWithdrawEnabled = true;
            let isDepositEnabled = true;
            const fees = {};
            const networks = {};
            const networkList = this.safeValue (entry, 'networkList', []);
            for (let j = 0; j < networkList.length; j++) {
                const networkItem = networkList[j];
                const networkId = this.safeString (networkItem, 'network');
                // const name = this.safeString (networkItem, 'name');
                const depositEnable = this.safeValue (networkItem, 'canDeposit');
                const withdrawEnable = this.safeValue (networkItem, 'canWithdraw');
                isDepositEnabled = isDepositEnabled || depositEnable;
                isWithdrawEnabled = isWithdrawEnabled || withdrawEnable;
                fees[networkId] = undefined;
                networks[networkId] = {
                    'id': networkId,
                    'network': networkId,
                    'active': isDepositEnabled && isWithdrawEnabled,
                    'deposit': isDepositEnabled,
                    'withdraw': isWithdrawEnabled,
                    'fee': undefined,
                    'precision': this.safeInteger (networkItem, 'transactionPrecision'),
                    'limits': {
                        'deposit': {
                            'min': this.safeNumber (networkItem, 'minDeposit'),
                            'max': undefined,
                        },
                        'withdraw': {
                            'min': this.safeNumber (networkItem, 'minWithdrawal'),
                            'max': undefined,
                        },
                    },
                    'info': networkItem,
                };
            }
            result[code] = {
                'id': id,
                'name': code,
                'code': code,
                'precision': undefined,
                'info': entry,
                'active': isWithdrawEnabled && isDepositEnabled,
                'deposit': isDepositEnabled,
                'withdraw': isWithdrawEnabled,
                'fee': undefined,
                'fees': undefined,
                'limits': {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'networks': networks,
            };
        }
        return result;
    }

    setStartEndTimes (request, since) {
        // exchange has 7 days maximum allowed distance between start/end times across its api endpoints
        const distance = 7 * 24 * 60 * 60 * 1000; // 7 days
        if (since === undefined) {
            since = this.milliseconds () - distance + this.timeout; // don't directly set 7 days ago from this moment, as when request arrives at exchange, it will be more than 7 days from 'current time'. so, add timeout seconds to make sure we have enough time to reach exchange.
        }
        request['startTime'] = since;
        const currentTs = this.milliseconds ();
        if (since + distance < currentTs) {
            request['endTime'] = since + distance;
        }
        return request;
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request = {
            'marketCode': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.publicGetV2PublictradesMarketCode (this.extend (request, params));
        //
        //     {
        //         "event": "publicTrades",
        //         "timestamp": "1651312416050",
        //         "marketCode": "BTC-USD",
        //         "data": [
        //             {
        //                 "matchId": "304734619669458401",
        //                 "matchQuantity": "0.012",
        //                 "matchPrice": "38673",
        //                 "side": "BUY",
        //                 "matchTimestamp": "1651281046230"
        //             },
        //         ]
        //     }
        //
        const trades = this.safeValue (response, 'data', []);
        return this.parseTrades (trades, market, since, limit, params);
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request = {
            'marketCode': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.privateGetV2TradesMarketCode (this.extend (request, params));
        //
        //     {
        //         "event": "trades",
        //         "timestamp": "1651402298537",
        //         "accountId": "38432",
        //         "data": [
        //             {
        //                 "matchId": "8375163007067643787",
        //                 "matchTimestamp": "1651342025862",
        //                 "marketCode": "SHIB-USD-SWAP-LIN",
        //                 "matchQuantity": "313546",
        //                 "matchPrice": "0.00002161",
        //                 "total": "6.77572906",
        //                 "orderMatchType": "TAKER",
        //                 "fees": "0.00542058",
        //                 "feeInstrumentId": "USD",
        //                 "orderId": "1002109741555",
        //                 "side": "BUY",
        //                 "clientOrderId": "1651342025382"
        //             }
        //         ]
        //     }
        //
        const trades = this.safeValue (response, 'data', {});
        return this.parseTrades (trades, market, since, limit, params);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades
        //
        //     {
        //         "matchId": "304734619669458401",
        //         "matchQuantity": "0.012",
        //         "matchPrice": "38673",
        //         "side": "BUY",
        //         "matchTimestamp": "1651281046230"
        //     }
        //
        // fetchMyTrades
        //
        //     {
        //         "matchId": "8375163007067643787",
        //         "matchQuantity": "313546",
        //         "matchPrice": "0.00002161",
        //         "side": "BUY",
        //         "matchTimestamp": "1651342025862",
        //         "marketCode": "SHIB-USD-SWAP-LIN",
        //         "total": "6.77572906",
        //         "orderMatchType": "TAKER",
        //         "fees": "0.00542058",
        //         "feeInstrumentId": "USD",
        //         "orderId": "1002109741555",
        //         "clientOrderId": "1651342025382"
        //     }
        //
        // trades from order-object
        //
        //     {
        //         "8375163007067827477": {
        //             "matchQuantity": "334016",
        //             "matchPrice": "0.00002089",
        //             "timestamp": "1651410712318",
        //             "orderMatchType": "TAKER"
        //         }
        //     }
        //
        const marketId = this.safeString (trade, 'marketCode');
        market = this.safeMarket (marketId, market);
        let id = undefined;
        let timestamp = undefined;
        let priceString = undefined;
        let amountString = undefined;
        let side = undefined;
        let cost = undefined;
        let fee = undefined;
        let takerOrMakerRaw = undefined;
        const keys = Object.keys (trade);
        const length = keys.length;
        if (length === 1) {
            id = keys[0];
            const tradeData = trade[id];
            amountString = this.safeString (tradeData, 'matchQuantity');
            priceString = this.safeString (tradeData, 'matchPrice');
            timestamp = this.safeInteger (tradeData, 'timestamp');
            takerOrMakerRaw = this.safeString (trade, 'orderMatchType');
        } else {
            id = this.safeString (trade, 'matchId');
            timestamp = this.safeInteger (trade, 'matchTimestamp');
            priceString = this.safeString (trade, 'matchPrice');
            amountString = this.safeString (trade, 'matchQuantity');
            const sideRaw = this.safeString (trade, 'side');
            side = this.parseOrderSide (sideRaw);
            takerOrMakerRaw = this.safeString (trade, 'orderMatchType');
            cost = this.safeNumber (trade, 'total');
            const feeAmount = this.safeString (trade, 'fees');
            if (feeAmount !== undefined) {
                const feeCurrency = this.safeString (trade, 'feeInstrumentId');
                fee = {
                    'currency': this.safeCurrencyCode (feeCurrency, undefined),
                    'cost': feeAmount,
                };
            }
        }
        const takerOrMaker = this.safeString ({ 'TAKER': 'taker', 'MAKER': 'maker' }, takerOrMakerRaw, 'taker');
        return this.safeTrade ({
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'order': this.safeString (trade, 'orderId'),
            'type': undefined,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'price': priceString,
            'amount': amountString,
            'cost': cost,
            'fee': fee,
            'info': trade,
        }, market);
    }

    parseOrderSide (side) {
        const sides = {
            'BUY': 'buy',
            'SELL': 'sell',
        };
        return this.safeString (sides, side, side);
    }

    convertOrderSide (side) {
        const sides = {
            'buy': 'BUY',
            'sell': 'SELL',
        };
        return this.safeString (sides, side, side);
    }

    parseOrderType (type) {
        const types = {
            'MARKET': 'market',
            'LIMIT': 'limit',
            // 'STOP_LIMIT': 'stop_limit',
        };
        return this.safeString (types, type, type);
    }

    convertOrderType (type) {
        const types = {
            'market': 'MARKET',
            'limit': 'LIMIT',
        };
        return this.safeString (types, type, type);
    }

    parseTimeInForce (status) {
        const statuses = {
            'FOK': 'FOK',
            'IOC': 'IOC',
            'GTC': 'GTC',
            'MAKER_ONLY': 'PO',
            'MAKER_ONLY_REPRICE': 'PO',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrderStatus (status) {
        const statuses = {
            // createOrder
            'OPEN': 'open',
            'FILLED': 'closed',
            // fetchOrders
            'OrderOpened': 'open',
            'OrderMatched': 'closed',
            'OrderClosed': 'canceled',
        };
        return this.safeString (statuses, status, status);
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.publicGetV3Tickers (params);
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "marketCode": "BTC-USD",
        //                 "markPrice": "38649",
        //                 "open24h": "38799",
        //                 "high24h": "39418.0",
        //                 "low24h": "38176.0",
        //                 "volume24h": "18650098.7500",
        //                 "currencyVolume24h": "481.898",
        //                 "openInterest": "0",
        //                 "lastTradedPrice": "38632.0",
        //                 "lastTradedQuantity": "0.001",
        //                 "lastUpdatedAt": "1651314699020"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseTickers (data, symbols, params);
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'marketCode': market['id'],
        };
        const response = await this.publicGetV3Tickers (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "marketCode": "BTC-USD",
        //                 "markPrice": "38649",
        //                 "open24h": "38799",
        //                 "high24h": "39418.0",
        //                 "low24h": "38176.0",
        //                 "volume24h": "18650098.7500",
        //                 "currencyVolume24h": "481.898",
        //                 "openInterest": "0",
        //                 "lastTradedPrice": "38632.0",
        //                 "lastTradedQuantity": "0.001",
        //                 "lastUpdatedAt": "1651314699020"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const ticker = this.safeValue (data, 0, {});
        return this.parseTicker (ticker, market);
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         "marketCode": "BTC-USD",
        //         "markPrice": "38649",
        //         "open24h": "38799",
        //         "high24h": "39418.0",
        //         "low24h": "38176.0",
        //         "volume24h": "18650098.7500",
        //         "currencyVolume24h": "481.898",
        //         "openInterest": "0",
        //         "lastTradedPrice": "38632.0",
        //         "lastTradedQuantity": "0.001",
        //         "lastUpdatedAt": "1651314699020"
        //     }
        //
        const timestamp = this.safeInteger (ticker, 'lastUpdatedAt');
        const marketId = this.safeString (ticker, 'marketCode');
        market = this.safeMarket (marketId, market);
        const close = this.safeString (ticker, 'lastTradedPrice');
        const open = this.safeString (ticker, 'open24h');
        return this.safeTicker ({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high24h'),
            'low': this.safeString (ticker, 'low24h'),
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': close,
            'last': close,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeString (ticker, 'currencyVolume24h'),
            'quoteVolume': undefined,
            'info': ticker,
        }, market, false);
    }

    async fetchFundingRateHistory (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['marketCode'] = market['id'];
        }
        request = this.setStartEndTimes (request, since);
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicGetV3FundingRates (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "marketCode": "BTC-USD-SWAP-LIN",
        //                 "fundingRate": "0.000005000",
        //                 "netDelivered": "-18.676",
        //                 "createdAt": "1651312802926"
        //             },
        //          ]
        //      }
        //
        const data = this.safeValue (response, 'data', []);
        const rates = [];
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const timestamp = this.safeInteger (entry, 'createdAt');
            const marketId = this.safeString (entry, 'marketCode');
            rates.push ({
                'symbol': this.safeSymbol (marketId, market),
                'fundingRate': this.safeNumber (entry, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
                'info': entry,
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit);
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request = {
            'marketCode': market['id'],
            'timeframe': this.timeframes[timeframe],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.publicGetV3Candles (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "timeframe": "3600s",
        //         "data": [
        //             {
        //                 "open": "38571.00000000",
        //                 "high": "38604.00000000",
        //                 "low": "38570.00000000",
        //                 "close": "38602.00000000",
        //                 "volume": "722820.88000000",
        //                 "currencyVolume": "18.74000000",
        //                 "openedAt": "1651316400000"
        //             },
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     {
        //         "open": "38571.00000000",
        //         "high": "38604.00000000",
        //         "low": "38570.00000000",
        //         "close": "38602.00000000",
        //         "volume": "722820.88000000",
        //         "currencyVolume": "18.74000000",
        //         "openedAt": "1651316400000"
        //     }
        //
        return [
            this.safeInteger (ohlcv, 'openedAt'),
            this.safeNumber (ohlcv, 'open'),
            this.safeNumber (ohlcv, 'high'),
            this.safeNumber (ohlcv, 'low'),
            this.safeNumber (ohlcv, 'close'),
            this.safeNumber (ohlcv, 'currencyVolume'),
        ];
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'marketCode': market['id'],
        };
        if (limit !== undefined) {
            request['level'] = limit;
        }
        const response = await this.publicGetV3Depth (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "level": "5",
        //         "data": {
        //             "marketCode": "BTC-USD-SWAP-LIN",
        //             "lastUpdatedAt": "1651322410296",
        //             "asks": [[38563, 0.312], [38568, 0.001], [38570, 0.001], [38572, 0.002], [38574, 0.001]],
        //             "bids": [[38562, 0.001], [38558, 0.001], [38556, 0.1], [38555, 0.003], [38554, 0.445]]
        //         }
        //     }
        //
        const orderbook = this.safeValue (response, 'data', {});
        const timestamp = this.safeInteger (orderbook, 'lastUpdatedAt');
        return this.parseOrderBook (orderbook, symbol, timestamp);
    }

    async getAccountData (params = {}) {
        const response = await this.privateGetV3Account (params);
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "accountId": "38432",
        //                 "name": "main",
        //                 "accountType": "LINEAR",
        //                 "balances": [
        //                     {
        //                         "asset": "USDT",
        //                         "total": "0.33",
        //                         "available": "0.33",
        //                         "reserved": "0",
        //                         "lastUpdatedAt": "1651233586761"
        //                     },
        //                 ],
        //                 "positions": [
        //                     {
        //                         "marketCode": "SHIB-USD-SWAP-LIN",
        //                         "baseAsset": "SHIB",
        //                         "counterAsset": "USD",
        //                         "position": "313546.0",
        //                         "entryPrice": "0.00002161",
        //                         "markPrice": "0.00002158",
        //                         "positionPnl": "-0.009406380",
        //                         "estLiquidationPrice": "0",
        //                         "lastUpdatedAt": "1651342025876"
        //                     },
        //                 ],
        //                 "collateral": "28.297558",
        //                 "notionalPositionSize": "6.82903188",
        //                 "portfolioVarMargin": "0.682589",
        //                 "riskRatio": "41.5216",
        //                 "maintenanceMargin": "0.34129450",
        //                 "marginRatio": "1.20",
        //                 "liquidating": false,
        //                 "feeTier": "0",
        //                 "createdAt": "1651232948406"
        //             }
        //         ]
        //     }
        //
        return this.safeValue (response, 'data', []);
    }

    async fetchAccounts (params = {}) {
        await this.loadMarkets ();
        const data = await this.getAccountData (params);
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const account = data[i];
            result.push ({
                'id': this.safeString (account, 'accountId'),
                'type': undefined,
                'code': undefined,
                'info': account,
            });
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const data = await this.getAccountData (params);
        const targetAccount = this.safeValue (data, 0);
        return this.parseBalance (targetAccount);
    }

    parseBalance (data) {
        const balances = this.safeValue (data, 'balances');
        const result = {};
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            //
            //     {
            //         "asset": "USDT",
            //         "total": "0.33",
            //         "available": "0.33",
            //         "reserved": "0",
            //         "lastUpdatedAt": "1651233586761"
            //     }
            //
            const currencyId = this.safeString (balance, 'asset');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['free'] = this.safeString (balance, 'available');
            account['total'] = this.safeString (balance, 'total');
            result[code] = account;
        }
        const timestamp = this.safeInteger (data, 'createdAt');
        result['timestamp'] = timestamp;
        result['datetime'] = this.iso8601 (timestamp);
        return this.safeBalance (result);
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        const request = {
            'orderId': id,
        };
        const results = await this.fetchOrders (symbol, undefined, undefined, this.extend (request, params));
        const order = this.safeValue (results, 0);
        if (order === undefined) {
            throw new OrderNotFound (this.id + ' order ' + id + ' not found');
        }
        return order;
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['marketCode'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.privateGetV21Orders (this.extend (request, params));
        //
        //     {
        //         "event": "orders",
        //         "timestamp": "1651410725892",
        //         "accountId": "38432",
        //         "data": [
        //             {
        //                 "status": "OrderMatched",
        //                 "orderId": "1002113333774",
        //                 "clientOrderId": "1651410682769",
        //                 "marketCode": "SHIB-USD-SWAP-LIN",
        //                 "side": "BUY",
        //                 "orderType": "STOP_LIMIT",
        //                 "price": "0.00002100",
        //                 "lastTradedPrice": "0.00002089",
        //                 "avgFillPrice": "0.00002089",
        //                 "stopPrice": "0.00002055",
        //                 "limitPrice": "0.00002100",
        //                 "quantity": "334016",
        //                 "filledQuantity": "334016",
        //                 "remainQuantity": "0",
        //                 "matchIds": [
        //                     {
        //                         "8375163007067827477": {
        //                             "matchQuantity": "334016",
        //                             "matchPrice": "0.00002089",
        //                             "timestamp": "1651410712318",
        //                             "orderMatchType": "TAKER"
        //                         }
        //                     }
        //                 ],
        //                 "fees": {
        //                     "USD": "-0.00558207"
        //                 },
        //                 "timeInForce": "GTC",
        //                 "isTriggered": "false"
        //             },
        //         ]
        //     }
        const data = this.safeValue (response, 'data', []);
        return this.parseOrders (data, market, since, limit, params);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = (symbol !== undefined) ? this.market (symbol) : undefined;
        const response = await this.privateGetV2Orders (params);
        //
        //     {
        //         "event": "orders",
        //         "timestamp": "1651423023567",
        //         "accountId": "38432",
        //         "data": [
        //             {
        //                 "orderId": "1002114041607",
        //                 "marketCode": "SHIB-USD-SWAP-LIN",
        //                 "clientOrderId": "1651422991501",
        //                 "side": "BUY",
        //                 "orderType": "LIMIT",
        //                 "quantity": "400575.0",
        //                 "remainingQuantity": "400575.0",
        //                 "price": "0.000019",
        //                 "stopPrice": null,
        //                 "limitPrice": "0.000019",
        //                 "orderCreated": "1651422991179",
        //                 "lastModified": "1651422991186",
        //                 "lastTradeTimestamp": "1651422991181",
        //                 "timeInForce": "MAKER_ONLY"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOrders (data, market, since, limit, params);
    }

    parseOrder (order, market = undefined) {
        //
        // fetchOrders
        //
        //     {
        //         "orderId": "1002113333774",
        //         "clientOrderId": "1651410682769",
        //         "marketCode": "SHIB-USD-SWAP-LIN",
        //         "side": "BUY",
        //         "orderType": "STOP_LIMIT", // MARKET, STOP_LIMIT, LIMIT
        //         "quantity": "334016",
        //         "price": "0.00002100",
        //         "limitPrice": "0.00002100", // only available for limit types
        //         "stopPrice": "0.00002055", // only available for stop types
        //         "timeInForce": "GTC",
        //         "lastTradedPrice": "0.00002089",
        //         "avgFillPrice": "0.00002089",
        //         "status": "OrderMatched", // OrderOpened, OrderMatched, OrderClosed
        //         "filledQuantity": "334016",
        //         "remainQuantity": "0",
        //         "matchIds": [ // only available for filled order
        //             {
        //                 "8375163007067827477": {
        //                     "matchQuantity": "334016",
        //                     "matchPrice": "0.00002089",
        //                     "timestamp": "1651410712318",
        //                     "orderMatchType": "TAKER"
        //                 }
        //             }
        //         ],
        //         "fees": {
        //             "USD": "-0.00558207"
        //         },
        //         "isTriggered": "false"
        //     }
        //
        // fetchOpenOrders (last few props are different)
        //
        //     {
        //         "orderId": "1002114041607",
        //         "clientOrderId": "1651422991501",
        //         "marketCode": "SHIB-USD-SWAP-LIN",
        //         "side": "BUY",
        //         "orderType": "LIMIT",
        //         "quantity": "400575.0",
        //         "price": "0.000019",
        //         "limitPrice": "0.000019",
        //         "stopPrice": null,
        //         "timeInForce": "MAKER_ONLY"
        //         "lastTradeTimestamp": "1651422991181",
        //         "lastModified": "1651422991186",
        //         "orderCreated": "1651422991179",
        //         "remainingQuantity": "400575.0",
        //      }
        //
        // createOrder
        //
        //     {
        //         "success": "true",
        //         "timestamp": "1651620006856",
        //         "clientOrderId": "1651620006827000",
        //         "orderId": "1002124426084",
        //         "price": "0.65",
        //         "quantity": "8.0",
        //         "side": "BUY",
        //         "status": "FILLED", // OPEN, FILLED
        //         "marketCode": "XRP-USD",
        //         "timeInForce": "GTC",
        //         "matchId": "5636974433720947783", // zero if not filled
        //         "lastTradedPrice": "0.6028", // field not present if order doesn't have any fills
        //         "matchQuantity": "8.0", // field not present if order doesn't have any fills
        //         "orderMatchType": "TAKER", // field not present if order doesn't have any fills
        //         "remainQuantity": "0.0", // field not present if order doesn't have any fills
        //         "notice": "OrderMatched",
        //         "orderType": "LIMIT",
        //         "fees": "0.003857920", // field not present if order doesn't have any fills
        //         "feeInstrumentId": "USD", // field not present if order doesn't have any fills
        //         "isTriggered": "false"
        //     }
        //
        // cancelAllOrders
        //
        //     {
        //         "marketCode": "XRP-USD",
        //         "msg": "All open orders for the specified market have been queued for cancellation"
        //     }
        //
        const marketId = this.safeString (order, 'marketCode');
        market = this.safeMarket (marketId, market);
        const isCreateOrder = 'timestamp' in order;
        const symbol = market['symbol'];
        const timestamp = this.safeInteger2 (order, 'timestamp', 'orderCreated');
        const orderId = this.safeString (order, 'orderId');
        const clientOrderId = this.safeString (order, 'clientOrderId');
        const statusRaw = this.safeString (order, 'status');
        const status = this.parseOrderStatus (statusRaw);
        const sideRaw = this.safeString (order, 'side');
        const side = this.parseOrderSide (sideRaw);
        const orderTypeRaw = this.safeString (order, 'orderType');
        const orderType = this.parseOrderType (orderTypeRaw);
        let filledQuantityRaw = this.safeString (order, 'filledQuantity');
        if (isCreateOrder) {
            filledQuantityRaw = this.safeString (order, 'matchQuantity', '0');
        }
        const avgPriceRaw = this.safeString (order, 'avgFillPrice');
        const timeInForceRaw = this.safeString (order, 'timeInForce');
        const timeInForce = this.parseTimeInForce (timeInForceRaw);
        const price = this.safeString (order, 'price');
        const limitPrice = this.safeString (order, 'limitPrice');
        let finalLimitPrice = undefined;
        if (isCreateOrder) {
            finalLimitPrice = price;
        } else {
            finalLimitPrice = limitPrice;
        }
        let trades = this.safeValue (order, 'matchIds');
        if (trades !== undefined) {
            trades = this.parseTrades (trades, market);
        }
        let cost = undefined;
        if (avgPriceRaw !== undefined && filledQuantityRaw !== undefined) {
            cost = Precise.stringMul (avgPriceRaw, filledQuantityRaw);
        }
        const feesRaw = this.safeValue (order, 'fees');
        let fees = undefined;
        if (feesRaw !== undefined) {
            if (isCreateOrder) {
                fees = {
                    'currency': this.safeString (order, 'feeInstrumentId'),
                    'fee': this.safeString (order, 'fees'),
                };
            } else {
                const feeKeys = Object.keys (feesRaw);
                if (feeKeys.length > 0) {
                    const firstCurrencyId = feeKeys[0];
                    fees = {
                        'currency': this.safeCurrency (firstCurrencyId),
                        'fee': feesRaw[firstCurrencyId],
                    };
                }
            }
        }
        return this.safeOrder ({
            'id': orderId,
            'symbol': symbol,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': this.safeInteger (order, 'lastTradeTimestamp'),
            'timeInForce': timeInForce,
            'postOnly': timeInForce === 'PO',
            'status': status,
            'side': side,
            'price': finalLimitPrice,
            'type': orderType,
            'stopPrice': this.safeNumber (order, 'stopPrice'),
            'amount': this.safeNumber (order, 'quantity'),
            'filled': this.parseNumber (filledQuantityRaw),
            'remaining': this.safeNumber2 (order, 'remainQuantity', 'remainingQuantity'),
            'average': this.parseNumber (avgPriceRaw),
            'cost': this.parseNumber (cost),
            'fee': fees,
            'trades': trades,
            'info': order,
        }, market);
    }

    async fetchPosition (symbol, params = {}) {
        await this.loadMarkets ();
        const positions = await this.fetchPositions (undefined, params);
        const array = this.filterBySymbol (positions, symbol);
        return this.safeValue (array, 0); // exchange doesn't seem to have hedge mode, so the array will contain only one position per symbol
    }

    async fetchPositions (symbols = undefined, params = {}) {
        const data = await this.getAccountData (params);
        // response sample inside `getAccountData` method
        this.targetAccount = this.safeValue (data, 0);
        const positions = this.safeValue (this.targetAccount, 'positions', []);
        return this.parsePositions (positions);
    }

    parsePositions (positions) {
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            result.push (this.parsePosition (positions[i]));
        }
        return result;
    }

    parsePosition (position, market = undefined) {
        //
        //     {
        //         "marketCode": "SHIB-USD-SWAP-LIN",
        //         "baseAsset": "SHIB",
        //         "counterAsset": "USD",
        //         "position": "313546.0",
        //         "entryPrice": "0.00002161",
        //         "markPrice": "0.00002158",
        //         "positionPnl": "-0.009406380",
        //         "estLiquidationPrice": "0",
        //         "lastUpdatedAt": "1651342025876"
        //     }
        //
        //    but this.targetAccount has also like:
        //
        //     {
        //         "collateral": "28.297558",
        //         "notionalPositionSize": "6.82903188",
        //         "portfolioVarMargin": "0.682589",
        //         "riskRatio": "41.5216",
        //         "maintenanceMargin": "0.34129450",
        //         "marginRatio": "1.20",
        //         "liquidating": false,
        //         "feeTier": "0",
        //         "createdAt": "1651232948406"
        //     }
        //
        const marketId = this.safeString (position, 'marketCode');
        market = this.safeMarket (marketId, market);
        const contractsString = this.safeString (position, 'position');
        const timestamp = undefined; // this.safeInteger (position, 'lastUpdatedAt');
        const side = Precise.stringGt (contractsString, '0') ? 'long' : 'short';
        const liquidationPriceString = this.safeString (position, 'estLiquidationPrice');
        const entryPriceString = this.safeString (position, 'entryPrice');
        const unrealizedPnlString = this.safeString (position, 'positionPnl');
        const markPriceString = this.safeString (position, 'markPrice');
        return {
            'id': undefined,
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'initialMargin': undefined,
            'initialMarginPercentage': undefined,
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': undefined,
            'entryPrice': this.parseNumber (entryPriceString),
            'notional': undefined,
            'leverage': undefined,
            'unrealizedPnl': this.parseNumber (unrealizedPnlString),
            'contracts': this.parseNumber (contractsString),
            'contractSize': undefined,
            'marginRatio': undefined,
            'liquidationPrice': this.parseNumber (liquidationPriceString),
            'markPrice': this.parseNumber (markPriceString),
            'collateral': undefined,
            'marginType': 'cross', // each account is cross : https://coinflex.com/support/3-4-margin-and-risk-management/
            'side': side,
            'percentage': undefined,
            'info': position,
        };
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'asset': currency['id'],
        };
        const networks = this.safeValue (this.options, 'networks', {});
        const network = this.safeStringUpper (params, 'network');
        params = this.omit (params, 'network');
        const networkId = this.safeString (networks, network, network);
        if (networkId === undefined) {
            throw new ExchangeError (this.id + ' fetchDepositAddress() requires a `network` parameter');
        }
        request['network'] = networkId;
        const response = await this.privateGetV3DepositAddresses (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": {
        //             "address": "0x5D561479d9665E490894822896c9c45Ea63007Eb"
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data');
        const address = this.safeValue (data, 'address');
        this.checkAddress (address);
        return {
            'currency': code,
            'address': address,
            'tag': undefined,
            'network': network,
            'info': response,
        };
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        let request = {};
        if (code !== undefined) {
            currency = this.currency (code);
            request['asset'] = currency['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.privateGetV3Deposit (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "id": "757475245433389059",
        //                 "asset": "USDT",
        //                 "network": "ERC20",
        //                 "address": "0x5D561479d9665E490894822896c9c45Ea63007Eb",
        //                 "quantity": "28.33",
        //                 "status": "COMPLETED",
        //                 "txId": "0x6a92c8190b4b56a56fed2f9a8d0d7afd01843c28d0c0a8a5607b974b2fab8b4a",
        //                 "creditedAt": "1651233499800"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        let request = {};
        if (code !== undefined) {
            currency = this.currency (code);
            request['asset'] = currency['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.privateGetV3Withdrawal (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "id": "651573911056351237",
        //                 "asset": "USDT",
        //                 "network": "ERC20",
        //                 "address": "0x5D561479d9665E490899382896c9c45Ea63007AE",
        //                 "quantity": "36",
        //                 "fee": "5.2324",
        //                 "status": "COMPLETED",
        //                 "txId": "38c09755bff75d33304a3cb6ee839fcb78bbb38b6e3e16586f20852cdec4886d",
        //                 "requestedAt": "1617940893000",
        //                 "completedAt": "1617940921123"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    async fetchWithdrawal (id, code = undefined, params = {}) {
        const request = {
            'id': id,
        };
        const withdrawals = await this.fetchWithdrawals (code, undefined, undefined, this.extend (request, params));
        return this.safeValue (withdrawals, 0); // the target transaction will be the only in array
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //     {
        //         "id": "757475245433389059",
        //         "txId": "0x6a92c8190b4b56a56fed2f9a8d0d7afd01843c28d0c0a8a5607b974b2fab8b4a",
        //         "asset": "USDT",
        //         "network": "ERC20",
        //         "address": "0x5D561479d9665E490894822896c9c45Ea63007Eb",
        //         "quantity": "28.33",
        //         "status": "COMPLETED",
        //         "creditedAt": "1651233499800"
        //    }
        //
        // fetchWithdrawals
        //
        //     {
        //         "id": "651573911056351237",
        //         "txId": "38c09755bff75d33304a3cb6ee839fcb78bbb38b6e3e16586f20852cdec4886d",
        //         "asset": "USDT",
        //         "network": "ERC20",
        //         "address": "0x5D561479d9665E490899382896c9c45Ea63007AE",
        //         "quantity": "36",
        //         "fee": "5.2324",
        //         "status": "COMPLETED",
        //         "requestedAt": "1617940893000",
        //         "completedAt": "1617940921123"
        //     }
        //
        const isDeposit = ('creditedAt' in transaction);
        const id = this.safeString (transaction, 'id');
        const txId = this.safeString (transaction, 'txId');
        const currencyId = this.safeString (transaction, 'asset');
        currency = this.safeCurrency (currencyId, currency);
        const networkId = this.safeString (transaction, 'network');
        const networkCode = this.safeString (this.options['networksByIds'], networkId, networkId);
        const addressTo = this.safeString (transaction, 'address');
        const statusRaw = this.safeString (transaction, 'status');
        const status = this.parseTransactionStatus (statusRaw);
        const timestamp = this.safeInteger2 (transaction, 'creditedAt', 'requestedAt');
        const type = isDeposit ? 'deposit' : 'withdrawal';
        return {
            'id': id,
            'txid': txId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': networkCode,
            'address': undefined,
            'addressTo': addressTo,
            'addressFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'tagFrom': undefined,
            'type': type,
            'amount': this.safeNumber (transaction, 'quantity'),
            'currency': currency['code'],
            'status': status,
            'updated': this.safeInteger (transaction, 'completedAt'),
            'internal': undefined,
            'fee': this.safeNumber (transaction, 'fee'),
            'info': transaction,
        };
    }

    parseTransactionStatus (status) {
        const statuses = {
            'PROCESSING': 'pending',
            'PENDING': 'pending',
            'COMPLETED': 'ok',
            'FAILED': 'failed',
            'CANCELED': 'canceled',
            // 'ON HOLD': 'pending',
        };
        return this.safeString (statuses, status, status);
    }

    async fetchTransfers (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        let request = {};
        if (code !== undefined) {
            currency = this.currency (code);
            request['asset'] = currency['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        request = this.setStartEndTimes (request, since);
        const response = await this.privateGetV3Transfer (this.extend (request, params));
        //
        //     {
        //         "success": true,
        //         "data": [
        //             {
        //                 "asset": "USDT",
        //                 "quantity": "5",
        //                 "fromAccount": "38432",
        //                 "toAccount": "38774",
        //                 "id": "758113170128764931",
        //                 "status": "COMPLETED",
        //                 "transferredAt": "1651428178967"
        //              }
        //          ]
        //     }
        //
        const transfers = this.safeValue (response, 'data', []);
        return this.parseTransfers (transfers, currency, since, limit);
    }

    parseTransfer (transfer, currency = undefined) {
        //
        // fetchTransfers
        //
        //     {
        //         "asset": "USDT",
        //         "quantity": "5",
        //         "fromAccount": "38432",
        //         "toAccount": "38774",
        //         "id": "758113170128764931",
        //         "status": "COMPLETED",
        //         "transferredAt": "1651428178967"
        //      }
        //
        const currencyId = this.safeString (transfer, 'asset');
        const timestamp = this.safeString (transfer, 'transferredAt');
        const fromAccount = this.safeString (transfer, 'fromAccount');
        const toAccount = this.safeString (transfer, 'toAccount');
        const status = this.parseTransactionStatus (this.safeString (transfer, 'status'));
        return {
            'id': this.safeString (transfer, 'id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'currency': this.safeCurrencyCode (currencyId, currency),
            'amount': this.safeNumber (transfer, 'quantity'),
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': status,
            'info': transfer,
        };
    }

    async buildOrderRequest (market, type, side, amount, price = undefined, params = {}) {
        const clientOrderId = this.safeString (params, 'clientOrderId');
        const maxCOI = '9223372036854775807';
        if ((clientOrderId !== undefined) && Precise.stringGt (clientOrderId, maxCOI)) {
            throw new InvalidOrder (this.id + ' createOrder() param clientOrderId should not exceed ' + maxCOI);
        }
        const orderType = this.convertOrderType (type);
        // creating stop orders using type argument will mess up the unification logic (beacuse of missing market/limit). So, we have to use unified approach for sending stop orders
        if (orderType === 'STOP') {
            throw new ArgumentsRequired (this.id + ' createOrder() : to create a stop order, you need to specify the "stopPrice" param');
        }
        await this.loadMarkets ();
        const order = {
            'marketCode': market['id'],
            'side': this.convertOrderSide (side),
            'orderType': this.convertOrderType (type),
            'quantity': this.amountToPrecision (market['symbol'], amount),
        };
        const stopPrice = this.safeNumber (params, 'stopPrice');
        const isStopOrder = stopPrice !== undefined;
        if (isStopOrder) {
            order['stopPrice'] = this.priceToPrecision (market['symbol'], stopPrice);
            params = this.omit (params, 'stopPrice');
        }
        if (price !== undefined && type === 'limit') {
            // stop orders have separate field for limit price
            if (isStopOrder) {
                let limitPrice = this.safeNumber (params, 'limitPrice');
                if (limitPrice !== undefined) {
                    params = this.omit (params, 'limitPrice');
                } else {
                    limitPrice = price;
                }
                order['limitPrice'] = this.priceToPrecision (market['symbol'], limitPrice);
            } else {
                order['price'] = this.priceToPrecision (market['symbol'], price);
            }
        }
        // order['clientOrderId'] = (clientOrderId !== undefined) ? clientOrderId : this.microseconds ().toString ();
        const request = {
            'responseType': 'FULL', // FULL, ACK
            'orders': [ order ],
        };
        return [ request, params ];
    }

    checkOrderResponseForException (response, firstResult) {
        const success = this.safeValue (firstResult, 'success');
        if (success === 'false') {
            const message = this.safeString (firstResult, 'message');
            const code = this.safeString (firstResult, 'code');
            const body = this.id + ' ' + this.json (response);
            this.throwExactlyMatchedException (this.exceptions['exact'], code, body);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, body);
            throw new ExchangeError (body);
        }
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        const market = this.market (symbol);
        const [ request, query ] = await this.buildOrderRequest (market, type, side, amount, price, params);
        const response = await this.privatePostV2OrdersPlace (this.extend (request, query));
        //
        //     {
        //         "event": "placeOrder",
        //         "timestamp": "1651619029297",
        //         "accountId": "38420",
        //         "data": [
        //           {
        //             "success": "true",
        //             "timestamp": "1651620006856",
        //             "clientOrderId": "1651620006827000",
        //             "orderId": "1002124426084",
        //             "price": "0.65",
        //             "quantity": "8.0",
        //             "side": "BUY",
        //             "status": "FILLED", // OPEN, FILLED
        //             "marketCode": "XRP-USD",
        //             "timeInForce": "GTC",
        //             "matchId": "5636974433720947783", // zero if not filled
        //             "lastTradedPrice": "0.6028", // field not present if order doesn't have any fills
        //             "matchQuantity": "8.0", // field not present if order doesn't have any fills
        //             "orderMatchType": "TAKER", // field not present if order doesn't have any fills
        //             "remainQuantity": "0.0", // field not present if order doesn't have any fills
        //             "notice": "OrderMatched",
        //             "orderType": "LIMIT",
        //             "fees": "0.003857920", // field not present if order doesn't have any fills
        //             "feeInstrumentId": "USD", // field not present if order doesn't have any fills
        //             "isTriggered": "false"
        //           }
        //         ]
        //     }
        //
        // Note, for failed order, the order-object might be like:
        //
        //     {
        //          "success": "false",
        //          "timestamp": "1651619029297",
        //          "code": "710003",
        //          "message": "FAILED sanity bound check as price (4.000) >  upper bound (3.439)",
        //          "clientOrderId": "1651619024219000",
        //          "price": "4.000",
        //          "quantity": "3.0",
        //          "side": "BUY",
        //          "marketCode": "BAND-USD",
        //          "timeInForce": "GTC",
        //          "orderType": "LIMIT"
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const firstOrder = this.safeValue (data, 0, {});
        this.checkOrderResponseForException (response, firstOrder);
        return this.parseOrder (firstOrder, market);
    }

    async editOrder (id, symbol, type, side, amount = undefined, price = undefined, params = {}) {
        const market = this.market (symbol);
        const [ request, query ] = await this.buildOrderRequest (market, type, side, amount, price, params);
        request['orders'][0]['orderId'] = id;
        const response = await this.privatePostV2OrdersModify (this.extend (request, query));
        //
        //     {
        //         "event": "modifyOrder",
        //         "timestamp": "1651695117070",
        //         "accountId": "38420",
        //         "data": [
        //             {
        //                 "success": "true",
        //                 "timestamp": "1651696843859",
        //                 "clientOrderId": "1651692616185",
        //                 "orderId": "1002128500938",
        //                 "price": "0.5600",
        //                 "quantity": "8.0",
        //                 "side": "BUY",
        //                 "marketCode": "XRP-USD",
        //                 "timeInForce": "GTC",
        //                 "notice": "OrderModified",
        //                 "orderType": "LIMIT"
        //             }
        //         ]
        //     }
        //
        //
        // Note, for inexistent order-id, the order-object might be like:
        //
        //             {
        //                 "success": "false",
        //                 "timestamp": "1651695117070",
        //                 "code": "40035",
        //                 "message": "Open order not found with clientOrderId or orderId",
        //                 "price": "0.56",
        //                 "quantity": "8",
        //                 "side": "BUY",
        //                 "marketCode": "XRP-USD",
        //                 "orderType": "LIMIT"
        //             }
        const data = this.safeValue (response, 'data', []);
        const firstOrder = this.safeValue (data, 0, {});
        this.checkOrderResponseForException (response, firstOrder);
        return this.parseOrder (firstOrder, market);
    }

    async cancelAllOrders (symbol = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        const request = {};
        let method = 'privateDeleteV2CancelOrders';
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['marketCode'] = market['id'];
            method = 'privateDeleteV2CancelOrdersMarketCode';
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "event": "orders",
        //         "timestamp": "1651651758625",
        //         "accountId": "38420",
        //         "data": {
        //             "marketCode": "XRP-USD",
        //             "msg": "All open orders for the specified market have been queued for cancellation"
        //         }
        //     }
        //
        // Note: when fired without symbol, the 'data' object only contains a msg property with '{"msg":"All open orders for the account have been queued for cancellation"}'
        // if there has been no orders pending, then data property will be null.
        //
        return response;
    }

    nonce () {
        return this.milliseconds ();
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const [ finalPath, query ] = this.resolvePath (path, params);
        let url = this.urls['api'][api] + '/' + finalPath;
        let encodedParams = '';
        if (Object.keys (query).length) {
            encodedParams = this.urlencode (query);
            if (method === 'GET') {
                url += '?' + encodedParams;
            }
        }
        if (api === 'private') {
            this.checkRequiredCredentials ();
            const nonce = this.nonce ().toString ();
            const datetime = this.ymdhms (this.milliseconds (), 'T');
            let auth = datetime + "\n" + nonce + "\n" + method + "\n" + this.options['baseApiDomain'] + "\n" + '/' + finalPath + "\n"; // eslint-disable-line quotes
            if (method === 'POST') {
                const jsonified = this.json (query);
                auth += jsonified;
                body = jsonified;
            } else {
                auth += encodedParams;
            }
            const signature = this.hmac (this.encode (auth), this.encode (this.secret), 'sha256', 'base64');
            headers = {};
            headers['Content-Type'] = 'application/json';
            headers['AccessKey'] = this.apiKey;
            headers['Timestamp'] = datetime;
            headers['Signature'] = signature;
            headers['Nonce'] = nonce;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return;
        }
        //
        // Success
        //
        //     {
        //         "success": "true"
        //     }
        //
        //   or
        //
        //     {
        //         "success":true,
        //         "data":[...]
        //     }
        //
        //   or
        //
        //     {
        //         "event": "publicTrades",
        //         "timestamp": "1651312416050",
        //         "marketCode": "BTC-USD",
        //         "data": [
        //             {
        //                 "matchId": "304734619669458401",
        //                 "matchQuantity": "0.012",
        //                 "matchPrice": "38673",
        //                 "side": "BUY",
        //                 "matchTimestamp": "1651281046230"
        //             },
        //         ]
        //     }
        //
        // Error
        //
        //     {
        //         "success":false,
        //         "code":"40001",
        //         "message":"no result, please check your parameters"
        //     }
        //
        const responseCode = this.safeString (response, 'code');
        if (responseCode !== undefined && responseCode !== '0') {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], responseCode, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], body, feedback);
            throw new ExchangeError (feedback);
        }
    }
};

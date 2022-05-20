<?php

namespace ccxt\async;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use \ccxt\ArgumentsRequired;
use \ccxt\Precise;

class coinfalcon extends Exchange {

    public function describe() {
        return $this->deep_extend(parent::describe (), array(
            'id' => 'coinfalcon',
            'name' => 'CoinFalcon',
            'countries' => array( 'GB' ),
            'rateLimit' => 1000,
            'version' => 'v1',
            'has' => array(
                'CORS' => null,
                'spot' => true,
                'margin' => false,
                'swap' => false,
                'future' => false,
                'option' => false,
                'addMargin' => false,
                'cancelOrder' => true,
                'createOrder' => true,
                'createReduceOnlyOrder' => false,
                'fetchBalance' => true,
                'fetchBorrowRate' => false,
                'fetchBorrowRateHistories' => false,
                'fetchBorrowRateHistory' => false,
                'fetchBorrowRates' => false,
                'fetchBorrowRatesPerSymbol' => false,
                'fetchDepositAddress' => true,
                'fetchDepositAddresses' => false,
                'fetchDeposits' => true,
                'fetchFundingHistory' => false,
                'fetchFundingRate' => false,
                'fetchFundingRateHistory' => false,
                'fetchFundingRates' => false,
                'fetchIndexOHLCV' => false,
                'fetchLeverage' => false,
                'fetchLeverageTiers' => false,
                'fetchMarkets' => true,
                'fetchMarkOHLCV' => false,
                'fetchMyTrades' => true,
                'fetchOpenOrders' => true,
                'fetchOrder' => true,
                'fetchOrderBook' => true,
                'fetchPosition' => false,
                'fetchPositions' => false,
                'fetchPositionsRisk' => false,
                'fetchPremiumIndexOHLCV' => false,
                'fetchTicker' => true,
                'fetchTickers' => true,
                'fetchTrades' => true,
                'fetchTradinFee' => false,
                'fetchTradingFees' => true,
                'fetchTransfer' => false,
                'fetchTransfers' => false,
                'fetchWithdrawals' => true,
                'reduceMargin' => false,
                'setLeverage' => false,
                'setMarginMode' => false,
                'setPositionMode' => false,
                'transfer' => false,
                'withdraw' => true,
            ),
            'urls' => array(
                'logo' => 'https://user-images.githubusercontent.com/1294454/41822275-ed982188-77f5-11e8-92bb-496bcd14ca52.jpg',
                'api' => 'https://coinfalcon.com',
                'www' => 'https://coinfalcon.com',
                'doc' => 'https://docs.coinfalcon.com',
                'fees' => 'https://coinfalcon.com/fees',
                'referral' => 'https://coinfalcon.com/?ref=CFJSVGTUPASB',
            ),
            'api' => array(
                'public' => array(
                    'get' => array(
                        'markets',
                        'markets/{market}',
                        'markets/{market}/orders',
                        'markets/{market}/trades',
                    ),
                ),
                'private' => array(
                    'get' => array(
                        'user/accounts',
                        'user/orders',
                        'user/orders/{id}',
                        'user/orders/{id}/trades',
                        'user/trades',
                        'user/fees',
                        'account/withdrawals/{id}',
                        'account/withdrawals',
                        'account/deposit/{id}',
                        'account/deposits',
                        'account/deposit_address',
                    ),
                    'post' => array(
                        'user/orders',
                        'account/withdraw',
                    ),
                    'delete' => array(
                        'user/orders/{id}',
                        'account/withdrawals/{id}',
                    ),
                ),
            ),
            'fees' => array(
                'trading' => array(
                    'tierBased' => true,
                    'maker' => 0.0,
                    'taker' => 0.002, // tiered fee starts at 0.2%
                ),
            ),
            'precision' => array(
                'amount' => 8,
                'price' => 8,
            ),
        ));
    }

    public function fetch_markets($params = array ()) {
        /**
         * retrieves data on all $markets for coinfalcon
         * @param {dict} $params extra parameters specific to the exchange api endpoint
         * @return {[dict]} an array of objects representing $market data
         */
        $response = yield $this->publicGetMarkets ($params);
        //
        //    {
        //        "data" => array(
        //            array(
        //                "name" => "ETH-BTC",
        //                "precision" => 6,
        //                "min_volume" => "0.00000001",
        //                "min_price" => "0.000001",
        //                "volume" => "0.015713",
        //                "last_price" => "0.069322",
        //                "highest_bid" => "0.063892",
        //                "lowest_ask" => "0.071437",
        //                "change_in_24h" => "2.85",
        //                "size_precision" => 8,
        //                "price_precision" => 6
        //            ),
        //            ...
        //        )
        //    }
        //
        $markets = $this->safe_value($response, 'data');
        $result = array();
        for ($i = 0; $i < count($markets); $i++) {
            $market = $markets[$i];
            list($baseId, $quoteId) = explode('-', $market['name']);
            $base = $this->safe_currency_code($baseId);
            $quote = $this->safe_currency_code($quoteId);
            $result[] = array(
                'id' => $market['name'],
                'symbol' => $base . '/' . $quote,
                'base' => $base,
                'quote' => $quote,
                'settle' => null,
                'baseId' => $baseId,
                'quoteId' => $quoteId,
                'settleId' => null,
                'type' => 'spot',
                'spot' => true,
                'margin' => false,
                'swap' => false,
                'future' => false,
                'option' => false,
                'active' => true,
                'contract' => false,
                'linear' => null,
                'inverse' => null,
                'contractSize' => null,
                'expiry' => null,
                'expiryDatetime' => null,
                'strike' => null,
                'optionType' => null,
                'precision' => array(
                    'amount' => $this->safe_integer($market, 'size_precision'),
                    'price' => $this->safe_integer($market, 'price_precision'),
                ),
                'limits' => array(
                    'leverage' => array(
                        'min' => null,
                        'max' => null,
                    ),
                    'amount' => array(
                        'min' => $this->safe_number($market, 'minPrice'),
                        'max' => null,
                    ),
                    'price' => array(
                        'min' => $this->safe_number($market, 'minVolume'),
                        'max' => null,
                    ),
                    'cost' => array(
                        'min' => null,
                        'max' => null,
                    ),
                ),
                'info' => $market,
            );
        }
        return $result;
    }

    public function parse_ticker($ticker, $market = null) {
        //
        //     {
        //         "name":"ETH-BTC",
        //         "precision":6,
        //         "min_volume":"0.00000001",
        //         "min_price":"0.000001",
        //         "volume":"0.000452",
        //         "last_price":"0.079059",
        //         "highest_bid":"0.073472",
        //         "lowest_ask":"0.079059",
        //         "change_in_24h":"8.9",
        //         "size_precision":8,
        //         "price_precision":6
        //     }
        //
        $marketId = $this->safe_string($ticker, 'name');
        $market = $this->safe_market($marketId, $market, '-');
        $timestamp = $this->milliseconds();
        $last = $this->safe_string($ticker, 'last_price');
        return $this->safe_ticker(array(
            'symbol' => $market['symbol'],
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'high' => null,
            'low' => null,
            'bid' => $this->safe_string($ticker, 'highest_bid'),
            'bidVolume' => null,
            'ask' => $this->safe_string($ticker, 'lowest_ask'),
            'askVolume' => null,
            'vwap' => null,
            'open' => null,
            'close' => $last,
            'last' => $last,
            'previousClose' => null,
            'change' => $this->safe_string($ticker, 'change_in_24h'),
            'percentage' => null,
            'average' => null,
            'baseVolume' => null,
            'quoteVolume' => $this->safe_string($ticker, 'volume'),
            'info' => $ticker,
        ), $market, false);
    }

    public function fetch_ticker($symbol, $params = array ()) {
        /**
         * fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {str} $symbol unified $symbol of the market to fetch the ticker for
         * @param {dict} $params extra parameters specific to the coinfalcon api endpoint
         * @return {dict} a {@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure ticker structure}
         */
        yield $this->load_markets();
        $tickers = yield $this->fetch_tickers(array( $symbol ), $params);
        return $tickers[$symbol];
    }

    public function fetch_tickers($symbols = null, $params = array ()) {
        yield $this->load_markets();
        $response = yield $this->publicGetMarkets ($params);
        //
        //     {
        //         "data":array(
        //             {
        //                 "name":"ETH-BTC",
        //                 "precision":6,
        //                 "min_volume":"0.00000001",
        //                 "min_price":"0.000001",
        //                 "volume":"0.000452",
        //                 "last_price":"0.079059",
        //                 "highest_bid":"0.073472",
        //                 "lowest_ask":"0.079059",
        //                 "change_in_24h":"8.9",
        //                 "size_precision":8,
        //                 "price_precision":6
        //             }
        //         )
        //     }
        //
        $tickers = $this->safe_value($response, 'data');
        $result = array();
        for ($i = 0; $i < count($tickers); $i++) {
            $ticker = $this->parse_ticker($tickers[$i]);
            $symbol = $ticker['symbol'];
            $result[$symbol] = $ticker;
        }
        return $this->filter_by_array($result, 'symbol', $symbols);
    }

    public function fetch_order_book($symbol, $limit = null, $params = array ()) {
        yield $this->load_markets();
        $request = array(
            'market' => $this->market_id($symbol),
            'level' => '3',
        );
        $response = yield $this->publicGetMarketsMarketOrders (array_merge($request, $params));
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_order_book($data, $symbol, null, 'bids', 'asks', 'price', 'size');
    }

    public function parse_trade($trade, $market = null) {
        //
        // fetchTrades (public)
        //
        //      {
        //          "id":"5ec36295-5c8d-4874-8d66-2609d4938557",
        //          "price":"4050.06","size":"0.0044",
        //          "market_name":"ETH-USDT",
        //          "side":"sell",
        //          "created_at":"2021-12-07T17:47:36.811000Z"
        //      }
        //
        // fetchMyTrades (private)
        //
        //      {
        //              "id" => "0718d520-c796-4061-a16b-915cd13f20c6",
        //              "price" => "0.00000358",
        //              "size" => "50.0",
        //              "market_name" => "DOGE-BTC",
        //              "order_id" => "ff2616d8-58d4-40fd-87ae-937c73eb6f1c",
        //              "side" => "buy",
        //              "fee' => "0.00000036",
        //              "fee_currency_code" => "btc",
        //              "liquidity" => "T",
        //              "created_at" => "2021-12-08T18:26:33.840000Z"
        //      }
        //
        $timestamp = $this->parse8601($this->safe_string($trade, 'created_at'));
        $priceString = $this->safe_string($trade, 'price');
        $amountString = $this->safe_string($trade, 'size');
        $symbol = $market['symbol'];
        $tradeId = $this->safe_string($trade, 'id');
        $side = $this->safe_string($trade, 'side');
        $orderId = $this->safe_string($trade, 'order_id');
        $fee = null;
        $feeCostString = $this->safe_string($trade, 'fee');
        if ($feeCostString !== null) {
            $feeCurrencyCode = $this->safe_string($trade, 'fee_currency_code');
            $fee = array(
                'cost' => $feeCostString,
                'currency' => $this->safe_currency_code($feeCurrencyCode),
            );
        }
        return $this->safe_trade(array(
            'info' => $trade,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601($timestamp),
            'symbol' => $symbol,
            'id' => $tradeId,
            'order' => $orderId,
            'type' => null,
            'side' => $side,
            'takerOrMaker' => null,
            'price' => $priceString,
            'amount' => $amountString,
            'cost' => null,
            'fee' => $fee,
        ), $market);
    }

    public function fetch_my_trades($symbol = null, $since = null, $limit = null, $params = array ()) {
        if ($symbol === null) {
            throw new ArgumentsRequired($this->id . ' fetchMyTrades() requires a $symbol argument');
        }
        yield $this->load_markets();
        $market = $this->market($symbol);
        $request = array(
            'market' => $market['id'],
        );
        if ($since !== null) {
            $request['start_time'] = $this->iso8601($since);
        }
        if ($limit !== null) {
            $request['limit'] = $limit;
        }
        $response = yield $this->privateGetUserTrades (array_merge($request, $params));
        //
        //      {
        //          "data" => array(
        //              array(
        //                  "id" => "0718d520-c796-4061-a16b-915cd13f20c6",
        //                  "price" => "0.00000358",
        //                  "size" => "50.0",
        //                  "market_name" => "DOGE-BTC",
        //                  "order_id" => "ff2616d8-58d4-40fd-87ae-937c73eb6f1c",
        //                  "side" => "buy",
        //                  "fee' => "0.00000036",
        //                  "fee_currency_code" => "btc",
        //                  "liquidity" => "T",
        //                  "created_at" => "2021-12-08T18:26:33.840000Z"
        //              ),
        //          )
        //      }
        //
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_trades($data, $market, $since, $limit);
    }

    public function fetch_trades($symbol, $since = null, $limit = null, $params = array ()) {
        yield $this->load_markets();
        $market = $this->market($symbol);
        $request = array(
            'market' => $market['id'],
        );
        if ($since !== null) {
            $request['since'] = $this->iso8601($since);
        }
        $response = yield $this->publicGetMarketsMarketTrades (array_merge($request, $params));
        //
        //      {
        //          "data":array(
        //              array(
        //                  "id":"5ec36295-5c8d-4874-8d66-2609d4938557",
        //                  "price":"4050.06","size":"0.0044",
        //                  "market_name":"ETH-USDT",
        //                  "side":"sell",
        //                  "created_at":"2021-12-07T17:47:36.811000Z"
        //              ),
        //          )
        //      }
        //
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_trades($data, $market, $since, $limit);
    }

    public function fetch_trading_fees($params = array ()) {
        yield $this->load_markets();
        $response = yield $this->privateGetUserFees ($params);
        //
        //    {
        //        $data => {
        //            maker_fee => '0.0',
        //            taker_fee => '0.2',
        //            btc_volume_30d => '0.0'
        //        }
        //    }
        //
        $data = $this->safe_value($response, 'data', array());
        $makerString = $this->safe_string($data, 'maker_fee');
        $takerString = $this->safe_string($data, 'taker_fee');
        $maker = $this->parse_number(Precise::string_div($makerString, '100'));
        $taker = $this->parse_number(Precise::string_div($takerString, '100'));
        $result = array();
        for ($i = 0; $i < count($this->symbols); $i++) {
            $symbol = $this->symbols[$i];
            $result[$symbol] = array(
                'info' => $response,
                'symbol' => $symbol,
                'maker' => $maker,
                'taker' => $taker,
                'percentage' => true,
                'tierBased' => true,
            );
        }
        return $result;
    }

    public function parse_balance($response) {
        $result = array( 'info' => $response );
        $balances = $this->safe_value($response, 'data');
        for ($i = 0; $i < count($balances); $i++) {
            $balance = $balances[$i];
            $currencyId = $this->safe_string($balance, 'currency_code');
            $code = $this->safe_currency_code($currencyId);
            $account = $this->account();
            $account['free'] = $this->safe_string($balance, 'available_balance');
            $account['used'] = $this->safe_string($balance, 'hold_balance');
            $account['total'] = $this->safe_string($balance, 'balance');
            $result[$code] = $account;
        }
        return $this->safe_balance($result);
    }

    public function fetch_balance($params = array ()) {
        yield $this->load_markets();
        $response = yield $this->privateGetUserAccounts ($params);
        return $this->parse_balance($response);
    }

    public function parse_deposit_address($depositAddress, $currency = null) {
        //
        //     {
        //         "address":"0x77b5051f97efa9cc52c9ad5b023a53fc15c200d3",
        //         "tag":"0"
        //     }
        //
        $address = $this->safe_string($depositAddress, 'address');
        $tag = $this->safe_string($depositAddress, 'tag');
        $this->check_address($address);
        return array(
            'currency' => $this->safe_currency_code(null, $currency),
            'address' => $address,
            'tag' => $tag,
            'network' => null,
            'info' => $depositAddress,
        );
    }

    public function fetch_deposit_address($code, $params = array ()) {
        yield $this->load_markets();
        $currency = $this->safe_currency($code);
        $request = array(
            'currency' => $this->safe_string_lower($currency, 'id'),
        );
        $response = yield $this->privateGetAccountDepositAddress (array_merge($request, $params));
        //
        //     {
        //         $data => {
        //             address => '0x9918987bbe865a1a9301dc736cf6cf3205956694',
        //             tag:null
        //         }
        //     }
        //
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_deposit_address($data, $currency);
    }

    public function parse_order_status($status) {
        $statuses = array(
            'fulfilled' => 'closed',
            'canceled' => 'canceled',
            'pending' => 'open',
            'open' => 'open',
            'partially_filled' => 'open',
        );
        return $this->safe_string($statuses, $status, $status);
    }

    public function parse_order($order, $market = null) {
        //
        //     {
        //         "id":"8bdd79f4-8414-40a2-90c3-e9f4d6d1eef4"
        //         "market":"IOT-BTC"
        //         "price":"0.0000003"
        //         "size":"4.0"
        //         "size_filled":"3.0"
        //         "fee":"0.0075"
        //         "fee_currency_code":"iot"
        //         "funds":"0.0"
        //         "status":"canceled"
        //         "order_type":"buy"
        //         "post_only":false
        //         "operation_type":"market_order"
        //         "created_at":"2018-01-12T21:14:06.747828Z"
        //     }
        //
        $marketId = $this->safe_string($order, 'market');
        $symbol = $this->safe_symbol($marketId, $market, '-');
        $timestamp = $this->parse8601($this->safe_string($order, 'created_at'));
        $priceString = $this->safe_string($order, 'price');
        $amountString = $this->safe_string($order, 'size');
        $filledString = $this->safe_string($order, 'size_filled');
        $status = $this->parse_order_status($this->safe_string($order, 'status'));
        $type = $this->safe_string($order, 'operation_type');
        if ($type !== null) {
            $type = explode('_', $type);
            $type = $type[0];
        }
        $side = $this->safe_string($order, 'order_type');
        $postOnly = $this->safe_value($order, 'post_only');
        return $this->safe_order(array(
            'id' => $this->safe_string($order, 'id'),
            'clientOrderId' => null,
            'datetime' => $this->iso8601($timestamp),
            'timestamp' => $timestamp,
            'status' => $status,
            'symbol' => $symbol,
            'type' => $type,
            'timeInForce' => null,
            'postOnly' => $postOnly,
            'side' => $side,
            'price' => $priceString,
            'stopPrice' => null,
            'cost' => null,
            'amount' => $amountString,
            'filled' => $filledString,
            'remaining' => null,
            'trades' => null,
            'fee' => null,
            'info' => $order,
            'lastTradeTimestamp' => null,
            'average' => null,
        ), $market);
    }

    public function create_order($symbol, $type, $side, $amount, $price = null, $params = array ()) {
        yield $this->load_markets();
        $market = $this->market($symbol);
        // price/size must be string
        $request = array(
            'market' => $market['id'],
            'size' => $this->amount_to_precision($symbol, $amount),
            'order_type' => $side,
        );
        if ($type === 'limit') {
            $price = $this->price_to_precision($symbol, $price);
            $request['price'] = (string) $price;
        }
        $request['operation_type'] = $type . '_order';
        $response = yield $this->privatePostUserOrders (array_merge($request, $params));
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_order($data, $market);
    }

    public function cancel_order($id, $symbol = null, $params = array ()) {
        yield $this->load_markets();
        $request = array(
            'id' => $id,
        );
        $response = yield $this->privateDeleteUserOrdersId (array_merge($request, $params));
        $market = $this->market($symbol);
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_order($data, $market);
    }

    public function fetch_order($id, $symbol = null, $params = array ()) {
        yield $this->load_markets();
        $request = array(
            'id' => $id,
        );
        $response = yield $this->privateGetUserOrdersId (array_merge($request, $params));
        $data = $this->safe_value($response, 'data', array());
        return $this->parse_order($data);
    }

    public function fetch_open_orders($symbol = null, $since = null, $limit = null, $params = array ()) {
        yield $this->load_markets();
        $request = array();
        $market = null;
        if ($symbol !== null) {
            $market = $this->market($symbol);
            $request['market'] = $market['id'];
        }
        if ($since !== null) {
            $request['since_time'] = $this->iso8601($since);
        }
        // TODO => test status=all if it works for closed $orders too
        $response = yield $this->privateGetUserOrders (array_merge($request, $params));
        $data = $this->safe_value($response, 'data', array());
        $orders = $this->filter_by_array($data, 'status', array( 'pending', 'open', 'partially_filled' ), false);
        return $this->parse_orders($orders, $market, $since, $limit);
    }

    public function fetch_deposits($code = null, $since = null, $limit = null, $params = array ()) {
        yield $this->load_markets();
        $request = array(
            // $currency => 'xrp', // optional => $currency $code in lowercase
            // status => 'completed', // optional => withdrawal status
            // since_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
            // end_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
            // start_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
        );
        $currency = null;
        if ($code !== null) {
            $currency = $this->currency($code);
            $request['currency'] = $this->safe_string_lower($currency, 'id');
        }
        if ($since !== null) {
            $request['since_time'] = $this->iso8601($since);
        }
        $response = yield $this->privateGetAccountDeposits (array_merge($request, $params));
        //
        //     data => array(
        //         array(
        //             id => '6e2f18b5-f80e-xxx-xxx-xxx',
        //             amount => '0.1',
        //             status => 'completed',
        //             currency_code => 'eth',
        //             txid => '0xxxx',
        //             address => '0xxxx',
        //             tag => null,
        //             type => 'deposit'
        //         ),
        //     )
        //
        $transactions = $this->safe_value($response, 'data', array());
        $transactions->reverse (); // no timestamp but in reversed order
        return $this->parse_transactions($transactions, $currency, null, $limit);
    }

    public function fetch_withdrawals($code = null, $since = null, $limit = null, $params = array ()) {
        yield $this->load_markets();
        $request = array(
            // $currency => 'xrp', // optional => $currency $code in lowercase
            // status => 'completed', // optional => withdrawal status
            // since_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
            // end_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
            // start_time // datetime in ISO8601 format (2017-11-06T09:53:08.383210Z)
        );
        $currency = null;
        if ($code !== null) {
            $currency = $this->currency($code);
            $request['currency'] = $this->safe_string_lower($currency, 'id');
        }
        if ($since !== null) {
            $request['since_time'] = $this->iso8601($since);
        }
        $response = yield $this->privateGetAccountWithdrawals (array_merge($request, $params));
        //
        //     data => array(
        //         array(
        //             id => '25f6f144-3666-xxx-xxx-xxx',
        //             amount => '0.01',
        //             status => 'completed',
        //             fee => '0.0005',
        //             currency_code => 'btc',
        //             txid => '4xxx',
        //             address => 'bc1xxx',
        //             tag => null,
        //             type => 'withdraw'
        //         ),
        //     )
        //
        $transactions = $this->safe_value($response, 'data', array());
        $transactions->reverse (); // no timestamp but in reversed order
        return $this->parse_transactions($transactions, $currency, null, $limit);
    }

    public function withdraw($code, $amount, $address, $tag = null, $params = array ()) {
        list($tag, $params) = $this->handle_withdraw_tag_and_params($tag, $params);
        $this->check_address($address);
        yield $this->load_markets();
        $currency = $this->currency($code);
        $request = array(
            'currency' => $this->safeStingLower ($currency, 'id'),
            'address' => $address,
            'amount' => $amount,
            // 'tag' => 'string', // withdraw tag/memo
        );
        if ($tag !== null) {
            $request['tag'] = $tag;
        }
        $response = yield $this->privatePostAccountWithdraw (array_merge($request, $params));
        //
        //     data => array(
        //         array(
        //             id => '25f6f144-3666-xxx-xxx-xxx',
        //             $amount => '0.01',
        //             status => 'approval_pending',
        //             fee => '0.0005',
        //             currency_code => 'btc',
        //             txid => null,
        //             $address => 'bc1xxx',
        //             $tag => null,
        //             type => 'withdraw'
        //         ),
        //     )
        //
        $transaction = $this->safe_value($response, 'data', array());
        return $this->parse_transaction($transaction, $currency);
    }

    public function parse_transaction_status($status) {
        $statuses = array(
            'completed' => 'ok',
            'denied' => 'failed',
            'approval_pending' => 'pending',
        );
        return $this->safe_string($statuses, $status, $status);
    }

    public function parse_transaction($transaction, $currency = null) {
        //
        // fetchWithdrawals, withdraw
        //
        //     array(
        //         $id => '25f6f144-3666-xxx-xxx-xxx',
        //         $amount => '0.01',
        //         $status => 'completed',
        //         fee => '0.0005',
        //         currency_code => 'btc',
        //         $txid => '4xxx',
        //         $address => 'bc1xxx',
        //         $tag => null,
        //         $type => 'withdraw'
        //     ),
        //
        // fetchDeposits
        //
        //     array(
        //         $id => '6e2f18b5-f80e-xxx-xxx-xxx',
        //         $amount => '0.1',
        //         $status => 'completed',
        //         currency_code => 'eth',
        //         $txid => '0xxxx',
        //         $address => '0xxxx',
        //         $tag => null,
        //         $type => 'deposit'
        //     ),
        //
        $id = $this->safe_string($transaction, 'id');
        $address = $this->safe_string($transaction, 'address');
        $tag = $this->safe_string($transaction, 'tag');
        $txid = $this->safe_string($transaction, 'txid');
        $currencyId = $this->safe_string($transaction, 'currency_code');
        $code = $this->safe_currency_code($currencyId, $currency);
        $type = $this->safe_string($transaction, 'type');
        if ($type === 'withdraw') {
            $type = 'withdrawal';
        }
        $status = $this->parse_transaction_status($this->safe_string($transaction, 'status'));
        $amountString = $this->safe_string($transaction, 'amount');
        $amount = $this->parse_number($amountString);
        $feeCostString = $this->safe_string($transaction, 'fee');
        $feeCost = 0;
        if ($feeCostString !== null) {
            $feeCost = $this->parse_number($feeCostString);
        }
        return array(
            'info' => $transaction,
            'id' => $id,
            'txid' => $txid,
            'timestamp' => null,
            'datetime' => null,
            'network' => null,
            'address' => $address,
            'addressTo' => null,
            'addressFrom' => null,
            'tag' => $tag,
            'tagTo' => null,
            'tagFrom' => null,
            'type' => $type,
            'amount' => $amount,
            'currency' => $code,
            'status' => $status,
            'updated' => null,
            'fee' => array(
                'currency' => $code,
                'cost' => $feeCost,
            ),
        );
    }

    public function nonce() {
        return $this->milliseconds();
    }

    public function sign($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $request = '/api/' . $this->version . '/' . $this->implode_params($path, $params);
        $query = $this->omit($params, $this->extract_params($path));
        if ($api === 'public') {
            if ($query) {
                $request .= '?' . $this->urlencode($query);
            }
        } else {
            $this->check_required_credentials();
            if ($method === 'GET') {
                if ($query) {
                    $request .= '?' . $this->urlencode($query);
                }
            } else {
                $body = $this->json($query);
            }
            $seconds = (string) $this->seconds();
            $payload = implode('|', array($seconds, $method, $request));
            if ($body) {
                $payload .= '|' . $body;
            }
            $signature = $this->hmac($this->encode($payload), $this->encode($this->secret));
            $headers = array(
                'CF-API-KEY' => $this->apiKey,
                'CF-API-TIMESTAMP' => $seconds,
                'CF-API-SIGNATURE' => $signature,
                'Content-Type' => 'application/json',
            );
        }
        $url = $this->urls['api'] . $request;
        return array( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }

    public function handle_errors($code, $reason, $url, $method, $headers, $body, $response, $requestHeaders, $requestBody) {
        if ($code < 400) {
            return;
        }
        $ErrorClass = $this->safe_value(array(
            '401' => '\\ccxt\\AuthenticationError',
            '429' => '\\ccxt\\RateLimitExceeded',
        ), $code, '\\ccxt\\ExchangeError');
        throw new $ErrorClass($body);
    }
}

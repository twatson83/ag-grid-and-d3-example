import http from "http";

export async function stocksByExchange(exchange) {
  var options = {
    host: "www.google.co.uk",
    port: 80,
    path: '/finance?output=json&start=0&num=4000&noIL=1&q=%5B(exchange%20%3D%3D%20%22' +
          exchange +
          '%22)%20%26%20(market_cap%20%3E%3D%200)%20%26%20(market_cap%20%3C%3D%20242160000000)%20%26%20(pe_ratio%20%3E%3D%200)%20%26%20(pe_ratio%20%3C%3D%20250667)%20%26%20(dividend_yield%20%3E%3D%200)%20%26%20(dividend_yield%20%3C%3D%20141)%20%26%20(price_change_52week%20%3E%3D%20-99.96)%20%26%20(price_change_52week%20%3C%3D%202128)%5D&restype=company&ei=izw8WIH0A5edUouijqAL',
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  };

  return new Promise((resolve, reject) => {
    http.request(options, res => {



      let body = '';
      res.setEncoding('utf8');
      res.on('data', d => body += d);
      res.on('end', () => {
        const results = JSON.parse(body.replace(/\\x/g, ""));
        let stocks = [];
        results.searchresults.forEach(s => {
          let stock = {
            title: s.title,
            id: s.id,
            ticker: s.ticker,
            currency: s.local_currency_symbol,
            exchange: s.exchange
          };
          s.columns.forEach(c => stock[c.field] = c.value);
          stocks.push(stock);
        });
        resolve(stocks);
      });
      res.on('error', e => reject)
    }).end();
  });
}
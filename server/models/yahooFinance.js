import http from "http";
import moment from 'moment';

export async function getPrices(symbols) {
  var options = {
    host: "query.yahooapis.com",
    port: 80,
    path: '/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22' +
          symbols.join('%22,%22') +
          '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    http.request(options, res => {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', d => body += d);
      res.on('end', () => {
        try{
          var json = JSON.parse(body);
          if(json.query && json.query.results && json.query.results.quote){
            resolve(json.query.results.quote);
          } else {
            resolve([])
          }
        }catch (e){
          reject(e);
        }
      });
      res.on('error', e => reject)
    }).end();
  });
}

export async function getHistoricalPrices(symbol, start, end) {
  var options = {
    host: "query.yahooapis.com",
    port: 80,
    path: encodeURI('/v1/public/yql?q=select * from yahoo.finance.historicaldata  where symbol = "' +
          symbol + '" and startDate = "' +
          moment(start).format("YYYY-MM-DD") + '" and endDate = "' +
          moment(end).format("YYYY-MM-DD") + '"&format=json&env=store://datatables.org/alltableswithkeys&callback=') ,
    method: 'GET'
  };
  return new Promise((resolve, reject) => {
    http.request(options, res => {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', d => body += d);
      res.on('end', () => {
        try{
          var json = JSON.parse(body);
          if(json.query && json.query.results && json.query.results.quote){
            resolve(json.query.results.quote);
          } else {
            resolve([])
          }
        }catch (e){
          reject(e);
        }
      });
      res.on('error', e => reject)
    }).end();
  });
}
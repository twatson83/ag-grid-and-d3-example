import { getPrices, getHistoricalPrices } from '../../models/yahooFinance';

export async function historical(req, res) {
  try {
    res.json(await getHistoricalPrices(req.query.symbol, new Date(req.query.start), new Date(req.query.end)));
  } catch (ex) {
    console.log(ex);
    res.status(500).json(ex.message);
  }
}
export async function prices(req, res) {
  try {
    res.json(await getPrices(JSON.parse(req.query.symbols)));
  } catch (ex) {
    res.status(500).json(ex.message);
  }
}
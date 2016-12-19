import { stocksByExchange } from '../../models/googleFinance';

export async function getStockList(req, res) {
  try {
    res.json(await stocksByExchange(req.query.exchange));
  } catch (ex) {
    res.status(500).json(ex.message);
  }
}
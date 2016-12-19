import express from 'express';
import { getStockList } from '../controllers/api/stocks';

var router = express.Router();

router.get('/', getStockList);

module.exports = router;
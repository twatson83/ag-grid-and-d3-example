import express from 'express';
import { prices, historical } from '../controllers/api/prices';

var router = express.Router();

router.get('/', prices);
router.get('/historical', historical);

module.exports = router;
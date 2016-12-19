import express from 'express';
let router = express.Router();

router.use('/api/stocks', require('./stocks'));
router.use('/api/prices', require('./prices'));
router.use('/', require('./pages'));

export default router;
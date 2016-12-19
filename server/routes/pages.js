import express from 'express';
import {getHome} from '../controllers/pages/home';

const router = express.Router();

router.get('', getHome);

module.exports = router;
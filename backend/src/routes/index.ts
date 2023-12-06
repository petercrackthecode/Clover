import express from 'express';
// import logger from '../utils/logger';
import { healthCheck } from '../handlers/healthcheck';
import { generateImages } from '../handlers/generate';
import { webhook } from '../handlers/webhook';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);

router.post('/generate', generateImages);

router.post('/webhook', webhook);

export default router;

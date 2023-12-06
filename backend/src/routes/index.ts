import express from 'express';
// import logger from '../utils/logger';
import { healthCheck } from '../handlers/healthcheck';
import { generateImages } from '../handlers/generate';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);

router.post('/generate', generateImages);

export default router;

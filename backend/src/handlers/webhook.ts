import express from 'express';
import logger from '../utils/logger';

export const webhook = async (req: express.Request, res: express.Response) => {
  console.log('Webhook received: ', req.body);
  logger.info('Webhook received: ', req.body);

  res.status(200).json({ message: 'Webhook processed', ok: true, data: req.body });
};

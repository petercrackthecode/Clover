import express from 'express';
import logger from '../utils/logger';
import axios from 'axios';
import { RUNPOD_API, WEBHOOK_URL } from '../utils/constants';

export const generateImages = async (req: express.Request, res: express.Response) => {
  const { prompt, negative_prompt } = req.body;
  if (!prompt || prompt.trim() === '') {
    logger.error('Error: empty prompt');
    return res.status(400).json({ message: 'A non-empty prompt is required', ok: false, data: null });
  }

  if (typeof negative_prompt !== 'string') {
    logger.error('typeof negative_prompt = ', typeof negative_prompt);
    logger.error(`negative_prompt = |${negative_prompt}|`);
    logger.error('Error: invalid negative_prompt');
    return res.status(400).json({ message: 'negative_prompt must be a string', ok: false, data: null });
  }

  const options = {
    method: 'post',
    url: RUNPOD_API.STABLE_DIFFUSION_V1,
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: process.env.RUNPOD_API_KEY,
    },
    data: JSON.stringify({
      input: {
        prompt,
        negative_prompt: negative_prompt,
        num_inference_steps: 25,
        width: 512,
        height: 512,
        guidance_scale: 7.5,
        prompt_strength: 0.4,
        seed: null,
        num_outputs: 4,
        scheduler: 'KLMS',
      },
      webhook: WEBHOOK_URL,
    }),
  };

  axios(options)
    .then((response) => {
      logger.info(response.data);
      return res.status(200).json({ message: 'Success', ok: true, data: response.data });
    })
    .catch((error) => {
      logger.error(error);
      return res.status(500).json({ message: 'Internal Server Error', ok: false, data: null });
    });
};

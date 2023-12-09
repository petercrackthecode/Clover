import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import logger from './utils/logger';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

dotenv.config({ path: path.join(__dirname, '../.env') });
import { handleError } from './helpers/error';
import httpLogger from './middlewares/httpLogger';
import router from './routes/index';

const sockets: Map<string, Socket> = new Map();

const app: express.Application = express();
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(httpLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', router);
app.post('/webhook', (req: express.Request, res: express.Response) => {
  logger.info('Webhook received: ', req.body);
  const {
    status,
    id,
    input: { prompt, negative_prompt },
    output,
  } = req.body;

  console.log(prompt, negative_prompt);

  if (status === 'COMPLETED') {
    sockets.forEach((_value, key) => console.log(key));
    sockets.forEach((socket) => {
      socket.emit('taskFinished', { message: `Task ${id} is finished`, ok: true, data: req.body });
    });
    logger.info('Task finished: ');
    console.log('output = ', output);
  } else {
    sockets.forEach((socket) => {
      socket.emit('taskFinished', { message: `Task ${id} is ${status.toLowerCase()}`, ok: false, data: null });
    });
    logger.info(`Task ${id} is ${status.toLowerCase()}`);
  }

  res.status(200).json({ message: 'Webhook processed', ok: true, data: null });
});

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: /* corsOptions.origin */ '*', methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
  logger.info(`socket client ${socket.id} connected`);
  socket.emit('hi', { message: 'hello from server' });
  sockets.set(socket.id, socket);
  socket.on('disconnect', () => {
    logger.info(`socket client ${socket.id} disconnected'`);
    sockets.delete(socket.id);
  });
});

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
    case 'EADDRINUSE':
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

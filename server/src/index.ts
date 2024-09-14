import express  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { redirectUrl } from './controller/url.controller';
import { errorHandler } from './utils/errorHandler';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  }),
);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRoutes);
app.get('/:url', redirectUrl);
app.use(errorHandler);
app.use('*', (req, res) => {
  const { name, stack, message } = new Error(
    `"${req.originalUrl}" doesnt exists.`,
  );
  const status = 404;

  if (process.env.NODE_ENV === 'development') {
    console.log(message, name, stack);
  }
  res.status(status).json({ status: status, error: message });
});

app.listen(8081, () => {
  console.log('Server is running on port 8081');
  console.log(process.env.NODE_ENV);
});

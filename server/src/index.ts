import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { redirectUrl } from './controller/url.controller';
import { errorHandler } from './utils/errorHandler';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { geolocation } from './utils/ip';

process.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p);
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
app.use(
  '/public',
  express.static('public', {
    etag: true,
    setHeaders: (res, _path, _stat) => {
      res.set('Cache-Control', 'max-age=0, must-revalidate, public');
    },
  }),
);
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRoutes);
app.get('/:url', geolocation, redirectUrl);
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

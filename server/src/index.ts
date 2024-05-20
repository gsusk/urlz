import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { redirectUrl } from './controller/url.controller';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRoutes);
app.use('/:url', redirectUrl);
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

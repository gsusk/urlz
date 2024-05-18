import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/index';

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRoutes);

app.listen(8081, () => {
  async function t() {
    return await fetch('http://localhost:8081/api/url/create', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://www.google.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  t()
    .then(async (r) => console.log('ye', await r.json()))
    .catch((e) => console.error(e));
});

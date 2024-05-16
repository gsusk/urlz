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
  console.log('server listening on 8081');
});

import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';
import { recordRouter } from './routes/record.js';
import db from './utils/db.js';
console.log();
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const port = process.env.PORT || 3000;

app.use('/products', recordRouter);

(async () => {
  await db.init();

  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
})();

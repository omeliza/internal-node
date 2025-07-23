import express from 'express';
import cors from 'cors';
import { validateOrderDetails } from './middleware';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/order/details', validateOrderDetails, (req, res) => {
  const body = req.body;

  console.log('Received order details:', body);
  res.status(201).send('success');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

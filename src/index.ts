// App entry point
import express from 'express';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.route';

//import contactRoutes from './routes/contact.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bitespeed Identity Resolver API is running.');
});

app.use('/', contactRoutes);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
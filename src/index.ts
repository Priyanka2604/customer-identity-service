// App entry point
import express from 'express';
import dotenv from 'dotenv';
//import contactRoutes from './routes/contact.route';

dotenv.config();
const app = express();
app.use(express.json());

//app.use('/identify', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Bitespeed Identity Resolver API is running.');
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});


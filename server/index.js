import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(
  cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.options('*', cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Yariga!',
  });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();

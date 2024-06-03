import * as dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/userRoutes.js';
import PostRoutes from './routes/postRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SIGNED_COOKIE_KEY));
app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);

// Not Found Route Handler
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `${req.originalUrl} not found`,
  });
});

// Error Middleware
app.use(errorMiddleware);

const run = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

run();

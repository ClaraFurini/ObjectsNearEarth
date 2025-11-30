import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectMongo } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { securityMiddlewares } from './middlewares/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import neoRoutes from './routes/neos.js';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());
app.use(securityMiddlewares);

app.use('/api', authRoutes);
app.use('/api', neoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const seedUser = async () => {
  const adminEmail = 'admin@example.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash('123', 10);
    await User.create({ email: adminEmail, passwordHash, role: 'admin' });
    console.log('Seed user created');
  }
};

const start = async () => {
  await connectMongo(process.env.MONGO_URL);
  connectRedis(process.env.REDIS_URL);
  await seedUser();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;

import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectMongo } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { securityMiddlewares } from './middlewares/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import neoRoutes from './routes/neos.js';
import User from './models/User.js';
import Neo from './models/Neo.js';

dotenv.config();

const app = express();
app.enable('trust proxy');
app.use((req, res, next) => {
  if (process.env.ENFORCE_HTTPS === 'true' && req.headers['x-forwarded-proto'] !== 'https') {
    const target = `https://${req.headers.host}${req.originalUrl}`;
    return res.redirect(308, target);
  }
  return next();
});
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());
app.use(securityMiddlewares);

app.use('/api', authRoutes);
app.use('/api', neoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const ADMIN_EMAIL = 'admin@example.com';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 12);

const seedUser = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (!existing) {
    const passwordHash = await bcrypt.hash('123', SALT_ROUNDS);
    await User.create({ email: ADMIN_EMAIL, passwordHash, role: 'admin' });
    console.log('Seed user created');
  }
};

const seedNeos = async () => {
  const admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) return;

  const existingCount = await Neo.countDocuments();
  if (existingCount > 0) return;

  const seeds = [
    {
      name: 'Apophis',
      date: new Date('2029-04-13'),
      distanceKm: 38000,
      isHazardous: true,
      material: 'Rochoso',
    },
    {
      name: 'Bennu',
      date: new Date('2025-09-25'),
      distanceKm: 730000,
      isHazardous: true,
      material: 'Carbonáceo',
    },
    {
      name: 'Florence',
      date: new Date('2024-08-30'),
      distanceKm: 7000000,
      isHazardous: false,
      material: 'Silicatos',
    },
    {
      name: 'Toutatis',
      date: new Date('2023-12-12'),
      distanceKm: 1500000,
      isHazardous: false,
      material: 'Metálico',
    },
    {
      name: 'Didymos',
      date: new Date('2026-10-04'),
      distanceKm: 1100000,
      isHazardous: true,
      material: 'Rochoso',
    },
  ].map((neo) => ({ ...neo, createdBy: admin._id.toString() }));

  await Neo.insertMany(seeds);
  console.log('Seed NEOs created');
};

const start = async () => {
  await connectMongo(process.env.MONGO_URL);
  connectRedis(process.env.REDIS_URL);
  await seedUser();
  await seedNeos();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;

import mongoose from 'mongoose';

export const connectMongo = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl, { maxPoolSize: 10 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
};

export default mongoose;

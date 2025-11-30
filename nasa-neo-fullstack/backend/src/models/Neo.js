import mongoose from '../config/db.js';

const neoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  distanceKm: { type: Number, required: true },
  isHazardous: { type: Boolean, required: true },
  material: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Neo', neoSchema);

import mongoose from 'mongoose';

const loginHistorySchema = mongoose.Schema({
  userId: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  systemInfo: String,
  browserInfo: String,
  deviceType: String,
});

export default mongoose.model('LoginHistory', loginHistorySchema);

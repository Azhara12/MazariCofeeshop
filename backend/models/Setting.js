import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  storeName: { type: String, default: 'MazariCS Coffee' },
  email: { type: String, default: 'contact@mazarics.com' },
  phone: { type: String, default: '+92 300 1234567' },
  address: { type: String, default: 'Faisal Town, Sadiqabad, Punjab' },
  openTime: { type: String, default: '08:00' },
  closeTime: { type: String, default: '22:00' },
  currency: { type: String, default: '$' },
  deliveryFee: { type: String, default: '2.50' },
  freeDeliveryThreshold: { type: String, default: '25.00' },
  taxRate: { type: String, default: '8' },
  enableSoundAlerts: { type: Boolean, default: true },
  enableEmailReceipts: { type: Boolean, default: false },
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;

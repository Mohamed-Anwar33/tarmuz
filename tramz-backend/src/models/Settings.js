const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  contactRecipient: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);

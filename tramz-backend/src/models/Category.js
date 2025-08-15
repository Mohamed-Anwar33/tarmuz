const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  name_ar: { 
    type: String, 
    required: true,
    trim: true
  },
  description: String,
  description_ar: String,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', categorySchema);

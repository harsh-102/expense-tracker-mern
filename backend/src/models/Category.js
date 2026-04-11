const mongoose = require('mongoose');

// Example fields object saved: 
// { name: "GST Number", type: "string", required: true }
// { name: "Odometer Start", type: "number", required: true }

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  fields: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['string', 'number', 'boolean', 'date'], required: true },
    required: { type: Boolean, default: false }
  }],
  daily_limit: {
    type: Number,
    default: null // No limit by default
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

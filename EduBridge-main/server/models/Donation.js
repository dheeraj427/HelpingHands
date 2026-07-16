const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  bookTitle: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  condition: { 
    type: String, 
    enum: ['new', 'good', 'fair'],
    default: 'good' 
  },
  preferredSchool: { 
    type: String, 
    default: '' 
  },
  trackingId: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'received'],
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Donation', DonationSchema);
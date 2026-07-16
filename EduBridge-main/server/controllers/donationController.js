const Donation = require('../models/Donation');

const generateTrackingId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `EDU-${random}`;
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDonation = async (req, res) => {
  try {
    const { donorName, phone, bookTitle, quantity } = req.body;
    if (!donorName || !phone || !bookTitle) {
      return res.status(400).json({ message: 'Name, phone and book title are required.' });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }
    const trackingId = generateTrackingId();
    const donation = new Donation({ ...req.body, trackingId });
    const saved = await donation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({ trackingId: req.params.trackingId });
    if (!donation) return res.status(404).json({ message: 'No donation found with this tracking ID.' });
    res.json({
      trackingId: donation.trackingId,
      donorName:  donation.donorName,
      bookTitle:  donation.bookTitle,
      quantity:   donation.quantity,
      status:     donation.status,
      createdAt:  donation.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDonationByTrackingId = async (req, res) => {
  try {
    const donation = await Donation.findOneAndDelete({ trackingId: req.params.trackingId });
    if (!donation) return res.status(404).json({ message: 'No donation found with this tracking ID.' });
    res.json({ message: 'Donation deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllDonations, createDonation, updateDonationStatus, trackDonation, deleteDonation, deleteDonationByTrackingId };
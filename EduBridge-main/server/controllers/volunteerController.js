const jsonDB = require('../utils/jsonDB');
const FILE_NAME = 'volunteers.json';

const generateTrackingId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  // Changed from EDU-TUT to HH-TUT for HelpingHands branding
  return `HH-TUT-${random}`;
};

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await jsonDB.read(FILE_NAME);
    
    // Mimicking Mongoose's .sort({ createdAt: -1 })
    volunteers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVolunteer = async (req, res) => {
  try {
    const volunteers = await jsonDB.read(FILE_NAME);
    const trackingId = generateTrackingId();
    
    const newVolunteer = {
      id: jsonDB.nextId(volunteers),
      ...req.body,
      trackingId,
      createdAt: new Date().toISOString()
    };

    volunteers.push(newVolunteer);
    await jsonDB.write(FILE_NAME, volunteers);
    
    res.status(201).json(newVolunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVolunteerStatus = async (req, res) => {
  try {
    const volunteers = await jsonDB.read(FILE_NAME);
    const index = volunteers.findIndex(v => v.id === parseInt(req.params.id) || v._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Update the specific volunteer's status
    volunteers[index] = { ...volunteers[index], status: req.body.status };
    await jsonDB.write(FILE_NAME, volunteers);
    
    res.json(volunteers[index]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    const volunteers = await jsonDB.read(FILE_NAME);
    const initialLength = volunteers.length;
    
    // Filter out the volunteer by ID
    const filteredVolunteers = volunteers.filter(v => v.id !== parseInt(req.params.id) && v._id !== req.params.id);
    
    if (filteredVolunteers.length === initialLength) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    await jsonDB.write(FILE_NAME, filteredVolunteers);
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVolunteerByTrackingId = async (req, res) => {
  try {
    const volunteers = await jsonDB.read(FILE_NAME);
    const initialLength = volunteers.length;
    
    // Filter out the volunteer by trackingId
    const filteredVolunteers = volunteers.filter(v => v.trackingId !== req.params.trackingId);
    
    if (filteredVolunteers.length === initialLength) {
      return res.status(404).json({ message: 'No tutor registration found with this tracking ID.' });
    }

    await jsonDB.write(FILE_NAME, filteredVolunteers);
    res.json({ message: 'Tutor registration deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAllVolunteers, 
  createVolunteer, 
  updateVolunteerStatus, 
  deleteVolunteer, 
  deleteVolunteerByTrackingId 
};
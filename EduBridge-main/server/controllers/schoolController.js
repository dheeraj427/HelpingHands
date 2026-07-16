const jsonDB = require('../utils/jsonDB');
const FILE_NAME = 'schools.json';

const getAllSchools = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    // Public route only shows approved schools
    const approvedSchools = schools.filter(school => school.status === "approved");
    res.json(approvedSchools);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch schools." });
  }
};

const getAllSchoolsAdmin = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch schools." });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    // Checking both _id (string) and id (number) for maximum frontend compatibility
    const school = schools.find(s => s._id === req.params.id || s.id === parseInt(req.params.id));

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json(school);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createSchool = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);

    const newSchool = {
      _id: Date.now().toString(), // Keeping _id for MongoDB frontend compatibility
      id: jsonDB.nextId(schools), 
      name: req.body.name,
      location: req.body.location,
      principalName: req.body.principalName || "",
      principalMessage: req.body.principalMessage || "",
      overview: req.body.overview || "",
      facilities: req.body.facilities || [],
      gallery: req.body.gallery || [],
      contact: req.body.contact || "",
      email: req.body.email || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    schools.push(newSchool);
    await jsonDB.write(FILE_NAME, schools);

    res.status(201).json(newSchool);
  } catch (err) {
    res.status(500).json({ message: "Unable to register school." });
  }
};

const updateSchool = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    const index = schools.findIndex(s => s._id === req.params.id || s.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: "School not found" });
    }

    // Merge existing data with new data
    schools[index] = { ...schools[index], ...req.body };
    await jsonDB.write(FILE_NAME, schools);

    res.json(schools[index]);
  } catch (err) {
    res.status(500).json({ message: "Error updating school" });
  }
};

const updateSchoolStatus = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    const index = schools.findIndex(s => s._id === req.params.id || s.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: "School not found" });
    }

    schools[index].status = req.body.status;
    await jsonDB.write(FILE_NAME, schools);

    res.json(schools[index]);
  } catch (err) {
    res.status(500).json({ message: "Error updating school status" });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const schools = await jsonDB.read(FILE_NAME);
    const initialLength = schools.length;

    const filteredSchools = schools.filter(s => s._id !== req.params.id && s.id !== parseInt(req.params.id));

    if (filteredSchools.length === initialLength) {
      return res.status(404).json({ message: "School not found" });
    }

    await jsonDB.write(FILE_NAME, filteredSchools);
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting school" });
  }
};

module.exports = {
  getAllSchools,
  getAllSchoolsAdmin,
  getSchoolById,
  createSchool,
  updateSchool,
  updateSchoolStatus,
  deleteSchool
};
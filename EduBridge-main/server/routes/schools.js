const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.get('/', schoolController.getAllSchools);
router.get('/admin', schoolController.getAllSchoolsAdmin);
router.get('/:id', schoolController.getSchoolById);
router.post('/', schoolController.createSchool);
router.put('/:id', schoolController.updateSchool);
router.put('/:id/status', schoolController.updateSchoolStatus);
router.delete('/:id', schoolController.deleteSchool);

module.exports = router;
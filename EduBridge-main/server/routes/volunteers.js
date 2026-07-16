const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.get('/', volunteerController.getAllVolunteers);
router.post('/', volunteerController.createVolunteer);
router.put('/:id/status', volunteerController.updateVolunteerStatus);
router.delete('/:id', volunteerController.deleteVolunteer);
router.delete('/tracking/:trackingId', volunteerController.deleteVolunteerByTrackingId);

module.exports = router;
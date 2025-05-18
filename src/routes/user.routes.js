const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Get all notifications for a user
router.get('/:id/notifications', notificationController.getUserNotifications);

module.exports = router;
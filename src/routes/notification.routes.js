const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Send a notification
router.post('/', notificationController.sendNotification);

module.exports = router;
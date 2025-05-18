const Notification = require('../models/notification.model');
const notificationService = require('../services/notification.service');

// Valid notification types
const VALID_NOTIFICATION_TYPES = ['EMAIL', 'SMS', 'IN_APP'];

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, title, content } = req.body;
    
    // Validate required fields
    if (!userId || !type || !title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, type, title, and content are required' 
      });
    }

    // Validate notification type
    if (!VALID_NOTIFICATION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification type. Must be one of: ${VALID_NOTIFICATION_TYPES.join(', ')}`
      });
    }
    
    // Create notification in database
    const notification = new Notification({
      userId,
      type,
      title,
      content
    });
    
    await notification.save();
    
    // Queue the notification for processing
    await notificationService.queueNotification(notification);
    
    res.status(201).json({
      success: true,
      message: 'Notification queued for delivery',
      data: notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};
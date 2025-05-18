const amqp = require('amqplib');
const emailService = require('./email.service');
const smsService = require('./sms.service');
const inAppService = require('./inapp.service');
const Notification = require('../models/notification.model');

// Connect to RabbitMQ
let channel;
const QUEUE_NAME = 'notifications';

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Connected to RabbitMQ');
    
    // Start consuming messages
    consumeNotifications();
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    setTimeout(connectToRabbitMQ, 5000); // Retry after 5 seconds
  }
}

// Queue a notification for processing
exports.queueNotification = async (notification) => {
  try {
    if (!channel) {
      await connectToRabbitMQ();
    }
    
    channel.sendToQueue(
      QUEUE_NAME, 
      Buffer.from(JSON.stringify(notification)), 
      { persistent: true }
    );
    
    return true;
  } catch (error) {
    console.error('Error queueing notification:', error);
    throw error;
  }
};

// Process notifications from queue
async function consumeNotifications() {
  try {
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        console.log('Processing notification:', notification._id);
        
        try {
          await processNotification(notification);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing notification:', error);
          
          // Retry logic for failed notifications
          if (notification.retryCount < 3) {
            // Update retry count and requeue
            await Notification.findByIdAndUpdate(notification._id, {
              retryCount: notification.retryCount + 1,
              status: 'FAILED'
            });
            
            // Requeue with a delay
            setTimeout(() => {
              channel.sendToQueue(
                QUEUE_NAME,
                Buffer.from(JSON.stringify({
                  ...notification,
                  retryCount: notification.retryCount + 1
                })),
                { persistent: true }
              );
            }, 5000 * (notification.retryCount + 1)); // Increasing delay for each retry
            
            channel.ack(msg);
          } else {
            // Max retries reached
            await Notification.findByIdAndUpdate(notification._id, {
              status: 'FAILED',
              updatedAt: new Date()
            });
            channel.ack(msg);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error consuming notifications:', error);
  }
}

// Process a notification based on its type
async function processNotification(notification) {
  const { type, _id } = notification;
  
  try {
    let result;
    
    switch (type) {
      case 'EMAIL':
        result = await emailService.sendEmail(notification);
        break;
      case 'SMS':
        result = await smsService.sendSMS(notification);
        break;
      case 'IN_APP':
        result = await inAppService.sendInAppNotification(notification);
        break;
      default:
        throw new Error(`Unsupported notification type: ${type}`);
    }
    
    // Update notification status to SENT
    await Notification.findByIdAndUpdate(_id, {
      status: 'SENT',
      updatedAt: new Date()
    });
    
    return result;
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    throw error;
  }
}

// Initialize connection when service starts
connectToRabbitMQ();
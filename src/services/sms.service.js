const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMS = async (notification) => {
  const { userId, content } = notification;
  
  // In a real application, you would fetch the user's phone number from a database
  // For simplicity, we'll assume the userId is the phone number
  const phoneNumber = userId;
  
  try {
    const message = await client.messages.create({
      body: content,
      from: '+15551234567', // Your Twilio phone number
      to: phoneNumber
    });
    
    console.log('SMS sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

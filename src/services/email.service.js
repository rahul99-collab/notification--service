const nodemailer = require('nodemailer');

// Create a transporter with your email settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.sendEmail = async (notification) => {
  const { userId, title, content } = notification;
  
  // Validate if userId is a valid email address
  if (!emailRegex.test(userId)) {
    throw new Error('Invalid email address format');
  }
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userId,
    subject: title,
    text: content,
    html: `<div>${content}</div>`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

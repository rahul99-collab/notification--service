Notification Service
A RESTful API service for sending and managing notifications across multiple channels (Email, SMS, and In-App).
Features

Send notifications via Email, SMS, or In-App
Retrieve notifications for a specific user
Asynchronous notification processing using RabbitMQ
Automatic retries for failed notifications
Persistent storage of notification data

Tech Stack

Node.js & Express: Backend framework
MongoDB: Database for storing notifications
RabbitMQ: Message queue for asynchronous processing
Nodemailer: Email delivery
Twilio: SMS delivery

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14 or newer)
MongoDB
RabbitMQ

Installation

Clone the repository:
git clone https://github.com/yourusername/notification-service.git
cd notification-service

Install dependencies:
npm install

Create a .env file in the root directory with the following variables:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notification-service
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
RABBITMQ_URL=amqp://localhost

Start the service:
npm start
For development with auto-reload:
npm run dev


API Documentation
Send a Notification
Endpoint: POST /notifications
Request Body:
json{
  "userId": "user123",
  "type": "EMAIL",
  "title": "Welcome to Our Service",
  "content": "Thank you for signing up!"
}
Response:
json{
  "success": true,
  "message": "Notification queued for delivery",
  "data": {
    "_id": "60f7b0b3e6b3a40cf4c1a5d7",
    "userId": "user123",
    "type": "EMAIL",
    "title": "Welcome to Our Service",
    "content": "Thank you for signing up!",
    "status": "PENDING",
    "retryCount": 0,
    "createdAt": "2023-07-21T12:30:43.511Z",
    "updatedAt": "2023-07-21T12:30:43.511Z"
  }
}
Get User Notifications
Endpoint: GET /users/{id}/notifications
Response:
json{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60f7b0b3e6b3a40cf4c1a5d7",
      "userId": "user123",
      "type": "EMAIL",
      "title": "Welcome to Our Service",
      "content": "Thank you for signing up!",
      "status": "SENT",
      "retryCount": 0,
      "createdAt": "2023-07-21T12:30:43.511Z",
      "updatedAt": "2023-07-21T12:30:45.612Z"
    },
    {
      "_id": "60f7b0b3e6b3a40cf4c1a5d8",
      "userId": "user123",
      "type": "SMS",
      "title": "2FA Code",
      "content": "Your verification code is 123456",
      "status": "SENT",
      "retryCount": 0,
      "createdAt": "2023-07-21T12:29:43.511Z",
      "updatedAt": "2023-07-21T12:29:45.612Z"
    }
  ]
}
Notification Types
The service supports three types of notifications:

EMAIL: Sends an email using Nodemailer
SMS: Sends a text message using Twilio
IN_APP: Creates an in-app notification that can be retrieved via API

Architecture
The service follows a modular architecture:

Controllers: Handle API requests and responses
Models: Define database schemas
Services: Contain business logic for sending notifications
Routes: Define API endpoints

Notifications flow through the system as follows:

Client sends a notification request
Request is validated and stored in MongoDB
Notification is queued in RabbitMQ
Worker processes pick up notifications from the queue
Notifications are sent via the appropriate channel (Email, SMS, In-App)
Status is updated in the database
Failed notifications are retried up to 3 times with increasing delay

Assumptions Made

For simplicity, the userId field is used as the email address or phone number for notifications
In a production environment, you would have a separate User service to look up contact information
The service assumes RabbitMQ and MongoDB are running locally
For in-app notifications, we're only storing them in the database (in production, you might use WebSockets)
Retries are limited to 3 attempts with increasing delays

Future Improvements

Add user authentication and authorization
Implement real-time notifications using WebSockets
Add batch processing for notifications
Create a notification template system
Add unit and integration tests
Add rate limiting to prevent abuse
Implement notification preferences per user

License
KIIT
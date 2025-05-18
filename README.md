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
RabbitMQ[

Installation

Clone the repository:
git clone https://github.com/yourusername/notification-service.git](https://github.com/rahul99-collab/notification--service)
cd notification-service

Install dependencies:
npm install

Create a .env file in the root directory with the following variables:
PORT=3000
MONGODB_URI=mongodb+srv://rahulkumarsahu2745:Mongodb18@cluster0.aboy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
EMAIL_USER=rahulkumarsahu2745@gmail.com
EMAIL_PASS=gghg dkrj dguy nluz
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=YOUR_TWILIO_ACCOUNT_SID
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
        "userId": "user123",
        "type": "EMAIL",
        "title": "Welcome to Notification Service",
        "content": "This is a test notification from our new service!",
        "status": "PENDING",
        "retryCount": 0,
        "_id": "6829f2c21e4c8eca3552cadf",
        "createdAt": "2025-05-18T14:46:26.105Z",
        "updatedAt": "2025-05-18T14:46:26.105Z",
        "__v": 0
  }
}
Get User Notifications
Endpoint: GET /users/{id}/notifications
Response:
json{
    "success": true,
    "count": 5,
    "data": [
        {
            "_id": "6829f2c21e4c8eca3552cadf",
            "userId": "user123",
            "type": "EMAIL",
            "title": "Welcome to Notification Service",
            "content": "This is a test notification from our new service!",
            "status": "SENT",
            "retryCount": 3,
            "createdAt": "2025-05-18T14:46:26.105Z",
            "updatedAt": "2025-05-18T14:47:03.172Z",
            "__v": 0
        },
        {
            "_id": "68295f3d9c16148eec121cfa",
            "userId": "user123",
            "type": "EMAIL",
            "title": "Welcome to Notification Service",
            "content": "This is a test notification from our new service!",
            "status": "SENT",
            "retryCount": 3,
            "createdAt": "2025-05-18T04:17:01.967Z",
            "updatedAt": "2025-05-18T04:17:32.405Z",
            "__v": 0
        },
        {
            "_id": "68295e5e78090487ccda56dd",
            "userId": "user123",
            "type": "EMAIL",
            "title": "Welcome to Notification Service",
            "content": "This is a test notification from our new service!",
            "status": "FAILED",
            "retryCount": 3,
            "createdAt": "2025-05-18T04:13:18.623Z",
            "updatedAt": "2025-05-18T04:13:53.772Z",
            "__v": 0
        },
        {
            "_id": "68295c2dfc82a3c81f4ef919",
            "userId": "user123",
            "type": "EMAIL",
            "title": "Welcome to Notification Service",
            "content": "This is a test notification from our new service!",
            "status": "SENT",
            "retryCount": 3,
            "createdAt": "2025-05-18T04:03:57.902Z",
            "updatedAt": "2025-05-18T04:04:33.675Z",
            "__v": 0
        },
        {
            "_id": "6828f6553554fdefb7fe198b",
            "userId": "user123",
            "type": "EMAIL",
            "title": "Welcome to Notification Service",
            "content": "This is a test notification from our new service!",
            "status": "SENT",
            "retryCount": 3,
            "createdAt": "2025-05-17T20:49:25.137Z",
            "updatedAt": "2025-05-17T20:50:01.025Z",
            "__v": 0
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

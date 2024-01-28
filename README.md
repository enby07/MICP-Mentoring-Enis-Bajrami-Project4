# Event Registration App

This is a simple event registration application built with Node.js, Express.js, Prisma, and Nodemailer.

## Features

- Create Events: Users can create events with a title, description, start date, end date, and number of available seats.
- Register Participants: Participants can register for events by providing their full name and email address.
- Email Notifications: Participants receive email notifications upon successful registration.
- Edit Event Details: Users can update event details including title, description, start date, end date, and available seats.
- Automated Event Expiry: Events are automatically deleted after they expire.

  
## SETUP
1. Clone the Repository:
   ```bash
     https://github.com/enby07/MICP-Mentoring-Enis-Bajrami-Project4.git
   ```
   
3. Install Dependencies
   ```bash
     cd MICP-Mentoring-Enis-Bajrami-Project4
     npm install
   ```
   
5. Set Environment Variables
   Create a .env file in the root directory and add the following variables:
   Database connection URL (*NOTE: ADD YOUR OWN DATABASE CONNECTION)`
   ```bash
     DATABASE_URL="mysql://username:password@localhost:5432/event_registration"
   ```
  
    SMTP Email Configuration (*NOTE: ADD YOUR OWN SMTP EMAIL CONFIGURATION. GET FREE FROM SITE: https://ethereal.email/)
    ```bash
       host: 'smtp.ethereal.email',
        port: 587,
        auth: {
           user: 'regan.turcotte@ethereal.email',
            pass: 'HzVnT9ew3YrS2ChUYJ'
           }
    ```
7. Run the database migrations to create tables in your database:
   ```bash
       npx prisma migrate dev --name init
   ```

9. Start the Server
   ```bash
     npm start
   ```

11. Access the Application
    The application should now be running at http://localhost:3000.`
---------------------------------------------------------------------------------

**API Endpoints**

    POST /events: Create a new event.
    POST /events/:eventId/register: Register a participant for an event.
    PUT /events/:eventId: Update event details.
    GET /events: Get all events.
    GET /events/:eventId: Get details of a specific event.

**Directory Structure**

    app.js: Main entry point of the application.
    schema.prisma: Prisma schema defining database models and relationships.
    routes/: Contains route handlers for various endpoints.
    controllers/: Controllers handling business logic for routes.
    models/: Prisma model files representing database tables.
    middlewares/: Custom middleware functions.
    utils/: Utility functions.
    config/: Configuration files.

**Dependencies**

    Express.js: Web application framework.
    Prisma: Database toolkit.
    Nodemailer: Email sending library.



   

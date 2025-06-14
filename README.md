Collaborative Form Builder
A real-time collaborative form system, similar to Google Docs, but for structured forms. Admins can create dynamic forms, and multiple users can collaboratively fill out one shared response in real time.

Features

Admins can:
    * Create forms with dynamic fields (text, number, dropdown)

    * Share form links with collaborators

Users can:
    * Join a form in real time

    * Collaboratively edit a single shared response

    * See live updates as others type

    * Lock fields to prevent conflicting edits

Admin Panel:

    * View all responses to a form

    * Clear submissions for reuse

Technologies Used
    Frontend: HTML, CSS, Vanilla JavaScript
    Backend: Node.js, Express
    Database: PostgreSQL
    : Socket.IO
    Deployment: Render (backend)
    Testing: Postman

Database Schema

forms(id, title)
fields(id, form_id, label, type, options)
responses(id, form_id)
field_responses(id, response_id, field_id, value, locked_by, locked_at)

Setup Instructions

    Clone the repository

        git clone https://github.com/eerhsagol/Collab-Form.git
        cd collab-form

    Install dependencies

        npm install
    
    Set up environment variables

        Create a .env file:

            PORT=3000
            DATABASE_URL=your_postgres_connection_string
    
    Set up the database

        Run the following SQL to create tables:

            CREATE TABLE forms (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL
            );

            CREATE TABLE fields (
            id SERIAL PRIMARY KEY,
            form_id INTEGER REFERENCES forms(id),
            label TEXT NOT NULL,
            type TEXT NOT NULL,
            options TEXT
            );

            CREATE TABLE responses (
            id SERIAL PRIMARY KEY,
            form_id INTEGER REFERENCES forms(id)
            );

            CREATE TABLE field_responses (
            id SERIAL PRIMARY KEY,
            response_id INTEGER REFERENCES responses(id),
            field_id INTEGER REFERENCES fields(id),
            value TEXT,
            locked_by TEXT,
            locked_at TIMESTAMP
            );

    Start the server

        npm start


API Endpoints
Base URL: http://localhost:3000/api

Create Form
POST /forms
Creates a new form with dynamic fields.

Example body:


{
  "title": "Internship Test Form",
  "fields": [
    { "label": "Name", "type": "text" },
    { "label": "Email", "type": "text" },
    { "label": "Gender", "type": "dropdown", "options": "Male,Female,Other" }
  ]
}
Get Form Details
GET /forms/:id
Fetch form and its fields.

Start a Response
POST /forms/:formId/start
Creates a new response row.

View All Responses
GET /forms/:formId/responses
Returns all response data grouped by response ID.

Clear Responses
DELETE /forms/:formId/responses
Deletes all user submissions for the given form.

Socket.IO Events
join_form: Subscribe to a form room

update_field: Send fieldId, value, and responseId

field_updated: Receive updates for field values in real-time

lock_field: Prevent others from editing the same field

Folder Structure


collab-form/
├── routes/
│   └── formRoutes.js
├── sockets/
│   └── socketHandler.js
├── db.js
├── index.js
├── frontend/
│   ├── index.html
│   └── view.html
└── .env
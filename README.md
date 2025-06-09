# Expense Management

A Node.js service for Expense Management.

## Features included

- Middlewares to check authenticity of incoming API requets
- APIs to handle incoming events

## Tech Stacks used

- Node.js (>=18)
- JavaScript
- Express.js
- PostgreSQL with Sequelize ORM

### Tools needed

- Node.js 18 or higher
- PostgreSQL

### Inital Setup

1. Clone the repository - git clone https://github.com/IAMRAVIRAJESH/PiSync.git and move to main directory using the command "cd PISYNC".

2. Install dependencies - run "npm install"

3. Set up environment variables - Create and edit .env file with your database configuration at the root (current directory) location.

4. Start the server and sync database - "npm run dev". This command will run the server and synchronize the database with models, associations, relations and anything that is described in the model files.

5. Use the query.sql file inside query folder of src and run on pgAdmin so it will create few entries for testing and then change the ids in the postman request according to your id in the db for hitiing APIs.

6. For knowledge I have created necessary tables with proper columns and associations between them, you can check the models folder for the same.

7. If you face any difficulty in syncing the database then please changed the value of force to true on line number 6 in index.js file inside Models folder, but remember it will erase all the data from database which you are syncing.


## API Endpoints

BASE_URL = http://localhost:3000/api/piSync

- POST BASE_URL/sync-event → to receive a sync event.
- GET BASE_URL/device/:id/sync-history → to view sync logs of a device.
- GET BASE_URL/devices/repeated-failures → to list devices with more than 3 failed syncs.

# API testing

- For testing the APIs you can use the postman collection I have added to this project with filename PiSync
====================================
SETUP
====================================
Install Node.js and npm on your machine
Navigate to /server and /client and run $ npm install in both directories to install all the required dependencies for  both the frontend and backend

====================================
SERVER
====================================
to run the backend server REST API
navigate to: /server
run: $ npm start
or run (debugging): $ nodemon server.js

By default your server will run on localhost:3000

The following API endpoints exist for Authentication (i.e., registration and login):
POST [localhost:3000]/api/auth/register  (expects: email, password, firstName, lastName)
POST [localhost:3000]/api/auth/login     (expects: email, password)

The following API endpoints exist for Users:
GET [localhost:3000]/api/users/[:userId]  (requires JWT authentication token)
GET [localhost:3000]/api/users            (requires admin user and JWT authentication token)

Make sure your MongoDB database is configured. To fire up a local MongoDB use: $ mongod
Configure your DB in /server/config/main.js

====================================
CLIENT
====================================
to run the React/Redux frontend
navigate to: /client
run: $ npm start
make sure everything compiles correctly. Don't upgrade dependencies to new versions unless you're ready to refactor code.

By default your frontend React client will run at: localhost:8080
Configure your API_URL and CLIENT_ROOT_URL (i.e., the base URL of your React client) in: /client/src/actions/index.js
By default API_URL is set to: localhost:3000 and CLIENT_ROOT_URL is set to localhost:8080

# QoverExercice

Simple exercice for Qover insureTech.

# You have to create a .env file and complete all variable with you information. A .env.example is given. All variable are required.

    PORT=
    JWT_SECRET=
    DB_USERNAME=
    DB_PASSWORD=
    DB_URL=
    DB_URL_START=
    USERS_COLLECTION=
    CARS_COLLECTION=
    QUOTES_COLLECTION=
    MAIL_SERVICE=
    MAIL_USER=
    MAIL_PASS=

# First start install all dependencies : 
    
    npm install

# How to run :

    npm start  'or'  node main.js

# Use app :

  - Open browser
  - Go to localhost:PORT
  - Authenticate with login : password
 
# Routes :

    '!!' All routes need authenticate token that is available only one 1hour for the session.
    '!!' If error in token or in route parameter, error is send :
          {
            message: message || 'Error happend !',
            error: 400,
            request,
          }

# /login/:username/:password
    Request to authenticate, the user must be in Database
    username : login user
    password : password user
    
# /cars/:token
    Get list of cars
    token : authenticate token
  
# /quote/:name/:car/:value/:username/:token
    Create a quote
    name : name driver
    car : vrabd of car
    value : value of car with VAT
    username : login of user
    token : authenticate token
    
# /
    Get index

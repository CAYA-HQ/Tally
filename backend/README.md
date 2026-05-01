# Tally - Backend DB 
- DATABASE
    • The db used is mongoDB, using mongoose
    • The server used is bun and expressJS
    • The db connection is created in config/db.ts
    • The entry point is index.ts 

- API ROUTES
    • The routes are made in routes/userRouter.ts, where each route is defined with either post, put, or get
    • The routes/api.ts defines the second layer of the route, using /user
    • The index.ts defines the first layer of the route using /api, making the route to look like this
    api/user, or api/user/:id, depending if it is a post, put, or get request, it will go to a particular route

- CONTROLLER
    • The controllers carries out the http request sent via the route, this is done in controllers/user.controller.ts 

- UTILS 
    • This contains utility functions so as to avoid repetition.
    • For async function utils/asyncHsndler
    • For error handling, utils/errorHandler.ts
    • For haandling validation and error of frontend data in req.body, utils/validate.middleware.ts 

- VALIDATION 
    • To validate user data, i used 3 layers of validations
    • First is mongoose inbuilt validation in model/User.this
    • Second is zod in model/validate.user.ts 
    • Third is the utils/validate.middleware.ts that validates the req.body before it is being passed to the schema

- DOTENV
   • The .env is used to manage every enviroment variable 

# Docker Container
- We use this to set up a uniform backend, so that all stack are in the same version, and containerized.
- Install docker desktop from app store or web
- Start the docker desktop
- Install git(i believe this is already done)
- In terminal, cd to backend, run bun Install to install dependencies
- Run deocker compose up --build
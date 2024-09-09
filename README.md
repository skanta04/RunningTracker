## Overview
This API allows users to:
- Create new workouts (one at a time or multiple)
- Retrieve workouts with specified filters such as a singular date, date range, or run type
- Perform aggregations on workout data, such as total distance per week/month or average duration

## Design Decisions
- Simple and Intuitive API Design: This follows RESTful principles for an intuitive and easily consumable API. MOreover, the naming conventions of each API and show accurate describe what the API will do
- Flexible Querying:  The API supports optional filtering parameters (date, startDate, endDate, typeOfRun) that make it intuitive for users to retrieve data without complex logic.
- Validation and Error Handling: I ensured that there was input validation (especially on the date format) and uniform error messages to improve the simplicity of understanding error or success messages, and overall improve the user experience
  
## Tech Stack
- NodeJS/Express: Used to build the RESTful API's
- MongoDB: the NoSQL database that stores the workout data
- Mongoose: the object data manager (ODM) for MongoDB that models teh workout data schema and perform the CRUD (create, read, update, delete) operations
  

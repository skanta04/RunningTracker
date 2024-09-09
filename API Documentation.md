# API Documentation

## 1. Create a Workout (Endpoint: ```POST /workouts```)

Description: This endpoint allows users to create a single workout or multiple workouts
### Request Body:
- Create one workout:
```json
{
    "name": "Afternoon Workout",
    "date": "2024-07-22",
    "duration": 60,
    "distance": 7.0,
    "heartRate": 140,
    "typeOfRun": "workout",
    "shoeType": "Brooks Ghost"
}
```
- Or multiple workouts at once:
```json
[{
    "name": "Afternoon Workout",
    "date": "2024-07-22",
    "duration": 60,
    "distance": 7.0,
    "heartRate": 140,
    "typeOfRun": "workout",
    "shoeType": "Brooks Ghost"
},
{
    "name": "Recovery Jog",
    "date": "2024-09-01",
    "duration": 40,
    "distance": 4.0,
    "heartRate": 110,
    "typeOfRun": "long run",
    "shoeType": "Asics"
}]
```
### Response:
- 201 Created (Success)
```json
{
    "success": true,
    "data": {
        "date": "2024-07-22T00:00:00.000Z",
        "duration": 60,
        "distance": 7,
        "heartRate": 140,
        "typeOfRun": "workout",
        "shoeType": "Brooks Ghost",
        "name": "Afternoon Workout",
        "_id": "66de42a7acec782f6c979b16",
        "__v": 0
    },
    "message": "Workout created successfully"
}
```
- 401 (Bad Request)
```json
{
  "success": false,
  "error": "Error creating workout",
  "details": "some error message"

}
```

## 2. Get Workouts with Optional Filters (Endpoint: ```GET /workouts```)

Description: Retrieve workouts based on optional filters such as ```date, startDate, endDate, and typeOfRun```

### Optional Query Parameters:
- ```date```: A date in YYYY-MM-DD format
- ```startDate```: The start date for filtering by date range
- ```endDate```: The end date for filtering by date range
- ```typeOfRun```: Filter by type of run (long run, race, workout)

### Example Request with Date Range and typeOfRun Query:
- 200 OK (Success)
```
GET workouts?typeOfRun=long run&startDate=2024-06-01&endDate=2024-09-01
```
```json
{
    "success": true,
    "data": [
        {
            "_id": "66de1ccb01c938f6c195baa5",
            "date": "2024-09-01T00:00:00.000Z",
            "duration": 40,
            "distance": 4,
            "heartRate": 110,
            "typeOfRun": "long run",
            "shoeType": "Asics",
            "name": "Recovery Jog",
            "__v": 0
        },
        {
            "_id": "66de1ccb01c938f6c195baa7",
            "date": "2024-06-11T00:00:00.000Z",
            "duration": 35,
            "distance": 3,
            "heartRate": 125,
            "typeOfRun": "long run",
            "shoeType": "Hoka Clifton",
            "name": "Casual Evening Jog",
            "__v": 0
        }
    ]
}
```
- 401 (Bad Request)
```
GET /workouts?typeOfRun=long run&startDate=2024-06-01&endDate=2024-09-8
```
```json
{
    "success": false,
    "error": "Invalid startDate or endDate format. Expected YYYY-MM-DD."
}
```

## 3. Get Total Distance Per Week (Endpoint: ```GET /workouts/distance-per-week```)
Description: Aggregates the total distance of workouts per week
### Response:
- 200 OK (Success)
```json
{
    "success": true,
    "data": [
        {
            "week": 23,
            "totalDistance": 3
        },
        {
            "week": 29,
            "totalDistance": 14
        },
        {
            "week": 32,
            "totalDistance": 3.5
        },
        {
            "week": 34,
            "totalDistance": 6.5
        },
        {
            "week": 35,
            "totalDistance": 19.2
        }
    ]
}
```
- 401 Bad Request (Error)
```json
{
  "success": false,
  "message": "Error aggregating total distance per week",
  "details": "Some error message"
}
```
## 4. Get Average Workout Duration (Endpoint: ```GET /workouts/average-duration```)
Description: Calcuates the average workout duration across all workouts.
### Response:
- 200 OK (Success)
```json
{
    "success": true,
    "data": [
        {
            "_id": null,
            "avgDuration": 46.111111111111114
        }
    ]
}
```
- 401 Bad Request (Error)
```json
{
  "success": false,
  "message": "Error calculating average duration",
  "details": "Some error message"
}
```
## 5. Get Total Distance Per Month (Endpoint: ```GET /workouts/distance-per-month```)
Descirption: Aggregates the total distance covered through workouts per month
### Response:
- 200 OK (Success)
```json
{
    "success": true,
    "data": [
        {
            "month": 6,
            "totalDistance": 3
        },
        {
            "month": 7,
            "totalDistance": 14
        },
        {
            "month": 8,
            "totalDistance": 10
        },
        {
            "month": 9,
            "totalDistance": 19.2
        }
    ]
}
```
- 401 Bad Request (Error)
```json
{
  "success": false,
  "message": "Error aggregating total distance per month",
  "details": "Some error message"
}
```


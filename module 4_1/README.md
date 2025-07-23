Technology restrictions

Node.js, Express.js, CORS, Joi

Task

Implement input validation for an API using the Joi validation library. The validation should ensure that incoming requests to the API have the expected structure and data types and reject requests that do not meet the validation criteria.

Requirements:

- Create a simple express server.

- Create endpoint for sending Order details. Each of order fields should face validation rules:

- productId, [ObjectId]

- productName, [Nonempty string]

- productType, [one of predefined values via enum]

- quantity, [positive integer]

- currency, [one of enum values]

- orderedAt [valid date in format DD/MM/YYYY hh:mm]

- hasDiscount , [boolean validation]

- userId, [id of type uuid]

- Install the joi package and use it to define input validation scheme for endpoint. The scheme should describe the expected structure and data types of the input data, and validation rules that should be applied.

- Implement middleware that applies the validation schema to incoming requests. - The middleware should use the validation schema to validate the request body or query parameters and reject requests that do not meet the validation criteria.

- Test the API by sending requests with valid and invalid input data and verify that the validation is enforced.

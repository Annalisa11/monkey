# Custom Error Codes Documentation

This document describes all custom error classes used in the backend, their HTTP status codes, and when they are thrown.

## Error Classes

### CustomError (Base)

- **Status Code:** Custom (set by subclass)
- **Description:** Base class for all custom errors. Not thrown directly. All other custom errors inherit from this class.

### NotFoundError (404)

- **Status Code:** 404
- **Description:** The requested resource does not exist.
- **Usage:**
  - Thrown when a resource (e.g., monkey, location, route, journey, event) is not found in the database.
  - Example: `throw new NotFoundError('Monkey with id 5 not found')`

### ConflictError (409)

- **Status Code:** 409
- **Description:** The request could not be completed due to a conflict with the current state of the resource (e.g., duplicate entry).
- **Usage:**
  - Thrown when trying to create a resource that already exists (e.g., duplicate location or route).
  - Example: `throw new ConflictError('Location already exists')`

## Error Handling

- All errors thrown in services are passed to the error handler middleware via `next(error)` in controllers.
- The error handler middleware sends a JSON response with the appropriate HTTP status code and error message.
- If no custom error is thrown, the standard 500 "internal server error" is thrown as default

**Example error response:**

If an error occurs, the api will get a response like this:

```json
{
  "error": "Monkey with id 5 not found"
}
```

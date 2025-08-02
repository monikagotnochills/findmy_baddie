# API Documentation

## Overview
This document provides detailed information about the AI-Powered Roommate Matching Backend API endpoints.

## Authentication
Currently, the API does not require authentication. In production, consider implementing JWT or OAuth2.

## Base URL
```
http://localhost:5000/api/v1
```

## Response Format
All responses are in JSON format. Success responses include the requested data, while error responses include an error message.

Success Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

Error Response:
```json
{
  "error": "User not found"
}
```

## Endpoints

### Users API
[Detailed endpoint documentation would go here]

### Rooms API  
[Detailed endpoint documentation would go here]

### Matching API
[Detailed endpoint documentation would go here]

### Admin API
[Detailed endpoint documentation would go here]

### Omnidim Integration API
[Detailed endpoint documentation would go here]

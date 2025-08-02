import requests

# Dummy user data
user_data = {
    "name": "Alice Doe",
    "email": "alice@example.com",
    "phone": "9876543210",
    "age": 23
}

# Dummy survey responses
responses = {
    "cleanliness": "4",
    "sleep_schedule": "night owl",
    "work_hours": "flexible hours",
    "social": "introvert",
    "noise": "I don't mind noise"
}

# Payload with both user data and raw survey responses
payload = {
    "user_data": user_data,
    "responses": responses
}

# Send the request to your API
response = requests.post("http://localhost:8000/api/v1/omnidim/survey/submit", json=payload)

# Print the response
print("Status Code:", response.status_code)
print("Response JSON:", response.json())

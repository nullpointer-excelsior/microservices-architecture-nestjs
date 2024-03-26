#!/bin/bash


transactionId=$(curl -X 'POST' \
    'http://localhost:3021/purchases' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "customer": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "fullname": "John Doe",
        "email": "johndoe@example.com",
        "address": "123 Main St",
        "city": "New York",
        "country": "United States"
    },
    "lines": [
        {
            "sku": "ABC123",
            "quantity": 1,
            "unitPrice": 10800
        }
    ]
}' | jq '.transactionId' | sed 's/"//g')

clear

echo -e "\nTransaction ID: $transactionId\n"


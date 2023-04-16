# Test for semi senior position

Welcome to my microservices test

## Available Microservices:

In this test, we create three microservices

### 1. properties service

This service is called `properties` and allows users to get the properties that are available on the site. This service is exposed on port 4000

### 2. likes service

This service is called `likes` and allows users to like the properties queried on the `properties` services. This service is exposed on port 4001

### 3. interface service

This service is the interface for the frontend to work. It was not mandatory on the test request but it allows for an easier interaction with the backend services. This service is exposed on port 3000

## Setting up Env

a `.env.example` file has been included on each microservice, this contains the names of the required environment constants for this service to work.

## Running services with docker

In order to run all services at once, you'll need to build the containers first:

```
docker compose build
```

after built the containers can be run by running the command:
```
docker compose up
```

## Running a single microservice

You can build and run a single microservice by running the command:
```
docker compose up [microservice_name]
```


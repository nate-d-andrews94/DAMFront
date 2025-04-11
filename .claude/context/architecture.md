# Project Architecture

## Core Principles
- RESTful API design using Express.js
- Model-View-Controller (MVC) pattern
- Service layer for business logic
- Repository pattern for data access

## Key Components
- Express.js server with middleware
- MongoDB database with Mongoose ODM
- Authentication using JWT
- Error handling middleware
- Request validation using Joi
- Logging with Winston

## Data Flow
1. Request → Router
2. Router → Controller
3. Controller → Service
4. Service → Model/Repository
5. Response ← Controller

## Code Organization
- Keep files under 300 lines
- One responsibility per module
- Each file should export a single primary function/class
- Controllers handle HTTP, Services handle business logic
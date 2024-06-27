# Express Authentication Server

This project is an Express.js application designed to handle user authentication, session management, and data storage with MongoDB. It provides a secure backend for web applications, specifically tailored for integration with a React frontend. The server handles user registration, login, session management, and stores user-generated text data securely.

## Features

- **User Registration and Login**: Securely register and authenticate users using bcrypt for password hashing.
- **Session Management**: Utilize `express-session` with `connect-mongo` for persistent session storage in MongoDB, ensuring users remain logged in across server restarts.
- **Secure Cookies**: Implement secure, HTTP-only cookies for session management, enhancing security by preventing client-side script access to cookies.
- **MongoDB Integration**: Use MongoDB for storing user details and session information, providing a scalable and flexible data storage solution.
- **CORS Configuration**: Setup CORS to allow requests from the specified frontend application, facilitating seamless integration with React or other frontend frameworks.
- **User Data Storage**: Provide endpoints for storing and retrieving user-generated text data, linking it to the authenticated user.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your machine.
- MongoDB setup either locally or a cloud instance.
- An environment file (`.env`) configured with your database URL, server port, and session cookie name.

## Installation

Follow these steps to get your development environment set up:

1. **Clone the repository**:
```bash
git clone https://github.com/DebmalyaSen1519/express-authentication-server.git
```

2. **Navigate to the project directory**:
```bash
cd express-authentication-server
```

3. **Install dependencies**:
```bash
npm install
```

4. **Set up the environment variables**:
Create a `.env` file in the root directory with the following variables:
```plaintext
DB_URL=mongodb://yourMongoDBUrl
PORT=yourPreferredPort
SESS_NAME=yourSessionCookieName
```

5. **Start the server**:
```bash
npm start
```

You should now be running and listening for requests on the specified port

## Usage

The server provides several endpoints for managing users and their data:

* `POST /register`: Register a new user
* `POST /login`: Authenticate a user and create a session.
* `POST /logout`: Log out a user and destroy their session.
* `GET /auth/status`: Check if a user is currently authenticated.
* `POST /userText`: Store text data for the authenticated user.
* `GET /texts`: Retrieve text data associated with the authenticated user.

## Contributing

Contributions to this project are welcome! To contribute, please fork the repository, create a new branch for your feature or fix, and submit a pull request.

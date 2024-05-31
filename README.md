**About Project:**

This repository contains Blackjack, Baccarat, Three card Poker games with both backend and frontend components. The backend is built using Node.js, Express, and MongoDB, while the frontend is developed using React. The game allows users to register, log in, choose and play game, keeping track of their wins, losses, ties, and balances.

**Project Structure**

The project is divided into two main folders: blackjack-game-backend and blackjack-game-frontend.

**Backend**

The backend folder contains the server code and the necessary models to interact with MongoDB.

 - models: Contains the Mongoose models.
 - node_modules: Contains the backend dependencies.
 - package.json: Lists the backend dependencies and scripts.
 - server.js: The main server file that handles API routes and database connections.


**API Endpoints**

The backend provides several API endpoints to manage user registration, login, and game statistics:

 - POST /api/users/register: Register a new user.
 - POST /api/users/login: Log in an existing user.
  -GET /api/users/:username: Get user details by username.
 - PUT /api/users/win/:username: Update win count and balance for a user.
 - PUT /api/users/loss/:username: Update loss count and balance for a user.
-  PUT /api/users/tie/:username: Update tie count for a user.

**Frontend**

The frontend folder contains the React application that provides the user interface for the game.

 - src: Contains the source code for the React application.
 - components: Contains the React components.
 - contexts: Contains the context providers for state management.
 - images: Contains the image assets.
 - App.js: The main application component.
 - App.test.js: The test file for the main application component.
- index.js: The entry point for the React application.
-  index.css: The main stylesheet.
-  logo.svg: The logo file.
-  reportWebVitals.js: Measures the performance of the application.
-  setupTests.js: Configures the testing environment.
-  public: Contains the static assets.
-  node_modules: Contains the frontend dependencies.
 - package.json: Lists the frontend dependencies and scripts.

**Installation**

To set up and run this project locally, follow these steps:
Clone the repository.

**Backend Setup -**

 - Navigate to the backend directory: cd blackjack-game-backend
 - Install the dependencies: npm install
  - Start the backend server: npm start
 - The backend server will run on http://localhost:5000/

**Frontend Setup -**

-  Navigate to the frontend directory: cd blackjack-game-frontend
-  Install the dependencies: npm install
 - Start the frontend development server: npm start
 - The frontend application will run on http://localhost:3000/.



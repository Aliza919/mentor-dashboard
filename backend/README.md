# Evaluation Backend

This project is a backend application for managing student evaluations and mentor states using Express and MongoDB. It provides a RESTful API for handling student data and their evaluation process.

## Project Structure

```
backend
├── .env                  # Environment variables for MongoDB connection and server port
├── package.json          # NPM configuration file with scripts and dependencies
├── src                   # Source code for the application
│   ├── index.js         # Entry point of the application
│   └── db               # Database connection and models
│       ├── db.js        # MongoDB connection setup
│       └── models       # Mongoose models for Student and MentorState
│           ├── student.model.js
│           └── mentorState.model.js
│   └── routes           # API routes for managing students
│       └── students.routes.js
├── scripts              # Scripts for database seeding
│   └── seed.js          # Script to seed the database with dummy student data
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account (for cloud database)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory and add your MongoDB connection string and desired port:
     ```
     MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/evaluation_db?retryWrites=true&w=majority
     PORT=4000
     ```

### Running the Application

- To seed the database with dummy student data (optional):
  ```
  npm run seed
  ```

- To start the server in development mode:
  ```
  npm run dev
  ```

- The server will be running at `http://localhost:4000`.

### API Endpoints

- **GET /api/students**: Retrieve the student pool.
- **GET /api/students/state**: Retrieve the current mentor state.
- **POST /api/students/:rollNumber/add**: Add a student to the selected list.
- **DELETE /api/students/:rollNumber/remove**: Remove a student from the selected list.
- **POST /api/students/activate**: Activate selected students.
- **PATCH /api/students/:rollNumber/marks**: Update marks for a student.
- **POST /api/students/:rollNumber/evaluated**: Mark a student as evaluated.
- **POST /api/students/finalize**: Finalize the evaluation process.

## License

This project is licensed under the MIT License.
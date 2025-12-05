# Urban Management System Web Development

This project is a web-based urban management system designed to handle incidents, user roles, and administrative tasks efficiently.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Yarn** (Package manager)
- **MongoDB** (Database)
- **Conda** (Optional for Python environments)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure the environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     MONGO_URI=mongodb://localhost:27017/urban_management
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Seed the database (optional):
   ```bash
   node seeder.js
   ```

5. Start the backend server:
   ```bash
   yarn start
   ```

The backend will run on `http://localhost:5000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure the environment variables:
   - Create a `.env` file in the `frontend` directory.
   - Add the following variables:
     ```env
     VITE_APP_API_BASE_URL=http://localhost:5000
     ```

4. Start the frontend development server:
   ```bash
   yarn start
   ```

The frontend will run on `http://localhost:3000`.

## Running the Project

1. Start the backend server:
   ```bash
   cd backend
   yarn start
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   yarn start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Troubleshooting

- **Backend not connecting to MongoDB**:
  Ensure MongoDB is running locally or update the `MONGO_URI` in the `.env` file.

- **Frontend API errors**:
  Verify the `VITE_APP_API_BASE_URL` in the frontend `.env` file matches the backend URL.

- **Port conflicts**:
  Change the `PORT` in the backend `.env` file or the frontend development server port in `vite.config.mjs`.

## Additional Notes

- Use `yarn` for package management to avoid compatibility issues.
- Ensure the `.env` files are properly configured for both backend and frontend.
- For production, configure environment variables and deploy the backend and frontend separately.

## License

This project is licensed under the MIT License.

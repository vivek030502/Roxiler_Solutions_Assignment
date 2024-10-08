# Transaction Dashboard

## Description

The **Transaction Dashboard** is a dynamic web application designed to allow users to view, search, filter, and analyze transactions for specific months. It offers a clean and responsive UI, allowing users to interact with transaction data in tabular format and visualize key metrics like total sales, sold items, and unsold items using charts. The application also allows users to filter data by months and search for specific transactions by title.

## Technologies Used

- **Frontend**:
  - React JS: For building the user interface.
  - Tailwind CSS: For styling and layout.
  - Axios: For making HTTP requests to the backend API.
  - Chart.js: For displaying transaction data in bar and pie charts.

- **Backend**:
  - Node.js: Server-side runtime environment.
  - Express.js: Web framework for creating APIs.
  - MongoDB: Database to store transaction data.
  - Mongoose: MongoDB object modeling for Node.js.

- **Other Tools**:
  - Visual Studio Code: Code editor.
  - Git: Version control.

## How to Run the Project

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js](https://nodejs.org/).
2. **MongoDB**: Make sure MongoDB is installed and running. You can download it from [MongoDB](https://www.mongodb.com/).

### Backend Setup

1. **Clone the repository**:

   ```bash
  git clone (https://github.com/vivek030502/Roxiler_Solutions_Assignment)
   ```

2. **Navigate to the backend directory**:

   ```bash
   cd Roxiler_Solutions_Assignment
   ```

3. **Install the backend dependencies**:

   ```bash
   npm install
   ```

4. **Create an `.env` file in the root of the backend directory and add your MongoDB connection string**:

   Example `.env` file:
   
   ```env
   MONGO_URI=mongodb://localhost:27017/transactionDB
   PORT=5000
   ```

5. **Seed the database** (Optional):
   You can use a script or manually insert initial data into MongoDB. Refer to the backend API for more.

6. **Start the backend server**:

   ```bash
   node index.js
   ```

   The server will run at `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install the frontend dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend development server**:

   ```bash
   npm start
   ```

   The app will run at `http://localhost:3000`.

### Libraries You Need to Import

- **Frontend (client)**:
  - React: Core library for building the user interface.
  - Axios: To make HTTP requests.
  - Tailwind CSS: For styling.
  - Chart.js: For creating bar and pie charts.

- **Backend (server)**:
  - Express: For building the API server.
  - Mongoose: For connecting and querying MongoDB.
  - dotenv: For managing environment variables.

These libraries are installed automatically when you run `npm install` in the respective directories.

### How to Connect Database

1. **MongoDB Setup**:
   - Install and run MongoDB locally, or use a cloud service like MongoDB Atlas.
   - Copy your MongoDB connection string.
   
2. **Update `.env` file**:
   - In the backend, create a `.env` file in the root directory.
   - Add the MongoDB connection string to the `MONGO_URI` environment variable.
   
   Example `.env`:
   
   ```env
   MONGO_URI=mongodb://localhost:27017/transactionDB
   PORT=5000
   ```

3. **Verify Database Connection**:
   - Once your backend server is running (`npm start`), check the console output for a message indicating a successful connection to MongoDB.

### API Endpoints to Request

The following API endpoints are exposed by the backend and are consumed by the frontend:

- **Get all transactions for a specific month**:
  
  ```bash
  GET /api/transactions?month={month}
  ```

  - **Description**: Retrieves all transactions for the specified month, along with the total sales, sold items, and unsold items.
  - **Query Parameters**: 
    - `month`: (Optional) The month to filter transactions (e.g., January = 1, February = 2, etc.). If not provided, returns all transactions.

- **Search transactions by title**:
  
  ```bash
  GET /api/transactions/search?title={title}
  ```

  - **Description**: Filters transactions based on the `title` query.
  - **Query Parameters**: 
    - `title`: The title to search for in the transactions.

- **Initialize Data (Optional)**:

  ```bash
  GET /api/initialize
  ```

  - **Description**: Seeds the database with initial transaction data. Use this to populate the database initially.

### How to Verify Project is Running

1. **Backend Verification**:
   - Once the backend server is running, you can verify the API is working by sending a GET request to `http://localhost:5000/api/transactions` using Postman or any browser.

2. **Frontend Verification**:
   - After starting the frontend development server, visit `http://localhost:3000` in your browser.
   - Select a month from the dropdown, and the transaction table should populate with data from the backend.
   - The charts and statistics should also update according to the data.

### Other Essential Points

- **Handling Errors**: Ensure that error handling is in place for both the backend and frontend. If the API fails, you should see error messages in the console.
  
- **Responsiveness**: The app is fully responsive, using Tailwind CSS. Test the application on different screen sizes to verify that the layout adjusts accordingly.

- **Customization**: If you want to customize the appearance, you can edit the Tailwind CSS classes in the `src/styles` or `src/components` files.

---

## License

This project is licensed under the MIT License.

## Acknowledgements

- React documentation: [React Docs](https://reactjs.org/docs/getting-started.html)
- Tailwind CSS documentation: [Tailwind Docs](https://tailwindcss.com/docs)
- Chart.js documentation: [Chart.js Docs](https://www.chartjs.org/docs/latest/)

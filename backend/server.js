import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Import cors

import connectToMongoDB from './src/config/dbConnect.js';
import router from './src/routers/user.routers.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// // Define CORS options
const corsOptions = {
     origin: 'http://localhost:5173',  // Only allow requests from this origin
     allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
     credentials: true,  // Allow cookies to be sent with the request
  };

// Apply CORS middleware with options
  app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log("Server is running...");
});

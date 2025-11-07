import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
 .catch(err => console.error('MongoDB connection error:', err));

// Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
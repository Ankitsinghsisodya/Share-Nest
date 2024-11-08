import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://AnkitSingh:ankit7667@cluster0.entty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);  // Removed deprecated options
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

export default connectMongoDB;
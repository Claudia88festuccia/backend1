import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);


        console.log("Connesso a MongoDB");
        mongoose.connection.on('connected', () => {
            console.log('Connesso a MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Errore di connessione a MongoDB:', err);
        });

    } catch (error) {
        console.log("Errore di connessione a MongoDB:", error);
    }
}

export default connectDB;

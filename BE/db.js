import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connesso a MongoDB");

        mongoose.connection.on('connected', () => {
            console.log('Connesso a MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Errore di connessione a MongoDB:', err);
            process.exit(1);  // Termina il processo se la connessione fallisce
        });

    } catch (error) {
        console.error("Errore di connessione a MongoDB:", error);
        process.exit(1);  // Termina il processo se la connessione fallisce
    }
}

export default connectDB;


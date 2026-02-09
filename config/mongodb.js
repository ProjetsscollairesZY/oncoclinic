import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Récupère l'URI depuis les variables d'environnement
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MongoDB URI non défini dans les variables d'environnement");
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Timeout après 5 secondes
        });

        console.log("✅ Connecté à MongoDB - Base:", mongoose.connection.db.databaseName);

        const collections = await mongoose.connection.db.listCollections({ name: 'doctors' }).toArray();

        if (collections.length === 0) {
            await mongoose.connection.db.createCollection('doctors');
            console.log("✅ Collection 'doctors' créée");
        }
    } catch (error) {
        console.error("❌ Échec de connexion MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;

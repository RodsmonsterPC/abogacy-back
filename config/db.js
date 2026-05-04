const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,           // mantiene hasta 10 conexiones reutilizables
      serverSelectionTimeoutMS: 5000,  // falla rápido si Atlas no responde
      socketTimeoutMS: 45000,   // cierra sockets inactivos
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

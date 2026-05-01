/**
 * Seed Script — Crea el admin desde las variables del .env
 * Uso: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      console.log(`ℹ️  El admin "${process.env.ADMIN_EMAIL}" ya existe. No se creó uno nuevo.`);
      process.exit(0);
    }

    await User.create({
      name:     process.env.ADMIN_NAME,
      email:    process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role:     'admin',
    });

    console.log('\n🎉 Admin creado exitosamente:');
    console.log(`   Nombre: ${process.env.ADMIN_NAME}`);
    console.log(`   Email:  ${process.env.ADMIN_EMAIL}`);
    console.log(`   Pass:   ${process.env.ADMIN_PASSWORD}`);
    console.log('\n👉 Inicia sesión en: http://localhost:5173/dashboard/login\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();

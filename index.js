require("dotenv").config(); // .env dosyasını yükle
const client = require("./bot"); // bot.js dosyasını çağır ve client'ı yükle

// Global hata yönetimi
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// Bot'u çalıştır ve Discord'a bağlan
client.login(process.env.BOT_TOKEN);

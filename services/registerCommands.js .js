const { REST, Routes } = require("discord.js");
const { token, clientId } = require("../config/config.js");
const fs = require("fs");
const path = require("path");

const commands = [];

// commands klasöründeki komut dosyalarını oku
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Tüm komutları commands dizisine ekle
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.data.name) {
    commands.push(command.data.toJSON());
  }
}

// Discord API'ye komutları global olarak kaydet
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Global komutlar güncelleniyor...");
    await rest.put(
      Routes.applicationCommands(clientId), // Global komut kaydı
      { body: commands }
    );
    console.log("Global komutlar başarıyla güncellendi.");
  } catch (error) {
    console.error("Komutlar güncellenirken bir hata oluştu:", error);
  }
})();

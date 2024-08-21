const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const { token, clientId } = require("./config.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates, // Ses durumu güncellemeleri için gerekli
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Komutlar koleksiyonu
client.commands = new Collection();

// 'commands' klasöründeki tüm komut dosyalarını yükle
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (!command.data || !command.data.name) {
    console.error(`Hata: ${filePath} - Komut data veya name eksik!`);
    continue; // Bu komutu yüklemeyi atla
  }
  client.commands.set(command.data.name, command);
}

// Slash komutlarını kaydet
const commands = client.commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Komutlar güncelleniyor...");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Slash komutları başarıyla güncellendi.");
  } catch (error) {
    console.error("Komutlar güncellenirken bir hata oluştu:", error);
  }
})();

client.once("ready", () => {
  console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("Komut çalıştırılırken bir hata oluştu:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Bu komutu çalıştırırken bir hata oluştu!",
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "Bu komutu çalıştırırken bir hata oluştu!",
        ephemeral: true,
      });
    }
  }
});

// `voiceStateUpdate` olayını dinleyin
client.on("voiceStateUpdate", (oldState, newState) => {
  const { activeVoiceChannels } = require("./commands/vc-delete");

  // Eğer kullanıcı bir kanaldan çıkıyorsa veya yeni bir kanala katılıyorsa
  if (oldState.channelId !== newState.channelId) {
    // Eski kanalı kontrol edin
    if (oldState.channelId) {
      const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);
      if (oldChannel && activeVoiceChannels.has(oldState.member.id)) {
        console.log(
          `User left channel ${oldChannel.name}. Members: ${oldChannel.members.size}`
        );
      }
    }

    // Yeni kanalı kontrol edin
    if (newState.channelId) {
      const newChannel = newState.guild.channels.cache.get(newState.channelId);
      if (newChannel && activeVoiceChannels.has(newState.member.id)) {
        console.log(
          `User joined channel ${newChannel.name}. Members: ${newChannel.members.size}`
        );
      }
    }
  }
});

// Global hata yönetimi
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

client.login(token);

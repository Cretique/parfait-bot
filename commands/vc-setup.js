const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(__dirname, "config.json");

let setupConfig = {
  categoryId: null,
  requiredVoiceChannelId: null,
};

// Ayarları dosyaya kaydet
function saveConfig() {
  fs.writeFileSync(configFilePath, JSON.stringify(setupConfig, null, 2));
}

// Ayarları dosyadan oku
function loadConfig() {
  if (fs.existsSync(configFilePath)) {
    const data = fs.readFileSync(configFilePath, "utf8");
    setupConfig = JSON.parse(data);
  }
}

// Bot başlatıldığında ayarları yükle
loadConfig();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc-setup")
    .setDescription(
      "Sets up the category and required voice channel for private voice channels (Admin only)."
    )
    .addStringOption((option) =>
      option
        .setName("categoryid")
        .setDescription(
          "The ID of the category where the private voice channels should be created."
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("voicechannelid")
        .setDescription(
          "The ID of the voice channel users must join before creating a private channel."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
        return;
      }

      const categoryId = interaction.options.getString("categoryid");
      const voiceChannelId = interaction.options.getString("voicechannelid");

      // Kategori ve ses kanalı ID'lerini ayarla
      setupConfig.categoryId = categoryId;
      setupConfig.requiredVoiceChannelId = voiceChannelId;

      // Ayarları dosyaya kaydet
      saveConfig();

      await interaction.reply({
        content: `Setup complete. Private voice channels will be created under category ID: ${categoryId} and users must join voice channel ID: ${voiceChannelId} before creating one.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error in vc-setup command:", error);
      await interaction.reply({
        content:
          "There was an error while setting up the voice channel configuration.",
        ephemeral: true,
      });
    }
  },
  setupConfig, // Config settings to be accessed by other commands
};

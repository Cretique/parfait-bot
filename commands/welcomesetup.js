const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcomesetup")
    .setDescription(
      "Hoş geldin mesajlarının gönderileceği kanalı ve otomatik rol ayarlar."
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Hoş geldin mesajlarının gönderileceği kanal")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Yeni üyelere otomatik olarak verilecek rol")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content:
          "Bu komutu kullanmak için yönetici yetkisine sahip olmalısınız.",
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel("channel");
    const role = interaction.options.getRole("role");

    if (!channel) {
      return interaction.reply({
        content: "Geçerli bir kanal seçmelisiniz.",
        ephemeral: true,
      });
    }

    if (!role) {
      return interaction.reply({
        content: "Geçerli bir rol seçmelisiniz.",
        ephemeral: true,
      });
    }

    const guildId = interaction.guild.id;

    const configPath = path.join(__dirname, "../config/config.json");
    let config;

    try {
      if (!fs.existsSync(configPath)) {
        config = { servers: {} };
      } else {
        config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      }
    } catch (err) {
      console.error("Yapılandırma dosyası okunurken bir hata oluştu:", err);
      config = { servers: {} };
    }

    if (!config.servers) config.servers = {};
    config.servers[guildId] = {
      welcomeChannelId: channel.id,
      autoRoleId: role.id,
    };

    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      await interaction.reply(
        `Hoş geldin kanalı ${channel} ve otomatik rol ${role} olarak ayarlandı.`
      );
    } catch (err) {
      console.error("Yapılandırma dosyası yazılırken bir hata oluştu:", err);
      return interaction.reply({
        content: "Ayarlar kaydedilemedi. Lütfen daha sonra tekrar deneyin.",
        ephemeral: true,
      });
    }
  },
};

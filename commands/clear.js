const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Belirtilen sayıda mesajı siler.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Silmek istediğiniz mesaj sayısı")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Kullanıcının mesaj silme yetkisine sahip olup olmadığını kontrol edelim
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "Mesajları silme yetkiniz yok.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("amount");

    // Eğer miktar 1 ile 100 arasında değilse, hata ver
    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "Lütfen 1 ile 100 arasında bir sayı girin.",
        ephemeral: true,
      });
    }

    try {
      // Belirtilen miktarda mesajı sil
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `${amount} mesaj başarıyla silindi!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Mesajlar silinirken bir hata oluştu:", error);
      await interaction.reply({
        content: "Mesajlar silinirken bir hata oluştu.",
        ephemeral: true,
      });
    }
  },
};

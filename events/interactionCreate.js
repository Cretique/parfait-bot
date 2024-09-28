module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
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
  },
};

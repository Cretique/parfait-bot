const { SlashCommandBuilder } = require("discord.js");
const { activeVoiceChannels } = require("./vc-delete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc-rename")
    .setDescription("Renames your private voice channel.")
    .addStringOption((option) =>
      option
        .setName("newname")
        .setDescription("The new name for your voice channel.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const member = interaction.member;
      const newName = interaction.options.getString("newname");
      const channelInfo = activeVoiceChannels.get(member.id);

      if (!channelInfo) {
        return interaction.reply({
          content: "You do not have an active private voice channel.",
          ephemeral: true,
        });
      }

      const channel = interaction.guild.channels.cache.get(channelInfo.id);

      if (channel) {
        await channel.setName(newName);
        await interaction.reply({
          content: `Your voice channel has been renamed to: ${newName}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Your private voice channel could not be found.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error in vc-rename command:", error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "There was an error while renaming your voice channel.",
          ephemeral: true,
        });
      }
    }
  },
};

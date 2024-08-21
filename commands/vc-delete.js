const { SlashCommandBuilder, ChannelType } = require("discord.js");

// `activeVoiceChannels` haritasını burada tanımlayın
const activeVoiceChannels = new Map();

function startVoiceChannelCleaner(guild) {
  setInterval(async () => {
    for (const [memberId, { id: channelId, counter }] of activeVoiceChannels) {
      const channel = guild.channels.cache.get(channelId);
      if (channel && channel.type === ChannelType.GuildVoice) {
        const newCounter = channel.members.size;
        if (newCounter === 0 && counter > 0) {
          console.log(
            `Channel ${channel.name} is empty now. Deleting the channel.`
          );
          activeVoiceChannels.delete(memberId);
          await channel.delete();
          console.log(`Deleted empty voice channel: ${channel.name}`);
        } else {
          activeVoiceChannels.set(memberId, {
            id: channelId,
            counter: newCounter,
          });
          console.log(`Channel ${channel.name} has ${newCounter} members now.`);
        }
      }
    }
  }, 10000); // 10 saniyede bir kontrol et
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc-delete")
    .setDescription("Deletes your private voice channel."),
  async execute(interaction) {
    try {
      const member = interaction.member;
      const channelInfo = activeVoiceChannels.get(member.id);

      if (!channelInfo) {
        return interaction.reply({
          content: "You do not have an active private voice channel.",
          ephemeral: true,
        });
      }

      const channel = interaction.guild.channels.cache.get(channelInfo.id);

      if (channel) {
        await channel.delete();
        activeVoiceChannels.delete(member.id);
        await interaction.reply({
          content: "Your private voice channel has been deleted.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Could not find your private voice channel.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error in vc-delete command:", error);
      await interaction.reply({
        content: "There was an error while deleting your voice channel.",
        ephemeral: true,
      });
    }
  },
  activeVoiceChannels,
  startVoiceChannelCleaner,
};

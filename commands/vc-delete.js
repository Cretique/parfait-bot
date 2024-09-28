const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { setupConfig } = require("./vc-setup");

const activeVoiceChannels = new Map();

function setupVoiceChannelCleaner(client) {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (
      oldState.channelId &&
      (!newState.channelId || newState.channelId !== oldState.channelId)
    ) {
      const channel = oldState.channel;
      if (!channel) return;

      // Setup kanalını kontrol et
      const guildSetup = setupConfig.servers[oldState.guild.id];
      if (guildSetup && channel.id === guildSetup.requiredVoiceChannelId) {
        console.log(`Skipping deletion for setup channel: ${channel.name}`);
        return; // Setup kanalıysa silme işlemini atla
      }

      // Kanalın özel oluşturulmuş bir kanal olup olmadığını kontrol et
      const isCustomChannel =
        activeVoiceChannels.has(channel.id) ||
        Array.from(activeVoiceChannels.values()).some(
          (vc) => vc.id === channel.id
        );
      if (!isCustomChannel) {
        console.log(
          `Skipping deletion for non-custom channel: ${channel.name}`
        );
        return; // Özel oluşturulmuş bir kanal değilse silme işlemini atla
      }

      if (channel.members.size === 0) {
        console.log(`Channel ${channel.name} is empty. Initiating deletion...`);

        if (!channel.guild.members.me.permissions.has("ManageChannels")) {
          console.log(
            "Bot doesn't have permission to manage channels. Deletion aborted."
          );
          return;
        }

        try {
          await channel.delete(`Channel deleted due to inactivity.`);
          console.log(`Empty channel deleted: ${channel.name}`);

          // Her iki Map girişini de temizle
          activeVoiceChannels.delete(channel.id);
          for (const [userId, vc] of activeVoiceChannels.entries()) {
            if (vc.id === channel.id) {
              activeVoiceChannels.delete(userId);
              break;
            }
          }
        } catch (error) {
          console.error(
            `Error deleting channel ${channel.name}: ${error.message}`
          );
        }
      }
    }
  });

  console.log("Voice channel cleaner set up successfully.");
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
        await channel.delete(`Requested by ${member.user.tag}`);
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
  setupVoiceChannelCleaner,
};

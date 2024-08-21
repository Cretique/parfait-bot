const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const { setupConfig } = require("./vc-setup");
const {
  activeVoiceChannels,
  startVoiceChannelCleaner,
} = require("./vc-delete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc-create")
    .setDescription("Creates a private voice channel for you."),
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const member = interaction.member;

      if (!setupConfig.categoryId || !setupConfig.requiredVoiceChannelId) {
        await interaction.reply({
          content:
            "The voice channel setup has not been completed by an admin. Please contact an admin.",
          ephemeral: true,
        });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniye gecikme

      const voiceState = guild.voiceStates.cache.get(member.id);

      if (!voiceState) {
        await interaction.reply({
          content: "Unable to fetch your voice state. Please try again.",
          ephemeral: true,
        });
        return;
      }

      console.log(
        "Required Voice Channel ID:",
        setupConfig.requiredVoiceChannelId
      );
      console.log(
        "User's Current Voice Channel ID:",
        voiceState.channelId ? voiceState.channelId : "None"
      );

      if (
        !voiceState.channelId ||
        voiceState.channelId !== setupConfig.requiredVoiceChannelId
      ) {
        await interaction.reply({
          content: `You must be in the required voice channel to create a private channel.`,
          ephemeral: true,
        });
        return;
      }

      if (activeVoiceChannels.has(member.id)) {
        const existingChannelId = activeVoiceChannels.get(member.id).id;
        const existingChannel = guild.channels.cache.get(existingChannelId);

        if (existingChannel) {
          await interaction.reply({
            content: `You already have an active private voice channel: ${existingChannel.name}.`,
            ephemeral: true,
          });
          return;
        } else {
          activeVoiceChannels.delete(member.id);
        }
      }

      const channel = await guild.channels.create({
        name: `『 ${member.user.username}'s Voice Channel 』`,
        type: ChannelType.GuildVoice,
        parent: setupConfig.categoryId,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
            ],
          },
          {
            id: member.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageRoles,
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.DeafenMembers,
              PermissionsBitField.Flags.MoveMembers,
            ],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.ManageRoles,
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.DeafenMembers,
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.ManageWebhooks,
            ],
          },
        ],
      });

      // Kanalı aktif kanallar listesine ekle ve sayacı başlat
      activeVoiceChannels.set(member.id, { id: channel.id, counter: 0 });

      // Kullanıcıyı otomatik olarak yeni kanala taşı
      await member.voice.setChannel(channel);
      await interaction.reply({
        content: `Your private voice channel has been created and you have been moved to it: ${channel.name}.`,
        ephemeral: true,
      });

      // Ses kanalını otomatik temizleme işlemi için kontrol başlat
      startVoiceChannelCleaner(guild);
    } catch (error) {
      console.error("Error in vc-create command:", error);
      await interaction.reply({
        content:
          "There was an error while creating your private voice channel.",
        ephemeral: true,
      });
    }
  },
};

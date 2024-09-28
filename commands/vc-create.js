const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const { setupConfig } = require("./vc-setup");
const { activeVoiceChannels } = require("./vc-delete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc-create")
    .setDescription("Creates a private voice channel for you."),
  async execute(interaction) {
    try {
      const { guild, member } = interaction;
      const guildId = guild.id;

      // Check server setup
      if (!setupConfig.servers?.[guildId]) {
        return await interaction.reply({
          content:
            "Voice channel setup is not complete for this server. Please contact an admin.",
          ephemeral: true,
        });
      }

      const { categoryId, requiredVoiceChannelId } =
        setupConfig.servers[guildId];

      if (!categoryId || !requiredVoiceChannelId) {
        return await interaction.reply({
          content:
            "Voice channel setup is incomplete. Please contact an admin.",
          ephemeral: true,
        });
      }

      // Fetch latest voice state
      await guild.members.fetch(member.id);
      const voiceState = member.voice;

      if (!voiceState.channelId) {
        return await interaction.reply({
          content: "You must be in a voice channel to use this command.",
          ephemeral: true,
        });
      }

      console.log("Required Voice Channel ID:", requiredVoiceChannelId);
      console.log("User's Current Voice Channel ID:", voiceState.channelId);

      if (voiceState.channelId !== requiredVoiceChannelId) {
        return await interaction.reply({
          content: `You must be in the designated voice channel to create a private channel.`,
          ephemeral: true,
        });
      }

      // Check for existing channel
      if (activeVoiceChannels.has(member.id)) {
        const existingChannelId = activeVoiceChannels.get(member.id).id;
        const existingChannel = guild.channels.cache.get(existingChannelId);

        if (existingChannel) {
          return await interaction.reply({
            content: `You already have an active private voice channel: ${existingChannel.name}.`,
            ephemeral: true,
          });
        } else {
          activeVoiceChannels.delete(member.id);
        }
      }

      // Create new channel
      const channel = await guild.channels.create({
        name: `『 ${member.user.username}'s Voice Channel 』`,
        type: ChannelType.GuildVoice,
        parent: categoryId,
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

      activeVoiceChannels.set(member.id, { id: channel.id, counter: 1 });
      activeVoiceChannels.set(channel.id, { creatorId: member.id });

      await voiceState.setChannel(channel);

      return await interaction.reply({
        content: `Your private voice channel has been created and you have been moved to it: ${channel.name}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error in vc-create command:", error);

      const errorMessage =
        "There was an error while creating your private voice channel.";

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};

const { setupConfig } = require("../commands/vc-setup");
const { activeVoiceChannels } = require("../commands/vc-delete");
const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const { member, guild } = newState;
    const guildId = guild.id;

    // Sunucu ayarlarını kontrol et
    if (!setupConfig.servers?.[guildId]) {
      return;
    }

    const { categoryId, requiredVoiceChannelId } = setupConfig.servers[guildId];

    // Kullanıcı gerekli kanala girdiyse
    if (newState.channelId === requiredVoiceChannelId) {
      // Kullanıcının zaten aktif bir kanalı var mı kontrol et
      if (activeVoiceChannels.has(member.id)) {
        const existingChannelId = activeVoiceChannels.get(member.id).id;
        const existingChannel = guild.channels.cache.get(existingChannelId);

        if (existingChannel) {
          // Kullanıcıyı mevcut kanalına taşı
          await member.voice.setChannel(existingChannel);
          return;
        } else {
          activeVoiceChannels.delete(member.id);
        }
      }

      // Yeni kanal oluştur
      try {
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
              id: guild.client.user.id,
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

        // Kullanıcıyı yeni kanala taşı
        await member.voice.setChannel(channel);

        console.log(
          `Created and moved ${member.user.tag} to new channel: ${channel.name}`
        );
      } catch (error) {
        console.error("Error creating voice channel:", error);
      }
    }
  },
};

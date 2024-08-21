const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

const activeVoiceChannels = new Map();
const channelDeletionTimeouts = new Map();
const channelDeletionIntervals = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-setup')
        .setDescription('Creates a private voice channel for you.'),
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const member = interaction.member;

            if (activeVoiceChannels.has(member.id)) {
                const existingChannelId = activeVoiceChannels.get(member.id);
                const existingChannel = guild.channels.cache.get(existingChannelId);

                if (existingChannel) {
                    await interaction.reply({ content: `You already have an active private voice channel: ${existingChannel.name}.`, ephemeral: true });
                    return;
                } else {
                    activeVoiceChannels.delete(member.id);
                }
            }

            const channel = await guild.channels.create({
                name: `${member.user.username}'s Voice Channel`,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
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

            activeVoiceChannels.set(member.id, channel.id);

            if (member.voice.channel) {
                await member.voice.setChannel(channel);
                await interaction.reply({ content: `Your private voice channel has been created and you have been moved to it: ${channel.name}.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `Your private voice channel has been created: ${channel.name}. Join it to start using!`, ephemeral: true });
            }

            const deleteTimeout = setTimeout(async () => {
                if (channel.members.size === 0) {
                    activeVoiceChannels.delete(member.id);
                    await channel.delete();
                    await interaction.followUp({ content: 'Your private voice channel was deleted due to inactivity.', ephemeral: true });
                }
            }, 5 * 60 * 1000);

            channelDeletionTimeouts.set(channel.id, deleteTimeout);

            const interval = setInterval(() => {
                if (channel.members.size > 0) {
                    clearTimeout(deleteTimeout);
                    clearInterval(interval);
                    channelDeletionTimeouts.delete(channel.id);
                    channelDeletionIntervals.delete(channel.id);
                }
            }, 10000);

            channelDeletionIntervals.set(channel.id, interval);

        } catch (error) {
            console.error('Error in vc-setup command:', error);
            await interaction.reply({ content: 'There was an error while setting up your voice channel.', ephemeral: true });
        }
    },
    activeVoiceChannels
};


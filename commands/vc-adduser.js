const { SlashCommandBuilder } = require('discord.js');
const { activeVoiceChannels } = require('./vc-setup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-adduser')
        .setDescription('Allows a user to join your private voice channel.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to allow.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const member = interaction.member;
            const targetUser = interaction.options.getUser('user');
            const channelId = activeVoiceChannels.get(member.id);

            if (!channelId) {
                return interaction.reply({ content: 'You do not have an active private voice channel.', ephemeral: true });
            }

            const channel = interaction.guild.channels.cache.get(channelId);

            if (channel) {
                await channel.permissionOverwrites.edit(targetUser.id, {
                    ViewChannel: true,
                    Connect: true
                });
                interaction.reply({ content: `${targetUser.username} can now join your voice channel.`, ephemeral: true });
            } else {
                interaction.reply({ content: 'Could not find your private voice channel.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error in vc-adduser command:', error);
            await interaction.reply({ content: 'There was an error while adding the user to your voice channel.', ephemeral: true });
        }
    },
};

const { SlashCommandBuilder } = require('discord.js');
const { activeVoiceChannels } = require('./vc-setup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-delete')
        .setDescription('Deletes your private voice channel.'),
    async execute(interaction) {
        try {
            const member = interaction.member;
            const channelId = activeVoiceChannels.get(member.id);

            if (!channelId) {
                return interaction.reply({ content: 'You do not have an active private voice channel.', ephemeral: true });
            }

            const channel = interaction.guild.channels.cache.get(channelId);

            if (channel) {
                await channel.delete();
                activeVoiceChannels.delete(member.id);
                await interaction.reply({ content: 'Your private voice channel has been deleted.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Could not find your private voice channel.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error in vc-delete command:', error);
            await interaction.reply({ content: 'There was an error while deleting your voice channel.', ephemeral: true });
        }
    },
};

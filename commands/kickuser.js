const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kickuser')
        .setDescription('Kicks a user from your private voice channel.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to kick.')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const targetUser = interaction.options.getUser('user');

        if (member.voice.channel && member.voice.channel.members.has(member.id)) {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            if (targetMember.voice.channel && targetMember.voice.channel.id === member.voice.channel.id) {
                await targetMember.voice.disconnect();
                interaction.reply({ content: `${targetUser.username} has been kicked from the voice channel.`, ephemeral: true });
            } else {
                interaction.reply({ content: `${targetUser.username} is not in your voice channel.`, ephemeral: true });
            }
        } else {
            interaction.reply({ content: 'You are not in a voice channel you can manage.', ephemeral: true });
        }
    },
};

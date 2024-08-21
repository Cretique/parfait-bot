const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usercount')
        .setDescription('Displays the total number of members, humans, and bots in the server.'),
    async execute(interaction) {
        const { guild } = interaction;
        const totalMembers = guild.memberCount;
        const humanCount = guild.members.cache.filter(member => !member.user.bot).size;
        const botCount = totalMembers - humanCount;

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('\`👤\` Server Members Information')
            .setDescription(
                `\`👥\` Total Members: **${totalMembers}**\n` +
                `\`👤\` Humans: **${humanCount}**\n` +
                `\`👾\` Bots: **${botCount}**`
            );

        await interaction.reply({ embeds: [embed] });
    },
};

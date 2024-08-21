const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the unban')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to use this command.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            await interaction.guild.bans.remove(userId, reason);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Yeşil renk
                .setDescription(`✅ Successfully unbanned <@${userId}>\n\n**Reason:** ${reason}`);

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ Failed to unban <@${userId}>. Please make sure the user is banned.`);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets a slowmode for the channel.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('The amount of seconds for slowmode')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)), // 6 saat
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to use this command.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        const seconds = interaction.options.getInteger('seconds');

        try {
            await interaction.channel.setRateLimitPerUser(seconds);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Yeşil renk
                .setDescription(`✅ Successfully set slowmode to ${seconds} seconds.`);

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('❌ Failed to set slowmode.');

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

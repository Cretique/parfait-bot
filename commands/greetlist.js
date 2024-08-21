const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const greetCommand = require('./greet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greetlist')
        .setDescription('Lists all the channels where greet settings are active.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const guildId = interaction.guildId;
        const settings = greetCommand.getSettings(guildId);

        if (settings.length === 0) {
            const noSettingsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('❌ No greet settings are active in this server.');

            return interaction.reply({ embeds: [noSettingsEmbed] });
        }

        const channelsList = settings.map(setting => `<#${setting.channelId}>`).join('\n');
        const settingsEmbed = new EmbedBuilder()
            .setColor(0x00AE86) // Yeşil renk
            .setTitle('📺 Active Greet Channels')
            .setDescription(`📜 **Greet is active in the following channels:**\n${channelsList}`);

        await interaction.reply({ embeds: [settingsEmbed] });
    }
};

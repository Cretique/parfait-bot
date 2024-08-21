const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const greetCommand = require('./greet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greetclear')
        .setDescription('Clears the greet settings for a specific channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where you want to clear the greet settings.')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const guildId = interaction.guildId;
        const channel = interaction.options.getChannel('channel');
        
        const settings = greetCommand.getSettings(guildId);
        const existingSetting = settings.find(setting => setting.channelId === channel.id);

        if (!existingSetting) {
            const noSettingEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ No greet settings found for <#${channel.id}>.`);

            return interaction.reply({ embeds: [noSettingEmbed], ephemeral: true });
        }

        greetCommand.clearSettings(guildId, channel.id);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00AE86) // Yeşil renk
            .setDescription(`✅ Greet settings for <#${channel.id}> have been cleared.`);

        await interaction.reply({ embeds: [successEmbed] });
    },
};

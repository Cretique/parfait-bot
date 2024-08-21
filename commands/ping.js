const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot\'s ping.'),
    async execute(interaction) {
        // Embed oluştur
        const embed = new EmbedBuilder()
            .setTitle('Bot Ping')
            .setColor(0x00AE86)
            .addFields(
                { name: 'Latency', value: `${interaction.client.ws.ping}ms`, inline: true }, // API gecikmesi
                { name: 'Message Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true } // Mesaj gecikmesi
            );

        // Embed mesajını gönder
        await interaction.reply({ embeds: [embed] });
    },
};

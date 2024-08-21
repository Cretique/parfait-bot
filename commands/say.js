const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bir mesaj gönderir.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Gönderilecek mesaj')
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply(message);
    },
};

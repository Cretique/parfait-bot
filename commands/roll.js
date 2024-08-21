const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a dice and returns a number between 1 and 6.'),
    async execute(interaction) {
        const roll = Math.floor(Math.random() * 6) + 1;

        await interaction.reply({ content: `You rolled a ${roll}.` });
    },
};

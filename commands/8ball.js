const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask a yes/no question and get an answer.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answers = [
            'Yes',
            'No',
            'Maybe',
            'Definitely',
            'Not sure',
            'Absolutely not',
            'I wouldn\'t count on itt'
        ];
        const answer = answers[Math.floor(Math.random() * answers.length)];

        await interaction.reply({ content: `**Question:** ${question}\n**Answer:** ${answer}` });
    },
};

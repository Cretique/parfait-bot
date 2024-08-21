const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to delete (up to 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to delete messages in this channel.', ephemeral: true });
        }
    },
};

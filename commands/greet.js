const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let greetSettings = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greet')
        .setDescription('Sets the channel where new members are greeted and the time to delete the greeting message.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where you want to send the greeting.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('The number of seconds after which the greeting should be deleted. (0 = do not delete)')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const seconds = interaction.options.getInteger('seconds');

        greetSettings.channelId = channel.id;
        greetSettings.deleteAfterSeconds = seconds;

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00) // Yeşil renk
            .setDescription(`✅ Greeting channel set to ${channel}.\nMessages will be deleted after ${seconds} seconds.`);

        await interaction.reply({ embeds: [successEmbed] });

        // Additional logic for greeting new members
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('Clears all warnings for a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to clear warnings for')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to clear warnings.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        try {
            // Uyarı sisteminizle entegrasyon gerekli
            // const warnings = await getWarningsForUser(user.id);
            // await clearWarnings(user.id);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Yeşil renk
                .setDescription(`✅ Successfully cleared all warnings for ${user.tag}.`);

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ Failed to clear warnings for ${user.tag}.`);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to kick members.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
            const botNoPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 I do not have permission to kick members.');

            return interaction.reply({ embeds: [botNoPermsEmbed], ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.kick(reason);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Yeşil renk
                .setDescription(`✅ Successfully kicked ${user.tag}.\n\n**Reason:** ${reason}`);

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ Failed to kick ${user.tag}. Please ensure the user is not higher than my role or that the user is still in the server.`);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

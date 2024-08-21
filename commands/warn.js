const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user in the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to warn members.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        try {
            const successEmbed = new EmbedBuilder()
                .setColor(0xFFFF00) // Sarı renk
                .setDescription(`⚠️ Successfully warned ${user.tag}.\n\n**Reason:** ${reason}`);

            await interaction.reply({ embeds: [successEmbed] });

            // Optional: Logging the warning in a log channel
            const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'mod-logs');
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(0xFFFF00) // Sarı renk
                    .setTitle('User Warned')
                    .addFields(
                        { name: 'User', value: user.tag, inline: true },
                        { name: 'Reason', value: reason, inline: true },
                        { name: 'Moderator', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ Failed to warn ${user.tag}.`);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

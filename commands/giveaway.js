const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const ms = require('ms');

function parseDuration(duration) {
    return ms(duration);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Starts a giveaway with a specified duration.')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of the giveaway (e.g., 1m, 1h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prize')
                .setDescription('The prize for the giveaway')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('winners')
                .setDescription('Number of winners')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const duration = interaction.options.getString('duration');
        const prize = interaction.options.getString('prize');
        const winnersCount = interaction.options.getInteger('winners');

        const time = parseDuration(duration);
        if (!time || time <= 0) {
            return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });
        }

        const endTime = Date.now() + time;

        const embed = new EmbedBuilder()
            .setTitle(`🎁 ${prize}`)
            .setDescription(`Click the button to enter!\n\n👤 **Entries:** 0\n⌛ **Duration:** ${duration}\n👑 **Winners:** ${winnersCount}\n\n⏰ **Time remaining:** <t:${Math.floor(endTime / 1000)}:R>`)
            .setColor(0x00FF00)
            .setFooter({ text: `Ends at ${new Date(endTime).toLocaleString()}` });

        const button = new ButtonBuilder()
            .setCustomId('enterGiveaway')
            .setLabel('Enter Giveaway')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(button);

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = i => i.customId === 'enterGiveaway' && !i.user.bot;
        const collector = message.createMessageComponentCollector({ filter, time });

        const entries = new Set(); // To track unique participants

        collector.on('collect', async i => {
            entries.add(i.user.id);

            // Update the embed with the new number of entries
            const updatedEmbed = new EmbedBuilder()
                .setTitle(`🎁 ${prize}`)
                .setDescription(`Click the button to enter!\n\n👤 **Entries:** ${entries.size}\n⌛ **Duration:** ${duration}\n👑 **Winners:** ${winnersCount}\n\n⏰ **Time remaining:** <t:${Math.floor(endTime / 1000)}:R>`)
                .setColor(0x00FF00)
                .setFooter({ text: `Ends at ${new Date(endTime).toLocaleString()}` });

            await i.update({ embeds: [updatedEmbed] });
        });

        collector.on('end', async () => {
            const users = Array.from(entries);

            if (users.length === 0) {
                return interaction.followUp({ content: '🚫 No participants, giveaway canceled.' });
            }

            const winners = [];
            for (let i = 0; i < Math.min(winnersCount, users.length); i++) {
                const winner = users.splice(Math.floor(Math.random() * users.length), 1)[0];
                winners.push(winner);
            }

            const winnerMentions = winners.map(winnerId => `<@${winnerId}>`).join(', ');
            await interaction.followUp({ content: `🎉 Congratulations ${winnerMentions}! You won **${prize}**!` });
        });
    },
};

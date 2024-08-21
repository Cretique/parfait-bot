const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveroletoallbots')
        .setDescription('Assigns a role to all bots in the server.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign to all bots.')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const bots = await interaction.guild.members.fetch(); // Sunucudaki tüm üyeleri getir
        const botMembers = bots.filter(member => member.user.bot); // Sadece bot üyeler

        await interaction.reply({ content: `Assigning the role to ${botMembers.size} bots...`, ephemeral: true });

        for (const bot of botMembers.values()) {
            await bot.roles.add(role).catch(console.error);
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms bekleme süresi
        }

        await interaction.followUp({ content: `Successfully assigned the role to all bots!`, ephemeral: true });
    },
};

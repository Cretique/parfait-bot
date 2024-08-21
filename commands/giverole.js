const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrolealluser')
        .setDescription('Assigns a role to all members in the server.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign to all members.')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const members = await interaction.guild.members.fetch(); // Sunucudaki tüm üyeleri getir
        const humanMembers = members.filter(member => !member.user.bot); // Sadece insan üyeler

        await interaction.reply({ content: `Assigning the role to ${humanMembers.size} members...`, ephemeral: true });

        for (const member of humanMembers.values()) {
            await member.roles.add(role).catch(console.error);
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms bekleme süresi
        }

        await interaction.followUp({ content: `Successfully assigned the role to all members!`, ephemeral: true });
    },
};

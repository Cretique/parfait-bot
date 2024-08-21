const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user in the server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the mute in minutes')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = 'Muted by command';

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You do not have permission to mute members.');

            return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has('MANAGE_ROLES')) {
            const botNoPermsEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 I do not have permission to manage roles.');

            return interaction.reply({ embeds: [botNoPermsEmbed], ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            const role = interaction.guild.roles.cache.find(r => r.name === 'Muted');
            if (!role) {
                const muteRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#000000',
                    permissions: [],
                });

                interaction.guild.channels.cache.forEach(async (channel) => {
                    if (channel.type === ChannelType.GuildText) {
                        await channel.permissionOverwrites.edit(muteRole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                        });
                    }
                });
            }

            await member.roles.add(role, reason);

            setTimeout(async () => {
                await member.roles.remove(role, 'Mute duration expired');
            }, duration * 60000);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Yeşil renk
                .setDescription(`✅ Successfully muted ${user.tag} for ${duration} minutes.\n\n**Reason:** ${reason}`);

            await interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription(`❌ Failed to mute ${user.tag}.`);

            await interaction.reply({ embeds: [errorEmbed] });
        }
    },
};

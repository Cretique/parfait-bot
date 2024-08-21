const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Destroys and recreates the current channel or a specified channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to nuke. If not specified, nukes the current channel.')
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            const noAdminEmbed = new EmbedBuilder()
                .setColor(0xFF0000) // Kırmızı renk
                .setDescription('🚫 You must have Administrator permissions to use this command.');

            return interaction.reply({ embeds: [noAdminEmbed], ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel') || interaction.channel;

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'You can only nuke text channels.', ephemeral: true });
        }

        const channelName = channel.name;
        const channelPosition = channel.position;
        const channelCategory = channel.parentId; 
        const channelPermissions = channel.permissionOverwrites.cache.map(permission => ({
            id: permission.id,
            allow: permission.allow.toArray(),
            deny: permission.deny.toArray(),
        }));

        try {
            await channel.delete();

            const newChannel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                position: channelPosition,
                parent: channelCategory, 
                permissionOverwrites: channelPermissions.map(permission => ({
                    id: permission.id,
                    allow: permission.allow,
                    deny: permission.deny,
                })),
            });

            await newChannel.send(`Nuked by ${interaction.user.tag}`);

        } catch (error) {
            console.error(error);

            await interaction.reply({ content: 'There was an error trying to nuke the channel.', ephemeral: true });
        }
    },
};

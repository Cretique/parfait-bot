const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get information about')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);

        // Profil fotoğrafı için thumbnail ve embed başlığı
        const embed = new EmbedBuilder()
            .setTitle('User Information')
            .setThumbnail(user.displayAvatarURL({ size: 2048, extension: 'png' }))
            .setColor(0x00AE86)
            .addFields(
                { name: `User`, value: `<@${user.id}>`, inline: false }, // Kullanıcı adı
                { name: 'Account Info:', value: `Created: <t:${Math.floor(user.createdTimestamp / 1000)}:F>\nJoined: <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false } // Hesap Bilgileri
            )
            .setFooter({ text: `User ID: ${user.id}` });

        // Butonları ekleme
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId('avatar'), // Mavi buton
                new ButtonBuilder()
                    .setLabel('Roles')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('roles') // Gri buton
            );

        // Mesajı embed ve butonlarla birlikte gönder (Herkese görünür şekilde)
        await interaction.reply({ embeds: [embed], components: [row] });

        // Butonlara basıldığında yapılacak işlemler
        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'avatar') {
                const avatarEmbed = new EmbedBuilder()
                    .setTitle(`${user.username}'s Avatar`)
                    .setImage(user.displayAvatarURL({ size: 2048, extension: 'png' }))
                    .setColor(0x00AE86);

                await i.reply({ embeds: [avatarEmbed], ephemeral: true });
            } else if (i.customId === 'roles') {
                const roles = member.roles.cache.map(role => role.name).join(', ') || 'No roles';
                const rolesEmbed = new EmbedBuilder()
                    .setTitle(`${user.username}'s Roles`)
                    .setDescription(roles)
                    .setColor(0x00AE86);

                await i.reply({ embeds: [rolesEmbed], ephemeral: true });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};

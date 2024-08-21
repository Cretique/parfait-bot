// commands/serverinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        const { guild } = interaction;

        const owner = await guild.fetchOwner();
        const creationDate = moment(guild.createdAt).format('MMMM Do YYYY');
        const categoryChannels = guild.channels.cache.filter(channel => channel.type === 4).size;
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '\`👑\` Server Owner', value: `<@${owner.user.id}>`, inline: true },
                { name: '\`📅\` Creation Date', value: `${creationDate}`, inline: true },
                { name: '\`👤\` Total Members', value: `${guild.memberCount}`, inline: true },
                { name: '\`🗂️\` Category Channels', value: `${categoryChannels}`, inline: true },
                { name: '\`💬\` Text Channels', value: `${textChannels}`, inline: true },
                { name: '\`🔊\` Voice Channels', value: `${voiceChannels}`, inline: true },
            )
            .setFooter({ text: `ID: ${guild.id} | Server Created: ${creationDate}` });

        await interaction.reply({ embeds: [embed] });
    },
};

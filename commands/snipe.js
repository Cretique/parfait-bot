const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Sniping data
const snipes = new Map();
const snipeToggles = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Shows the last deleted message in the channel.')
        .addBooleanOption(option => 
            option.setName('ephemeral')
                .setDescription('Whether the response should be ephemeral or not')
                .setRequired(false)),

    async execute(interaction) {
        const { channel } = interaction;
        const ephemeral = interaction.options.getBoolean('ephemeral') || false;

        try {
            const snipe = snipes.get(channel.id);

            if (!snipe) {
                return interaction.reply({ content: 'There is no message to snipe in this channel.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL() })
                .setDescription(snipe.content || '*No content*')
                .addFields(
                    { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                    { name: 'Deleted At', value: `<t:${Math.floor(snipe.time / 1000)}:R>`, inline: true }
                )
                .setColor('#FF6347')
                .setFooter({ text: `Message ID: ${snipe.id}` });

            await interaction.reply({ embeds: [embed], ephemeral });
        } catch (error) {
            console.error('Error executing snipe command:', error);

            // Safeguard to ensure the interaction reply happens only once
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing the snipe command.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing the snipe command.', ephemeral: true });
            }
        }
    },

    toggle: new SlashCommandBuilder()
        .setName('snipetoggle')
        .setDescription('Toggles whether your messages can be sniped or not.'),

    async toggleExecute(interaction) {
        try {
            const userId = interaction.user.id;
            const currentState = snipeToggles.get(userId) || false;
            snipeToggles.set(userId, !currentState);

            await interaction.reply({
                content: currentState ? 'You have disabled sniping for your messages.' : 'You have enabled sniping for your messages.',
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error executing snipetoggle command:', error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while toggling sniping.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while toggling sniping.', ephemeral: true });
            }
        }
    }
};

// Event to store deleted messages
module.exports.snipeEvent = (message) => {
    try {
        // Check if sniping is disabled for this user
        if (!snipeToggles.get(message.author.id)) {
            snipes.set(message.channel.id, {
                content: message.content,
                author: message.author,
                time: Date.now(),
                id: message.id,
            });
        }
    } catch (error) {
        console.error('Error in snipeEvent:', error);
    }
};
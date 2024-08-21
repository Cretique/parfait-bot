const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Displays information about a specific role.')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role you want to get information about')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Kullanıcının seçtiği rolü al
        const role = interaction.options.getRole('role');

        // Rolün yetkilerini listele
        const permissions = [
            role.permissions.has('ADMINISTRATOR') ? 'Administrator' : '',
            role.permissions.has('VIEW_AUDIT_LOG') ? 'View Audit Log' : '',
            role.permissions.has('MANAGE_GUILD') ? 'Manage Server' : '',
            role.permissions.has('MANAGE_ROLES') ? 'Manage Roles' : '',
            role.permissions.has('MANAGE_CHANNELS') ? 'Manage Channels' : '',
            role.permissions.has('KICK_MEMBERS') ? 'Kick Members' : '',
            role.permissions.has('BAN_MEMBERS') ? 'Ban Members' : '',
            role.permissions.has('CREATE_INSTANT_INVITE') ? 'Create Instant Invite' : '',
            role.permissions.has('CHANGE_NICKNAME') ? 'Change Nickname' : '',
            role.permissions.has('MANAGE_NICKNAMES') ? 'Manage Nicknames' : '',
            role.permissions.has('MANAGE_EMOJIS_AND_STICKERS') ? 'Manage Emojis and Stickers' : '',
            role.permissions.has('MANAGE_WEBHOOKS') ? 'Manage Webhooks' : '',
            role.permissions.has('READ_MESSAGE_HISTORY') ? 'Read Message History' : '',
            role.permissions.has('MENTION_EVERYONE') ? 'Mention Everyone' : '',
            role.permissions.has('USE_EXTERNAL_EMOJIS') ? 'Use External Emojis' : '',
            role.permissions.has('VIEW_CHANNEL') ? 'View Channels' : '',
            role.permissions.has('SEND_MESSAGES') ? 'Send Messages' : '',
            role.permissions.has('SEND_TTS_MESSAGES') ? 'Send TTS Messages' : '',
            role.permissions.has('ATTACH_FILES') ? 'Attach Files' : '',
            role.permissions.has('READ_MESSAGE_HISTORY') ? 'Read Message History' : '',
            role.permissions.has('MENTION_EVERYONE') ? 'Mention Everyone' : '',
            role.permissions.has('USE_EXTERNAL_EMOJIS') ? 'Use External Emojis' : '',
            role.permissions.has('CONNECT') ? 'Connect' : '',
            role.permissions.has('SPEAK') ? 'Speak' : '',
            role.permissions.has('MUTE_MEMBERS') ? 'Mute Members' : '',
            role.permissions.has('DEAFEN_MEMBERS') ? 'Deafen Members' : '',
            role.permissions.has('MOVE_MEMBERS') ? 'Move Members' : '',
            role.permissions.has('USE_VAD') ? 'Use Voice Activity Detection' : '',
            role.permissions.has('PRIORITY_SPEAKER') ? 'Priority Speaker' : '',
            role.permissions.has('STREAM') ? 'Stream' : '',
        ].filter(permission => permission !== '').join(', ');

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setTitle('Role Information')
            .setColor(role.color)
            .addFields(
                { name: 'Role Name', value: role.name, inline: true },
                { name: 'Role ID', value: role.id, inline: true },
                { name: 'Created At', value: new Date(role.createdAt).toLocaleDateString(), inline: true },
                { name: 'Permissions', value: permissions || 'No permissions', inline: false }
            );

        // Embed mesajını gönder
        await interaction.reply({ embeds: [embed] });
    },
};

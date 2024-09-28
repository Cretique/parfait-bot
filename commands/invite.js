const { SlashCommandBuilder } = require("discord.js");
const { clientId } = require("../config/config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription(
      "Generates an invite link for the bot with administrator permissions."
    ),
  async execute(interaction) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

    await interaction.reply({
      embeds: [
        {
          color: 0x00ae86,
          title: "Invite Link",
          description: `Click [here](${inviteLink}) to invite the bot with Administrator permissions.`,
          footer: { text: "Invite your bot to your server!" },
        },
      ],
      ephemeral: true,
    });
  },
};

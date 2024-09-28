const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const configPath = path.join(__dirname, "../config/config.json");
    let config = {};

    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      } catch (err) {
        console.error("Yapılandırma dosyası okunamadı:", err);
        return;
      }
    } else {
      console.error("Yapılandırma dosyası bulunamadı.");
      return;
    }

    const guildConfig = config.servers[member.guild.id];
    if (!guildConfig) return;

    const { welcomeChannelId, autoRoleId } = guildConfig;

    // Otomatik rol verme
    if (autoRoleId) {
      try {
        const role = await member.guild.roles.fetch(autoRoleId);
        if (role) {
          await member.roles.add(role);
          console.log(
            `${member.user.tag} kullanıcısına ${role.name} rolü verildi.`
          );
        }
      } catch (err) {
        console.error(`Rol verilemedi: ${err}`);
      }
    }

    // Hoş geldin mesajı gönderme
    if (welcomeChannelId) {
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      if (channel) {
        const memberCount = member.guild.memberCount;

        const welcomeEmbed = new EmbedBuilder()
          .setColor("#FF4500")
          .setTitle(`Hoş Geldin ${member.user.username}!`)
          .setDescription(
            `Sunucumuza hoş geldin! Seninle birlikte ${memberCount} kişi olduk.`
          )
          .setThumbnail(
            member.user.displayAvatarURL({ dynamic: true, size: 256 })
          )
          .addFields(
            {
              name: "🎉 Katılma Tarihi",
              value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            { name: "👤 Kullanıcı ID", value: member.id, inline: true }
          )
          .setImage(
            "https://res.cloudinary.com/dcy6ogtc1/image/upload/v1726257005/DALL_E_2024-09-13_22.49.56_-_A_minimalistic_chocolate_cake_design_with_a_clean_and_elegant_background._The_cake_is_a_simple_single-tier_round_shape_with_smooth_glossy_dark_choco_nof4ml.webp"
          )
          .setFooter({
            text: `${member.guild.name} • Keyifli vakit geçirmen dileğiyle!`,
            iconURL: member.guild.iconURL({ dynamic: true }),
          })
          .setTimestamp();

        await channel.send({
          content: `Hey ${member}! 👋`,
          embeds: [welcomeEmbed],
        });
      }
    }

    // Özel mesaj gönderme
    try {
      await member.send(
        `Merhaba ${member.user.username}! **${member.guild.name}** sunucusuna hoş geldin. Umarım iyi vakit geçirirsin! Herhangi bir sorun olursa moderatörlerimize ulaşmaktan çekinme. 😊`
      );
    } catch (err) {
      console.log(`${member.user.tag} kullanıcısına özel mesaj gönderilemedi.`);
    }
  },
};

const { EmbedBuilder } = require("discord.js");

// Genel ve özel rollerin embedlerini oluşturmak için yardımcı fonksiyonlar
function createEmbed(title, roles, footerText) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor("#FFD700") // Genel başlık rengi
    .setDescription(
      "Her bir rolün açıklaması ve yetkileri aşağıda belirtilmiştir."
    );

  // Rollerin embed içeriğine eklenmesi
  roles.forEach((role) => {
    embed.addFields({ name: role.name, value: role.description, inline: true });
  });

  embed.setFooter({ text: footerText });
  return embed;
}

// Gelişmiş rol duyuru fonksiyonu
async function sendEnhancedRoleAnnouncement(channel) {
  const generalRoles = [
    {
      name: "〔👨🏻‍💼〕≫ Mekanın Sahibi",
      description: "Sunucu Sahibi • Tüm yetkiler",
      color: "#FF4500",
    },
    {
      name: "〔👨‍🍳〕≫ Yönetici Şef",
      description:
        "Yönetici (Admin) • Neredeyse tüm yetkiler, sunucu ayarlarını değiştirebilir",
      color: "#FF6347",
    },
    {
      name: "〔🔪〕≫ Yardımcı Şef",
      description:
        "Üst Düzey Moderatör • Kullanıcıları yasaklama, kanal yönetimi, rol verme yetkileri",
      color: "#FF7F50",
    },
    {
      name: "〔🍴〕≫ Yarı-Şef",
      description: "Moderatör • Mesaj silme, kullanıcıları susturma yetkileri",
      color: "#FFA07A",
    },
    {
      name: "〔🎂〕≫ Çikolatalı Pasta",
      description: "VIP Üye (Kadın) • Sunucunun güvenilir, makara üyeleri",
      color: "#FF69B4",
    },
    {
      name: "〔🍳〕≫ Ustabaşı",
      description: "VIP Üye (Erkek) • Sunucunun güvenilir, makara üyeleri",
      color: "#20B2AA",
    },
    {
      name: "〔🫒〕≫ Çırak",
      description:
        "Stajyer Moderatör • Bazı özel kanallara erişim, ekstra izinler",
      color: "#32CD32",
    },
    {
      name: "〔💎〕≫ Server Booster",
      description: "Sunucu Destekçisi • Özel rozet, ekstra özellikler",
      color: "#8A2BE2",
    },
    {
      name: "〔🤤〕≫ Müşteriler",
      description: "Tüm Üyeler • Temel sunucu erişimi",
      color: "#A9A9A9",
    },
  ];

  const specialRoles = [
    {
      name: "〔👸🏻〕≫ Hime-sama",
      description:
        "Sunucunun Kraliçesi • Sunucunun fikir sahibi, kraliçesine özel oluşturulmuştur",
      color: "#FF1493",
    },
    {
      name: "〔🧠〕≫ Akıl Sahibi",
      description:
        "Bilge Kişi • Oyun, hayat, kodlama ve akla gelebilecek konularda herbokologlar",
      color: "#4B0082",
    },
  ];

  // Genel roller için embed oluştur
  const generalRolesEmbed = createEmbed(
    "👑 Genel Roller 👑",
    generalRoles,
    "🍽️ Lezzetli Roller Menüsü 🍽️"
  );

  // Özel roller için embed oluştur
  const specialRolesEmbed = createEmbed(
    "✨ Özel Roller ✨",
    specialRoles,
    "Sunucumuzun eşsiz özel rollerini keşfedin! 💎"
  );

  // Embeds'i tek bir mesajda gönder
  await channel.send({ embeds: [generalRolesEmbed] });

  // Özel roller için ayrı bir mesaj gönder
  await channel.send({ embeds: [specialRolesEmbed] });

  // Kapanış mesajını gönder
  const closingEmbed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle("🌟 Rol Hiyerarşimiz 🌟")
    .setDescription("Her rolün tadı bir başka! Afiyet olsun! 🍽️")
    .setFooter({ text: "Sunucumuzda iyi vakit geçirmeniz dileğiyle!" });

  await channel.send({ embeds: [closingEmbed] });
}

module.exports = { sendEnhancedRoleAnnouncement };

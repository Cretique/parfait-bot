const { EmbedBuilder } = require("discord.js");

// Kuralları içeren embed fonksiyonu
async function sendRuleAnnouncement(channel) {
  // Kuralları kategori bazlı ayırıyoruz
  const rules = [
    {
      category: "📜 Genel Kurallar",
      items: [
        "Herhangi bir ırk, dil, din veya cinsiyet ayrımcılığına yol açacak ifadeler kullanmak yasaktır.",
        "Sunucuda herhangi bir politik veya dini tartışmaya yol açacak mesajlar yazmak yasaktır.",
        "Küfür, hakaret, aşağılama veya kişisel saldırılar yasaktır.",
      ],
    },
    {
      category: "🎮 Oyun ve Etkinlik Kuralları",
      items: [
        "Hile kullanımı ve haksız rekabete yol açacak davranışlar yasaktır.",
        "Oyuncuları küçük düşürücü ifadeler kullanmak ve troll yapmak yasaktır.",
        "Etkinlikler sırasında kurallara uymayan kullanıcılar uyarı alır ve tekrarı halinde sunucudan uzaklaştırılır.",
      ],
    },
    {
      category: "🔒 Gizlilik ve Güvenlik Kuralları",
      items: [
        "Kullanıcıların kişisel bilgilerini izinsiz paylaşmak kesinlikle yasaktır.",
        "Kullanıcıları rahatsız edecek veya dolandırıcılığa yönelik mesajlar yasaktır.",
        "Yetkililerin izni olmadan herhangi bir kanal veya mesaj silmek yasaktır.",
      ],
    },
  ];

  // Embed oluşturma
  const rulesEmbed = new EmbedBuilder()
    .setColor("#FFA500") // Turuncu renk
    .setTitle("📜 Sunucu Kuralları")
    .setDescription(
      "Lütfen sunucumuzun kurallarını okuyun ve bu kurallara uyduğunuzdan emin olun. Herhangi bir kural ihlali, ceza ile sonuçlanabilir. İyi eğlenceler! 🎉"
    )
    .setThumbnail(
      "https://res.cloudinary.com/dcy6ogtc1/image/upload/v1726257005/DALL_E_2024-09-13_22.49.56_-_A_minimalistic_chocolate_cake_design_with_a_clean_and_elegant_background._The_cake_is_a_simple_single-tier_round_shape_with_smooth_glossy_dark_choco_nof4ml.webp"
    )
    .setFooter({ text: "Sunucuda kurallara uyduğunuz için teşekkür ederiz!" });

  // Kuralları kategori bazında ekleme
  rules.forEach((ruleCategory) => {
    const ruleDescriptions = ruleCategory.items
      .map((rule, index) => `${index + 1}. ${rule}`)
      .join("\n");
    rulesEmbed.addFields({
      name: ruleCategory.category,
      value: ruleDescriptions,
    });
  });

  // Kuralları tek bir mesajda embed olarak gönder
  await channel.send({ embeds: [rulesEmbed] });

  // Kapanış mesajı
  const closingEmbed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle("⚠️ Önemli Hatırlatma")
    .setDescription(
      "Bu kurallar sunucunun düzenini ve üyelerimizin huzurunu sağlamak amacıyla oluşturulmuştur. Kurallara uymayan kullanıcılar, yetkililer tarafından uyarı alacak ve gerektiğinde sunucudan uzaklaştırılacaktır."
    )
    .setFooter({ text: "Anlayışınız için teşekkür ederiz!" });

  await channel.send({ embeds: [closingEmbed] });
}

module.exports = { sendRuleAnnouncement };

const { sendEnhancedRoleAnnouncement } = require("../utils/roleAnnouncement");
const { sendRuleAnnouncement } = require("../utils/ruleAnnouncement");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı ve çalışıyor!`);

    //Kanallara Otomatik Mesaj Atma

    //const channel = client.channels.cache.get("778952106177855498"); // Rol Kanal ID
    //const channel = client.channels.cache.get("750862604175540396"); //Kurallar Kanalı ID

    //sendEnhancedRoleAnnouncement(channel); //Roller Kanalı
    //sendRuleAnnouncement(channel);
  },
};

const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.js');
const fs = require('fs');
const path = require('path');

// Discord.js client oluşturuluyor
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Komutlar koleksiyonu
client.commands = new Collection();

// 'commands' klasöründeki tüm komut dosyalarını yükle
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Slash komutlarını kaydet
const commands = client.commands.map(command => command.data.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Komutlar güncelleniyor...');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('Slash komutları başarıyla güncellendi.');
    } catch (error) {
        console.error('Komutlar güncellenirken bir hata oluştu:', error);
    }
})();

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Komut çalıştırılırken bir hata oluştu:', error);

        // Yanıtı kontrol et ve yalnızca yanıt verilmemişse hata mesajı gönder
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        }
    }
});

// `messageDelete` olayını dinle ve snipe verilerini kaydet
const { snipeEvent } = require('./commands/snipe.js'); // Snipe komutunun olduğu dosyanın yolunu kontrol et
client.on('messageDelete', snipeEvent);

client.login(token);
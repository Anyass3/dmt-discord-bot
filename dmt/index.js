import { TOKEN, CHANNEL_ID } from './environ.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerCommands, listenForCommands } from './interactions.js'

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildIntegrations,
    ]
});

client.login(TOKEN);

client.on('messageCreate', async (message) => {
    console.log('content', message.content);
    if (!message.author?.bot) {
        if (message.guildId) {
            message.reply(`you sent ${Buffer.from(message.content, 'utf-8').toString('base64')}`);
        }
        else if (message.author) {
            message.author.send(`you sent ${Buffer.from(message.content, 'utf-8').toString('base64')}`);
        }

    }
});

client.on('error', console.error);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
    listenForCommands(client);
});

const sendMessage = (message = 'Sending updates', channel_id = CHANNEL_ID) => {
    if (!client.isReady()) {
        client.once('ready', () => {
            sendMessage(message);
        })
        return;
    }
    const channel = client.channels.cache.get(channel_id);
    if (!channel) return console.log('channel is not defined');
    channel.send(message);
}

const stringifyObj = (obj, lang) => "```" + (lang || '') + "\n" + JSON.stringify(obj, null, 2) + "\n```"

export function init(program) {
    program.on('dmtapp::search::query', obj => {
        sendMessage(stringifyObj(obj))
    })
    program.on('ready', () => {
        sendMessage('DMT engine ready')
    })

    program.on('discord-bot', ({ message, channel_id, lang }) => {
        if (typeof message != 'object') return sendMessage(String(message), channel_id);

        sendMessage(stringifyObj(obj, lang), channel_id);
    })
}
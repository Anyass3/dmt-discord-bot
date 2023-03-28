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
    console.log('content', message);
    /**
     * @type {typeof message}
     * */
    let msg
    let reply = `you sent ${Buffer.from(message.content, 'utf-8').toString('base64')} \nhttps://github.com`;
    if (!message.author?.bot) {
        if (message.guildId) {
            msg = await message.reply(reply);

        }
        else if (message.author) {
            msg = message.author.send(reply);
        }
        if (msg) {
            msg.edit({ flags: 'SuppressEmbeds' });
        }
    }
});

client.on('error', console.error);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
    listenForCommands(client);
});

const sendMessage = async (message = 'Sending updates', args = {}) => {
    const { channelId = CHANNEL_ID, disableLinkPreview = true } = args;
    if (!client.isReady()) {
        client.once('ready', () => {
            sendMessage(message, args);
        })
        return;
    }
    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.log('channel is not defined');
    const _message = await channel.send(message);
    if (disableLinkPreview && _message) {
        _message.edit({ flags: 'SuppressEmbeds' });
    }
}

const stringifyObj = (obj, lang) => "```" + (lang || '') + "\n" + JSON.stringify(obj, null, 2) + "\n```"

export function init(program) {
    program.on('dmtapp::search::query', obj => {
        sendMessage(stringifyObj(obj))
    })

    program.on('ready', () => {
        sendMessage('DMT engine ready')
    })

    program.on('discord-bot', ({ message, channelId, lang, hideLinkEmbedPreview }) => {
        if (typeof message != 'object') return sendMessage(String(message), { channelId, hideLinkEmbedPreview });

        sendMessage(stringifyObj(obj, lang), channelId);
    })
}
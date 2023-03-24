import { TOKEN, CLIENT_ID } from './environ.js';
import { REST, Routes } from 'discord.js'

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'beep',
        description: 'Replies with Boop!',
    },
    {
        name: 'server',
        description: 'Shares info about the server',
    },
    {
        name: 'user-info',
        description: 'Shares current user info!',
    },
    {
        name: 'channel',
        description: 'Shares info about the channel',
    },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

export const registerCommands = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};

/**
 * @param {import('discord.js').Client} client
 * @returns {void}
 */
export const listenForCommands = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.commandName) {
            case 'ping':
                await interaction.reply('Pong!');
                break;
            case 'beep':
                interaction.reply('Boop.');
                break;
            case 'server':
                interaction.reply('Guild name: ' + interaction.guild?.name + '\nGuild Id: ' + interaction.guild?.id + '\nTotal members: ' + interaction.guild?.memberCount);
                break;
            case 'channel':
                interaction.reply('Channel name: ' + interaction.channel?.name + '\nChannel Id: ' + interaction.channel?.id + '\nTotal messages: ' + interaction.channel?.messageCount);
                break;
            case 'user-info':
                interaction.reply('Your username: ' + interaction.user?.username + '\nYour ID: ' + interaction.user?.id);
                break;

            default:
                break;
        }
    });
}
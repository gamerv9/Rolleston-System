// Organized version of your bot entry file with enhanced logging
const { Client, Collection, EmbedBuilder } = require("discord.js");
const client = new Client({ intents: 131071 });
const { readdirSync, appendFileSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const connectDatabase = require('./config/database');
const contextMenuData = require('./contextMenuCommands');
const { images } = require('./config.js');
const colors = require("colors");
require('dotenv').config();

const BOT_VERSION = '1.2.1';
const LOG_FILE = './log.txt';

function getTimestamp() {
    return `[${new Date().toLocaleString()}]`;
}

function log(type, message, isError = false) {
    const formatted = `${getTimestamp()} [${type}] ${message}`;
    if (isError) {
        console.log(formatted.red);
    } else {
        console.log(formatted.green);
    }
    appendFileSync(LOG_FILE, formatted + '\n', 'utf8');
}

function logStartup() {
    log('STARTING', 'Attempting to start the bot..');
    log('INFO', `NodeJS Version: ${process.version}`);
    log('INFO', `Bot Version: ${BOT_VERSION}`);
}

client.commands = new Collection();
client.commandaliases = new Collection();
client.slashcommands = new Collection();
const slashcommands = [];
const rest = new REST({ version: '10' }).setToken(process.env.SystemToken);

logStartup();

client.login(process.env.SystemToken).catch(err => {
    log('ERROR', '❌ Token is not working', true);
    log('ERROR', err.stack || err.toString(), true);
    process.exit(1);
});

// verify();

client.on("ready", async () => {
    try {
        const allCommands = [...slashcommands, ...contextMenuData];
        await rest.put(Routes.applicationCommands(client.user.id), { body: allCommands });
        connectDatabase();
        log('READY', `Bot is now ready!`);
    } catch (error) {
        log('ERROR', 'Error during ready event setup', true);
        log('ERROR', error.stack || error.toString(), true);
    }
});

const ascii = require('ascii-table');
const commandTable = new ascii('Commands').setJustify();
for (let folder of readdirSync('./commands/').filter(f => !f.includes('.'))) {
    for (let file of readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'))) {
        const command = require(`./commands/${folder}/${file}`);
        if (command?.data?.name) {
            slashcommands.push(command.data.toJSON());
            client.slashcommands.set(command.data.name, command);
            commandTable.addRow(`/${command.data.name}`, '🟢 Working');
        } else {
            commandTable.addRow(`/${file}`, '🔴 Invalid');
        }
    }
}
console.log(commandTable.toString());

const eventTable = new ascii('Events').setJustify();
for (let folder of readdirSync('./events/').filter(f => !f.includes('.'))) {
    for (let file of readdirSync(`./events/${folder}`).filter(f => f.endsWith('.js'))) {
        const event = require(`./events/${folder}/${file}`);
        eventTable.addRow(`/${file}`, '🟢 Loaded');
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
console.log(eventTable.toString());

setTimeout(() => {
    require('./tchhir');
}, 10_000);

setTimeout(() => {
    require('./giveaway');
    log('INFO', `All bots ready: system ✅ | tchhir ✅ | giveaway ✅`);
}, 20_000);

const checkEndedRooms = require('./utils/checkEndedRooms');
setInterval(() => {
	checkEndedRooms(client)
}, 25_000);


const checkPrivateRoomsCount = require('./utils/checkPrivateRoomsCount');
setInterval(() => {
	checkPrivateRoomsCount(client)
}, 5_000);

const openAndCloseFunction = require("./utils/openAndCloseRooms.js");
setInterval(() => {
	openAndCloseFunction(client, EmbedBuilder)
}, 30_000);

process.on("unhandledRejection", (e) => {
    log('unhandledRejection', `[v${BOT_VERSION}]\n` + (e.stack || e.toString()), true);
});

process.on("uncaughtException", (e) => {
    log('uncaughtException', `[v${BOT_VERSION}]\n` + (e.stack || e.toString()), true);
});

process.on("uncaughtExceptionMonitor", (e) => {
    log('uncaughtExceptionMonitor', `[v${BOT_VERSION}]\n` + (e.stack || e.toString()), true);
});

module.exports = client;
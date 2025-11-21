const { prefix } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const settingsDB = new Database("/database/settings.json");
const ms = require("ms");
const cooldown = new Collection();
const { hexEmbedColor, images } = require('../../config.js');


module.exports = {
    name: Events.MessageCreate,
    aliases: ["تشفير"],
    /**
     * 
     * @param {Message} message 
     */
    execute: async (message) => {
        if(message.author.bot) return;
        const commandsRoom = await settingsDB.get("commandsRoom") || null;
        if (message.channel.id !== commandsRoom) return;

        setTimeout(async() => {
            await message.delete();
        }, 3_000);
    }
};
const {prefix} = require('../../config.js');
const { Message , Collection , EmbedBuilder,Events , StringSelectMenuBuilder , StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js")
const { Database } = require('st.db')
const pricesDB = new Database("/database/prices.json")
const settingsDB = new Database("/database/settings.json")
const { privateRoomsModel } = require('../../database/schemas/privateRoomsModel')
const ms = require("ms")
const timestamp = require('discord-timestamp');
const moment = require("moment");
const { hexEmbedColor, images } = require('../../config.js');

const cooldown = new Collection()
module.exports = {
	name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     */
	execute: async(message) => {
        if(message.content ==  prefix + "privateRoomsCount"){
            if(!message.member.permissions.has('Administrator')) return;
            const privateroomsAvailable = settingsDB.get(`privateroomsAvailable`);
            let embed = new EmbedBuilder()
                            .setColor(hexEmbedColor)
                            .setDescription(`عدد الرومات الخاصة المتوفره : \`${privateroomsAvailable}\`

                            **اخر تحديث في** __<t:${timestamp(moment(Date.now()))}:R>__`)
                            .setImage(images.privateRooms || null);
            await message.channel.send({embeds : [embed]}).then(async(msg) => {
                await settingsDB.set(`privateRoomsCount` , {
                    "privateRoomsCountMsgId" : msg.id,
                    "privateRoomsCounttChannelId" : message.channel.id
                })
                await message.delete();
            })
        }
  }};

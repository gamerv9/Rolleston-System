const { prefix } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const settingsDB = new Database("/database/settings.json");
const ms = require("ms");
const cooldown = new Collection();
const { hexEmbedColor, images, owner } = require('../../config.js');


module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message 
     */
    execute: async (message) => {        
        if (message.content === prefix + "send-rules") {
            try {
            if(message.author.bot) return;
            if(!owner.includes(message.author.id)) return message.react('❌');

            const embed = new EmbedBuilder()
                                    .setTitle(message.guild.name)
                                    .setColor(hexEmbedColor)
                                    .setImage(images.rules || null)
                                    /// وصف ايمبد المعلومات (بانل المعلومات)
                                    .setDescription(`### القوانين
**لرؤية قوانين السيرفر اختار قوانين السيرفر
لرؤية قوانين البائعين اختار قوانين البائعين
لرؤية قوانين الادارة اختار قونين الادارة**`)
        const selectMenu = new StringSelectMenuBuilder()
                                            .setCustomId('rulesSelect')
                                            .setPlaceholder('اختار هنا')
                                            .addOptions([
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('قوانين السيرفر')
                                                                .setValue('rulesSelect-server'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('قوانين البائعين')
                                                                .setValue('rulesSelect-seller'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('قوانين الإدارة')
                                                                .setValue('rulesSelect-support'),
                                            ])
            const row = new ActionRowBuilder().addComponents(selectMenu);
            await message.channel.send({embeds : [embed], components : [row]});
            await message.delete();
            } catch (error) {
                console.error(error);   
            }
        }
    }
};
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
        if (message.content === prefix + "send-info") {
            try {
            if(message.author.bot) return;
            if(!owner.includes(message.author.id)) return message.react('❌');

            const embed = new EmbedBuilder()
                                    .setTitle(message.guild.name)
                                    .setColor(hexEmbedColor)
                                    .setImage(images.informations || null)
                                    /// وصف ايمبد المعلومات (بانل المعلومات)
                                    .setDescription(`### المعلومات
لرؤية معلومات الرتب العامة اختار الرتب العامة
لرؤية معلومات الرتب الفخمة اختار الرتب النادرة
لرؤية معلومات الرومات الخاصة اختار الرومات الخاصة
لرؤية معلومات الاعلانات اختار الاعلانات
لرؤية معلومات المنشورات المميزة اختار المنشورات المميزة
لرؤية معلومات الاضافات اختار الاضافات
لرؤية الاسئلة الشائعة اختار الاسئلة الشائعة
`)
        const selectMenu = new StringSelectMenuBuilder()
                                            .setCustomId('informationsSelect')
                                            .setPlaceholder('اختار هنا')
                                            .addOptions([
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الرتب العامة')
                                                                .setValue('informationsSelect-rolesNormal'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الرتب الفخمة')
                                                                .setValue('informationsSelect-rolesVip'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الرومات الخاصة')
                                                                .setValue('informationsSelect-privateRooms'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الاعلانات')
                                                                .setValue('informationsSelect-ads'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('المنشورات المميزة')
                                                                .setValue('informationsSelect-posts'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الاضافات')
                                                                .setValue('informationsSelect-options'),
                                                new StringSelectMenuOptionBuilder()
                                                                .setLabel('الأسئلة الشائعة')
                                                                .setValue('informationsSelect-faq'),
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
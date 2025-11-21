const { prefix, images } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const jsonDB = new Database('/database/database.json');
const ms = require("ms");
const cooldown = new Collection();
const { hexEmbedColor } = require('../../config.js');

module.exports = {
    name: Events.MessageCreate,
    aliases: ["help"],
    /**
     * 
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.content === prefix + "help") {
            try {
                if(!message.member.permissions.has('Administrator')) return;    
                const embed = new EmbedBuilder()
                                        .setTitle('Shop Help | Homepage')
                                        .setDescription(`-------------------------
## الأقسام :
🏠 الرئيسية** | هذه الصفحة**
📚 العامة** | الاوامر العامة الخاصة بالبوت**
🚨 تحذير البائعين** | الأوامر و المعلومات الخاصة بتحذير البائعين**
📋 الطلبات** | الأوامر و المعلومات الخاصة بنظام الطلبات**
🎁 جيف اوي** | الأوامر الخاصة بالجيف اوي**
🔔 تشهير النصابين** | الأوامر و المعلومات الخاصة بتشهير النصابين**
🛠️ الإدارة** | الأوامر و المعلومات الخاصة بالإداريين**
👑 الأونرز** | الأوامر و المعلومات الخاصة بالأونرز**`)
                                        .setColor('Red')
                const row1 = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                                    .setCustomId('helpDelete')
                                                    .setEmoji('🗑️')
                                                    .setStyle(ButtonStyle.Danger)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpHome')
                                                    .setLabel('الرئيسية')
                                                    .setEmoji('🏠')
                                                    .setStyle(ButtonStyle.Primary)
                                                    .setDisabled(true),
                                        new ButtonBuilder()
                                                    .setCustomId('helpGeneral')
                                                    .setLabel('العامة')
                                                    .setEmoji('📚')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpWarnSeller')
                                                    .setLabel('تحذير البائعين')
                                                    .setEmoji('🚨')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpOrder')
                                                    .setLabel('الطلبات')
                                                    .setEmoji('📋')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                                )
                const row2 = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                                    .setCustomId('helpGiveaway')
                                                    .setLabel('جيف اوي')
                                                    .setEmoji('🎁')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpTachhir')
                                                    .setLabel('تشهير النصابين')
                                                    .setEmoji('🔔')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpMod')
                                                    .setLabel('الادارة')
                                                    .setEmoji('🛠️')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false),
                                        new ButtonBuilder()
                                                    .setCustomId('helpOwners')
                                                    .setLabel('الاونرز')
                                                    .setEmoji('👑')
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setDisabled(false)
                )

                await message.reply({embeds: [embed], components : [row1, row2]});
            } catch (error) {
                console.log(error)
            }
        }
    }
};
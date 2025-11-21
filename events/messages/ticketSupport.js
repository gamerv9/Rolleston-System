const { prefix, images } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const jsonDB = new Database('/database/database.json');
const ms = require("ms");
const cooldown = new Collection();
const { hexEmbedColor } = require('../../config.js');

module.exports = {
    name: Events.MessageCreate,
    aliases: ["تكت_دعم"],
    /**
     * 
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.content === prefix + "تكت_دعم") {
            try {
            if(!message.member.permissions.has('Administrator')) return;    
            const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('OpenSupportTicketShowModal').setLabel('الدعم الفني').setEmoji('🎫').setStyle(ButtonStyle.Secondary));
            await message.delete();
            await message.channel.send({embeds : [
                      {
                        "title": "تذكرة الدعم الفني 🛠️",
                        "description": "** ▫️ ممنوع الإزعاج بالمنشن \n▫️ في حال عدم الرد عليك لأكثر من 10 دقائق، يُسمح لك بمنشن <@&1229879383330783283> مرة واحدة فقط \n▫️ ممنوع الاستهبال في الدعم الفني \n▫️ ممنوع فتح تذكرة بدون سبب \n▫️ ممنوع طلب الدعم الفني في مشكلة ليس لها علاقة بالخادم \n▫️ ممنوع التدخل في مشاكل الآخرين أو طلب دعم لمشكلة لا تخصك \n\n\n___🛠 - Shop Staff___ **",
                        "color": hexEmbedColor,
                        "author": {
                          "name":  message.guild.name,
                          "icon_url": message.guild.iconURL({dynamic : true})
                        },
                        "image": {
                          "url": images.support
                        },
                        "thumbnail": {
                          "url": message.client.user.displayAvatarURL({dynamic : true})
                        }
                      }
                    
            ] , components : [btn]})
            } catch (error) {
                console.log(error)
            }
        }
    }
};

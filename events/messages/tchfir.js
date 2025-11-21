const { prefix } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const jsonDB = new Database('/database/database.json');
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
        if (message.content === prefix + "تشفير") {
            if(!message.member.permissions.has('Administrator')) return;
            const embed = new EmbedBuilder()
                                .setAuthor({name : message.guild.name , iconURL : message.guild.iconURL({dynamic : true})})
                                .setTitle('شفر منشورك')
                                .setDescription('** > بامكانك __\`تشفير منشورك\`__ عن طريق الضغط على الزر في الأسفل **')
                                .setThumbnail(message.client.user.displayAvatarURL({dynamic : true}))
                                .setFooter({text : `التنوع والجودة في سيرفرنا` , iconURL : message.guild.iconURL({dynamic : true})})
                                .setImage(images.tchfir || null)
                                .setColor(hexEmbedColor);
            const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('tchfirShowModal').setLabel('شفر منشورك').setEmoji('🔐').setStyle(ButtonStyle.Secondary));
            await message.delete();
            await message.channel.send({embeds : [embed] , components : [btn]});
            await message.channel.send(images.line)
        }
    }
};

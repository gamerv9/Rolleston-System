const { prefix } = require('../../config.js');
const { Message, Collection, EmbedBuilder, Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require('st.db');
const jsonDB = new Database('/database/database.json');
const ms = require("ms");
const cooldown = new Collection();

module.exports = {
    name: Events.MessageCreate,
    aliases: ["شراء"],
    cooldown: '1m',
    /**
     * 
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.content === prefix + "buy") {
            if (!message.channel.name.startsWith('ticket-')) return message.reply(`**😅 | الرجاء فتح تذكرة لبدا عملية الشراء**`);

            const msgID = await jsonDB.get(`buyer_msg_${message.author.id}`);
			if(msgID){
				const channelID = await jsonDB.get(`buyer_channel_${message.author.id}`);
				if(channelID && message.guild.channels.cache.get(channelID)){
					await message.client.channels.cache.get(channelID).messages.fetch(msgID).then(msg => msg.delete()).catch(() => {})
				}
			}
            const select = new StringSelectMenuBuilder()
                .setCustomId('buySelect')
                .setPlaceholder('انفر هنا لشراء الشيء الذي تريده')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('رتبة عادية')
                        .setDescription('لشراء رتبة بائع عادية تمكنك من نشر منشوراتك')
                        .setValue('roleNormal'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('رتبة فخمة')
                        .setDescription('لشراء رتبة بائع نادرة بمميزات قوية')
                        .setValue('roleRare'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('روم خاصة')
                        .setDescription('لشراء روم خاصة باسم انت تختاره')
                        .setValue('privateRoom'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('منشور مميز')
                        .setDescription('لشراء منشور مميز بمنشن هير او ايفري ون')
                        .setValue('postSpecial'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('ازالة تحذير')
                        .setDescription('لازالة جميع تحذيراتك')
                        .setValue('warnRemove'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('اعلان')
                        .setDescription('لشراء اعلان لسيرفرك')
                        .setValue('AdS'),
                );
            const selectRow = new ActionRowBuilder().addComponents(select);

            const cancelBtn = new ButtonBuilder().setCustomId('cancelBtn').setLabel('الغاء العملية').setStyle(ButtonStyle.Danger).setEmoji('✖️');

            const discountBtn = new ButtonBuilder().setCustomId('discountBtn').setLabel('كود خصم').setStyle(ButtonStyle.Success).setEmoji('🏷️');
            const gifBtn = new ButtonBuilder().setCustomId('gifBtn').setLabel('اهداء لصديق').setStyle(ButtonStyle.Primary).setEmoji('🎀');
            const btnsRow = new ActionRowBuilder().addComponents(discountBtn , gifBtn , cancelBtn);

            await message.delete();
            await message.channel.send({ content: `**・\`-\` _${message.guild.name}_ مرحبا بك <@${message.author.id}> 👋 ، نورت\n・\`-\` من فضلك قم باختيار الذي تريد شراءه من القائمة التاليه :**`, components: [selectRow, btnsRow] }).then(async (msg) => {
                await jsonDB.set(`buyer_msg_${message.author.id}`, msg.id)
				await jsonDB.set(`buyer_channel_${message.author.id}`, message.channel.id)
            })

        }
    }
};

const { ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, ChannelType } = require("discord.js");
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ارسال-بانل-الطلبات')
    .setDescription('لارسال رسالة نظام الطلبات')
    .addChannelOption(option => option.setName('الروم').setDescription('روم الطلبات').setRequired(false).addChannelTypes(ChannelType.GuildText)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has('Administrator')) return;
        await interaction.deferReply();
        const { options , guild } = interaction;
        const channelOption = await options.getChannel('الروم') || interaction.channel;
        const embed = new EmbedBuilder()
                                .setAuthor({name : guild.name , iconURL : guild.iconURL({dynamic : true})})
                                .setThumbnail(interaction.client.user.avatarURL({dynamic : true}))
                                .setDescription(`
### مرحبًا 🤗 ! 
### > يمكنك طلب __\`اي منتج\`__ ترغب فيه من هنا، 
### > وسيقوم احد البائعين بالتواصل معك


- **اضغط على \`📦\` لـ__طلب منتج__**
- **اضغط على \`📘\` لـ__رؤية قوانين الطلبات__**

_لا نتحمل مسؤولية عدم قراءة القوانين_
                                `)
                                .setColor(hexEmbedColor)
                                .setImage(images.order || null);
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('orderShowModel').setLabel('الطلب').setStyle(1).setEmoji('📦'),new ButtonBuilder().setCustomId('orderRules').setStyle(2).setEmoji('📘'))
        try {
            await channelOption.send({embeds : [embed] , components : [btn]})
            await interaction.editReply({content : `تم ارسال بانل الطلبات` , ephemeral : true})
        } catch (error) {
            console.log('⛔ error in order system' , error)
            await interaction.reply(`لقد حدث خطا يُرجى الاتصال بالمبرمج`)
        }
    }
}
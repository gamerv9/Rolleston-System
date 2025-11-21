const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const tachfirDB = new Database("/database/tachfir.json")
const settingsDB = new Database("/database/settings.json")
const { hexEmbedColor, images } = require('../../config.js');

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(!interaction.isStringSelectMenu()) return;

        if(interaction.customId === "informationsSelect"){
            await interaction.deferReply({ephemeral : true});

            const data = [
                /// معلومات الرتب العامة
                {
                    id : "informationsSelect-rolesNormal",
                    title : "__Normal Roles Informations・معلومات الرتب العامة__",
                    description : "هنا وصف الرتب العامة"
                },
                /// معلومات الرتب الفخمة
                {
                    id : "informationsSelect-rolesVip",
                    title : "__VIP Roles Informations・معلومات الرتب الفخمة__",
                    description : "هنا وصف الرتب الفخمة"
                },
                /// معلومات الرومات الخاصة
                {
                    id : "informationsSelect-privateRooms",
                    title : "__Private Rooms Informations・معلومات الرومات الخاصة__",
                    description : "هنا وصف الرومات الخاصة "
                },
                /// معلومات الاعلانات
                {
                    id : "informationsSelect-ads",
                    title : "__Ads Informations・معلومات الإعلانات__",
                    description : "هنا وصف الإعلانات"
                },
                /// معلومات المنشورات المميزة
                {
                    id : "informationsSelect-posts",
                    title : "__Special Publications Informations・معلومات المنشورات__",
                    description : "هنا وصف المنشورات المميزة"
                },
                /// معلومات الاضافات
                {
                    id : "informationsSelect-options",
                    title : "__Addons Informations・معلومات الاضافات__",
                    description : "هنا وصف الإضافات"
                },
                /// معلومات الأسئلة الشائعة
                {
                    id : "informationsSelect-faq",
                    title : "Common Questions・الاسئلة الشائعة",
                    description : "هنا وصف الأسئلة الشائعة"
                },
            ]

            const currentData = await data.find((d) => d.id == interaction.values[0]);
            if(currentData){
                let embed = new EmbedBuilder()
                                    .setTitle(currentData.title)
                                    .setDescription(currentData.description)
                                    .setColor(hexEmbedColor);
                await interaction.editReply({embeds : [embed]});
            }else{
                await interaction.editReply({content : `**لقد حدث خطأ الرجاء الإتصال بالإدارة**`})
            }
        }
  }
}
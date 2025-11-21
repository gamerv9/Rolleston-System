const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const tachfirDB = new Database("/database/tachfir.json")
const settingsDB = new Database("/database/settings.json")


module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
    */
  async execute(interaction){
        if(interaction.customId == "faqsSelect"){
            if(interaction.values[0] == "faqs1"){
                interaction.reply({content : `**بمجرد الضغط على زر \`الشراء\` وتحديد الرتبة، ستصلك الرتبة تلقائيًا بعد إجراء التحويل.**` , ephemeral : true})
            } else if(interaction.values[0] == "faqs2"){
                interaction.reply({content : `**قم بفتح تذكرة <#1229779508882706472> وسيقوم القاضي بتقديم المساعدة**` , ephemeral : true})
            } else if(interaction.values[0] == "faqs3"){
                interaction.reply({content : `**قدم دليلًا من المحادثة الخاصة بينكما ودليلًا على فوزه بالمزاد، مع إيدي الفائز، وانتظر من الإداري اتخاذ القرار بإعطائه مهلة للتعويض أو إدراجه في القائمة السوداء للمزادات.**` , ephemeral : true})
            } else if(interaction.values[0] == "faqs4"){
                interaction.reply({content : `**أنشئ تذكرة <#1229781187791290389> بناءً على المبلغ الذي ترغب في التوسط عليه، وسيقوم الوسيط بمساعدتك.**` , ephemeral : true})
            } else if(interaction.values[0] == "faqs5"){
                interaction.reply({content : `**بسبب مخالفتك لقوانين السيرفر، كان يجب عليك الاطلاع على قوانين البائعين لتجنب تحذيرات الإداريين. وبعد وصولك لتحذير 100%، سيتم سحب رتبتك.**` , ephemeral : true})
            } else if(interaction.values[0] == "faqs6"){
                interaction.reply({content : `**افتح تذكرة <#1229777834600562761> وسيقوم المسؤولون عن المزاد بمساعدتك.**` , ephemeral : true})
            }

            await interaction.message.edit({components : [interaction.message.components[0],interaction.message.components[1]]})
        }
  }
}
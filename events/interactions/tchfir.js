const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const tachfirDB = new Database("/database/tachfir.json")
const settingsDB = new Database("/database/settings.json")
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(interaction.customId == "tchfirShowModal"){
            const modal = new ModalBuilder().setTitle('تشفير منشور').setCustomId('tchfirSubmitModal');
            const manshor = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('manshor').setLabel('المنشور').setPlaceholder('اكتب المنشور هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(2000))
            modal.addComponents(manshor)
            await interaction.showModal(modal)
        }else if(interaction.customId == "tchfirSubmitModal"){
            let oldManshor = interaction.fields.getTextInputValue('manshor');
            let manshor = interaction.fields.getTextInputValue('manshor');
            let replaced = false;

            const replace = await tachfirDB.get('replace')

            replace.forEach(t => {
                const regex = new RegExp(t.word, 'g');
                if (regex.test(manshor)) {
                  manshor = manshor.replace(regex, t.replace);
                  replaced = true;
                }
            });

            if(replaced){
                const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('نسخ المنشور').setCustomId('manshorCopy').setStyle(ButtonStyle.Primary).setEmoji('📑'));
                await interaction.reply({content : `### > \`⭐\` | منشور بعد التشفير : \n ${manshor}` , components : [btn] , ephemeral : true});
            }else{
                await interaction.reply({content : `### > \`❌\` | منشور لا يحتاج للتشفير` , ephemeral : true});                
            }

            const embed = new EmbedBuilder()
                                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                .setTitle('تشفير جديد')
                                .addFields(
                                    {name : `> العضو` , value : `${interaction.user} | __\`${interaction.user.id}\`__` , inline : false},
                                    {name : `> المنشور الاصلي` , value : `\`\`\`${oldManshor}\`\`\`` , inline : false},
                                    {name : `> المنشور بعد التشفير` , value : `\`\`\`${manshor}\`\`\`` , inline : false},
                                );
            // جلب روم اللوج
            const logChannelId = await settingsDB.get(`tachfirLogsRoom`);
            if(!logChannelId) return;
            let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
            if(!theLogChannel) return;

            await theLogChannel.send({embeds : [embed]}).catch(() => {return;})
        }else if(interaction.customId == "manshorCopy"){

                await interaction.user.send(interaction.message.content).then(async() => {
                    const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('تم نسخه').setCustomId('manshorCopy').setStyle(ButtonStyle.Success).setDisabled(true).setEmoji('✔️'))
                    await interaction.update({content : `** \`✅\` | تم ارسال المنشور الى خاصك . انسخه من هناك **` , components : [btn] , ephemeral : true});
                }).catch(async(error) => {
                    console.log("error in tachfir command" , error.message)
                    const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('حدث خطأ').setCustomId('manshorCopy').setStyle(ButtonStyle.Danger).setDisabled(true).setEmoji('✖️'));
                    await interaction.update({content : `** \`❌\` | يبدو ان خاصك مغلق**` , components : [btn]});
                })

        }
  }
}
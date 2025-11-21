const { Events, Interaction, EmbedBuilder ,InteractionType , ModalBuilder , ActionRowBuilder , TextInputBuilder , TextInputStyle, ButtonBuilder, ButtonStyle} = require('discord.js');
const timestamp = require('discord-timestamp');
const { Database } = require('st.db')
const settingsDB = new Database("/database/settings.json")
const warnSellerDB = new Database("/database/warnSeller.json")
const { hexEmbedColor, images, prefix } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    try {
      if(interaction.commandName === "تحذير البائع"){
        // جلب معلومات نظام تحذيرات البائعين
        const warnSellersSystem = await settingsDB.get(`warnSellersSystem`);
        if(!interaction.member.roles.cache.has(warnSellersSystem.adminRole)) return;
        await warnSellerDB.set(`warn_${interaction.user.id}` , interaction.targetMessage.id)
        const modal = new ModalBuilder().setTitle('سبب التحذير').setCustomId('warnSellerModalSubmit');
        const warnSellerReasonInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('warnSellerReasonInpt').setLabel('نشر بروم غلط / عدم التشفير ...').setStyle(TextInputStyle.Short));

        modal.addComponents(warnSellerReasonInpt);
        await interaction.showModal(modal);
    }else if(interaction.customId === "warnSellerModalSubmit"){
        // جلب سبب التحذير
        const theReason = await interaction.fields.getTextInputValue(`warnSellerReasonInpt`)

        // جلب معلومات نظام تحذيرات البائعين و ايديهات التحذيرات وايديهات رتب البيع
        const warnSellersSystem = await settingsDB.get(`warnSellersSystem`);
        const warnsRolesIDs = await settingsDB.get(`warnsRolesIDs`);
        const normalRolesIDs = await settingsDB.get(`normalRolesIDs`)
        const rareRolesIDs = await settingsDB.get(`rareRolesIDs`);

        // الحصول على ايدي الرسالة و معلومات الرسالة
        const messageId = warnSellerDB.get(`warn_${interaction.user.id}`)

        // اعطاء رتبة التحذير
        let type;
        let RolesBy3 = [normalRolesIDs.role1 , normalRolesIDs.role2 , normalRolesIDs.role3 , normalRolesIDs.role4 , normalRolesIDs.role5 , normalRolesIDs.role6 , normalRolesIDs.role7 , rareRolesIDs.role1 , rareRolesIDs.role2 , rareRolesIDs.role3]
        let warnedMsg = await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(messageId);

        if(!warnedMsg.member.roles.cache.has(warnsRolesIDs.warn1) && !warnedMsg.member.roles.cache.has(warnsRolesIDs.warn2)){
          await warnedMsg.member.roles.add(warnsRolesIDs.warn1)
          type = "تحذير %50"
        }else if(!warnedMsg.member.roles.cache.has(warnsRolesIDs.warn2) && warnedMsg.member.roles.cache.has(warnsRolesIDs.warn1)){
          await warnedMsg.member.roles.add(warnsRolesIDs.warn2)
          type = "تحذير %100"
        }else if(warnedMsg.member.roles.cache.has(warnsRolesIDs.warn1) && warnedMsg.member.roles.cache.has(warnsRolesIDs.warn2)){
          await warnedMsg.member.roles.remove(warnsRolesIDs.warn1)
          await warnedMsg.member.roles.remove(warnsRolesIDs.warn2)
          await warnedMsg.member.roles.remove(RolesBy3);
          type = "سحب الرتبة"
        }

        // ارسال رسالة التحذير
        await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(messageId).then(async(msg) => {
          await interaction.reply({content : `\`✅\` تم تحذير البائع بنجاح` , ephemeral : true})
        const embed = new EmbedBuilder()
                        .setColor(hexEmbedColor)
                        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                        .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                        .addFields(
                            {name : `الاداري` , value : `${interaction.user}` , inline : true},
                            {name : `البائع` , value : `${msg.author}`  , inline : true},
                            {name : `الروم` , value : `${interaction.channel}`  , inline : true},
                            {name : `وقت نشر المنشور` , value : `<t:${timestamp(msg.createdTimestamp)}:R>`  , inline : true},
                            {name : `وقت التحذير` , value : `<t:${timestamp(Date.now())}:R>`  , inline : true},
                            {name : `نوع التحذير` , value : `__\`${type}\`__`  , inline : true},
                            {name : `السبب` , value : `_${theReason}_`  , inline : true},
                            {name : `الدليل` , value : `\`\`\`${msg.content}\`\`\``  , inline : false},
                        );
const warnmsg = await interaction.guild.channels.cache.get(warnSellersSystem.channelID).send({content : `||${msg.author}||`, embeds : [embed]})
await interaction.guild.channels.cache.get(warnSellersSystem.channelID).send(images.line)

await msg.author.send({content : `**> \`👋\` | مرحبا بك _\`${msg.author.username}\`_ 
- \`⚠️\` لقد قام <@${interaction.user.id}> بتحذيرك
- للمزيد من التفاصيل توجه الى https://discord.com/channels/${interaction.channel.id}/${warnSellersSystem.channelID}/${warnmsg.id}**
- - بامكانك ازالة تحذير عن طريق فتح تذكرة و كتابة __\`${prefix}buy\`__` , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('التوجه للرسالة').setStyle(ButtonStyle.Link).setURL(`https://discord.com/channels/${interaction.channel.id}/${warnSellersSystem.channelID}/${warnmsg.id}`))]}).catch(() => {})
await msg.delete();
        }).catch((error) => {
          console.log(`the error is in warn seller` , error)
          interaction.reply({content : `\`❌\` - لقد حدث خطا اتصل بالادارة`})
        })
    }else if(interaction.commandName === "سحب رتبة البائع"){
                  // جلب معلومات نظام تحذيرات البائعين
                  const warnSellersSystem = await settingsDB.get(`warnSellersSystem`);
                  if(!interaction.member.roles.cache.has(warnSellersSystem.adminRole)) return;
                  await warnSellerDB.set(`warn_${interaction.user.id}` , interaction.targetMessage.id)
                  const modal = new ModalBuilder().setTitle('سبب التحذير').setCustomId('sa7bRotbaSellerModalSubmit');
                  const warnSellerReasonInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('sa7bRotbaSellerReasonInpt').setLabel('نشر بروم غلط / عدم التشفير ...').setStyle(TextInputStyle.Short));
      
                  modal.addComponents(warnSellerReasonInpt);
                  await interaction.showModal(modal);
    }else if(interaction.customId == "sa7bRotbaSellerModalSubmit"){
                  // جلب سبب التحذير
                  const theReason = await interaction.fields.getTextInputValue(`sa7bRotbaSellerReasonInpt`)

                  // جلب معلومات نظام تحذيرات البائعين و ايديهات التحذيرات وايديهات رتب البيع
                  const warnSellersSystem = await settingsDB.get(`warnSellersSystem`);
                  const warnsRolesIDs = await settingsDB.get(`warnsRolesIDs`);
                  const normalRolesIDs = await settingsDB.get(`normalRolesIDs`)
                  const rareRolesIDs = await settingsDB.get(`rareRolesIDs`);
      
                  // الحصول على ايدي الرسالة و معلومات الرسالة
                  const messageId = warnSellerDB.get(`warn_${interaction.user.id}`)
      
                  // اعطاء رتبة التحذير
                  let type;
                  let RolesBy3 = [normalRolesIDs.role1 , normalRolesIDs.role2 , normalRolesIDs.role3 , normalRolesIDs.role4 , normalRolesIDs.role5 , normalRolesIDs.role6 , normalRolesIDs.role7 , rareRolesIDs.role1 , rareRolesIDs.role2 , rareRolesIDs.role3]
                  let warnedMsg = await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(messageId);

                  if(warnedMsg.member.roles.cache.has(warnsRolesIDs.warn1)){
                    await warnedMsg.member.roles.remove(warnsRolesIDs.warn1)
                  }else if(warnedMsg.member.roles.cache.has(warnsRolesIDs.warn2)){
                    await warnedMsg.member.roles.remove(warnsRolesIDs.warn2)
                  }
                    await warnedMsg.member.roles.remove(warnsRolesIDs.warn1)
                    await warnedMsg.member.roles.remove(warnsRolesIDs.warn2)
                    await warnedMsg.member.roles.remove(RolesBy3);
                    type = "سحب الرتبة"
                  
                  // ارسال رسالة التحذير
                  await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(messageId).then(async(msg) => {
                    await interaction.reply({content : `\`✅\` تم سحب رتبة البائع بنجاح` , ephemeral : true})
                  const embed = new EmbedBuilder()
                                  .setColor(hexEmbedColor)
                                  .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                  .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                                  .addFields(
                                      {name : `الاداري` , value : `${interaction.user}` , inline : true},
                                      {name : `البائع` , value : `${msg.author}`  , inline : true},
                                      {name : `الروم` , value : `${interaction.channel}`  , inline : true},
                                      {name : `وقت نشر المنشور` , value : `<t:${timestamp(msg.createdTimestamp)}:R>`  , inline : true},
                                      {name : `وقت التحذير` , value : `<t:${timestamp(Date.now())}:R>`  , inline : true},
                                      {name : `نوع التحذير` , value : `__\`${type}\`__`  , inline : true},
                                      {name : `السبب` , value : `_${theReason}_`  , inline : true},
                                      {name : `الدليل` , value : `\`\`\`${msg.content}\`\`\``  , inline : false},
                                  );
      const warnmsg = await interaction.guild.channels.cache.get(warnSellersSystem.channelID).send({content : `||${msg.author}||`, embeds : [embed]})
      await interaction.guild.channels.cache.get(warnSellersSystem.channelID).send(images.line)
      
      await msg.author.send({content : `**> \`👋\` | مرحبا بك _\`${msg.author.username}\`_ 
      - \`⚠️\` لقد قام <@${interaction.user.id}> بسحب رتبتك
       - للمزيد من التفاصيل توجه الى https://discord.com/channels/${interaction.channel.id}/${warnSellersSystem.channelID}/${warnmsg.id}**
      - - بامكانك ازالة تحذير عن طريق فتح تذكرة و كتابة __\`${prefix}buy\`__` , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('التوجه للرسالة').setStyle(ButtonStyle.Link).setURL(`https://discord.com/channels/${interaction.channel.id}/${warnSellersSystem.channelID}/${warnmsg.id}`))]}).catch(() => {})
      await msg.delete();
                  }).catch((error) => {
                    console.log(`the error is in warn seller` , error)
                    interaction.reply({content : `\`❌\` - لقد حدث خطا اتصل بالادارة`})
                  })
    }
    } catch (error) {
      console.log("error in warn seller context menu command" , error)
    }
  }
}
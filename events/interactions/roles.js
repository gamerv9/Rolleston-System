const {Client , ChatInputCommandInteraction , Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const pricesDB = new Database("/database/prices.json")
const settingsDB = new Database("/database/settings.json")
const { Probot } = require("discord-probot-transfer");
const tax = require("../../utils/probotTax")
const { millifytolongify } = require('millifytolongify')
const config = require('../../config.js');

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
  */
  async execute(interaction , client){
        // سلكت منيو رسالة الشراء
        if(interaction.customId == "buySelect"){
            if(interaction.values[0] == "roleNormal"){
              try {
                                  const rolesPrices = pricesDB.get(`normalRoles`);
                const rolesNames = await settingsDB.get(`normalRolesNames`); //--اسم الرتبة--

                let embed = new EmbedBuilder()
                .setColor(config.hexEmbedColor)
                .setTitle('شراء رتبة بائع عادية')
                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                .setDescription(`**### > جميع معلومات الرتب موجودة هنا <#1229660110482178051> **`)
                .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
                .setImage(config.images.rolesNormal || null);
                const row = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('buyNormalRolesSelect')
                                    .setPlaceholder('انقر واختر الرتبة المناسبة لك')
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role1}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role1)}`)
                                        .setValue('role1'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role2}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role2)}`)
                                        .setValue('role2'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role3}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role3)}`)
                                        .setValue('role3'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role4}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role4)}`)
                                        .setValue('role4'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role5}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role5)}`)
                                        .setValue('role5'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role6}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role6)}`)
                                        .setValue('role6'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`@${rolesNames.role7}`)
                                        .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role7)}`)
                                        .setValue('role7'),
                                    ),
                            );
                const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
            await interaction.deferUpdate();
            await interaction.message.edit({content : `` , embeds : [embed] , components : [row , row2]})                
              } catch (error) {
                console.error(`❌ An error occured when buy role`);
                
              }
            }else if(interaction.values[0] == "roleRare"){

              const rolesPrices = pricesDB.get(`rareRoles`);
              const rolesNames = await settingsDB.get(`rareRolesNames`); //--اسم الرتبة--

              let embed = new EmbedBuilder()
              .setColor(config.hexEmbedColor)
              .setTitle('شراء رتبة بائع عادية فخمة')
              .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
              .setDescription(`**### > جميع معلومات الرتب موجودة هنا <#1229660110482178051> **`)
              .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
              .setImage(config.images.rolesVip || null);
              const row = new ActionRowBuilder()
                          .addComponents(
                              new StringSelectMenuBuilder()
                                  .setCustomId('buyRareRolesSelect')
                                  .setPlaceholder('. انقر واختر الرتبة المناسبة لك')
                                  .addOptions(
                                      new StringSelectMenuOptionBuilder()
                                      .setLabel(`@${rolesNames.role1}`)
                                      .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role1)}`)
                                      .setValue('role8'),
                                      new StringSelectMenuOptionBuilder()
                                      .setLabel(`@${rolesNames.role2}`)
                                      .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role2)}`)
                                      .setValue('role9'),
                                      new StringSelectMenuOptionBuilder()
                                      .setLabel(`@${rolesNames.role3}`)
                                      .setDescription(`price : ${millifytolongify.convertToMillify(rolesPrices.role3)}`)
                                      .setValue('role10'),
                                  ),
                          );
              const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
          await interaction.deferUpdate();
          await interaction.message.edit({content : `` , embeds : [embed] , components : [row , row2]})

            }
        }else if (interaction.customId == "buyNormalRolesSelect") {
              // جلب معلومات التحويل : حساب البنك / سعر رتبة / معلومات الرتبة (الايدي / الاسم)
              const rolesPrices = await pricesDB.get(`normalRoles`); //--سعر الرتبة--
              if(!rolesPrices)return;
              const bank = await settingsDB.get('bank'); //--حساب البنك--
              if(!bank)return;
              const rolesNames = await settingsDB.get(`normalRolesNames`); //--اسم الرتبة--
              if(!rolesNames)return;
              const rolesIDs = await settingsDB.get(`normalRolesIDs`); //--ايدي الرتبة--
              if(!rolesIDs)return;
          if(interaction.values[0] == "role1"){ buyNormaleRole(interaction , bank , rolesIDs.role1 , rolesNames.role1 , rolesPrices.role1) }
     else if(interaction.values[0] == "role2"){ buyNormaleRole(interaction , bank , rolesIDs.role2 , rolesNames.role2 , rolesPrices.role2) }
     else if(interaction.values[0] == "role3"){ buyNormaleRole(interaction , bank , rolesIDs.role3 , rolesNames.role3 , rolesPrices.role3) }
     else if(interaction.values[0] == "role4"){ buyNormaleRole(interaction , bank , rolesIDs.role4 , rolesNames.role4 , rolesPrices.role4) }
     else if(interaction.values[0] == "role5"){ buyNormaleRole(interaction , bank , rolesIDs.role5 , rolesNames.role5 , rolesPrices.role5) }
     else if(interaction.values[0] == "role6"){ buyNormaleRole(interaction , bank , rolesIDs.role6 , rolesNames.role6 , rolesPrices.role6) }
     else if(interaction.values[0] == "role7"){ buyNormaleRole(interaction , bank , rolesIDs.role7 , rolesNames.role7 , rolesPrices.role7) }
        }else if(interaction.customId == "buyRareRolesSelect"){
              // جلب معلومات التحويل : حساب البنك / سعر رتبة / معلومات الرتبة (الايدي / الاسم)

              //--سعر الرتبة--
              const rolesPrices = await pricesDB.get(`rareRoles`); 
              if(!rolesPrices)return;
              //--حساب البنك--
              const bank = await settingsDB.get('bank'); 
              if(!bank)return;
              //--اسم الرتبة--
              const rolesNames = await settingsDB.get(`rareRolesNames`);
              if(!rolesNames)return;
              //--ايدي الرتبة--
              const rolesIDs = await settingsDB.get(`rareRolesIDs`);
              if(!rolesIDs)return;
              //-- الكمية المتوفرة من كل رتبة --
              const rareRolesAvailable = await settingsDB.get(`rareRolesAvailable`);
              if(interaction.values[0] == "role8"){
                const role8Available = rareRolesAvailable.role1;
                buyRareRole(interaction , bank , rolesIDs.role1 , rolesNames.role1 , rolesPrices.role1 , role8Available , "role1")
              }else if(interaction.values[0] == "role9"){
                const role9Available = rareRolesAvailable.role2;
                buyRareRole(interaction , bank , rolesIDs.role2 , rolesNames.role2 , rolesPrices.role2 , role9Available , "role2")
              }if(interaction.values[0] == "role10"){
                const role10Available = rareRolesAvailable.role3;
                buyRareRole(interaction , bank , rolesIDs.role3 , rolesNames.role3 , rolesPrices.role3 , role10Available , "role3")
              }
        }
        // 
  }
}


async function buyNormaleRole(interaction ,  bank , roleid , rolename , roleprice) {
  const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
  if(interaction.member.roles.cache.has(roleid)){
    await interaction.deferUpdate();
    await interaction.message.edit({content : `**❌ | <@&${roleid}> - عذرا لديك هذه الرتبة بالفعل**` , components : [row2] , embeds : []});
    return;
  } 
    // كلاينت التحويل لبروبوت
    interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});
  
    // تعديل القائمة بايمبد التحويل
    const embed = new EmbedBuilder()
                      .setTitle(`الرجاء التحويل لاكمال عملية شراء رتبة __\`${rolename}\`__`)
                      .setDescription(`** الرجاء تحويل \`${roleprice}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(roleprice)}\`\`\`\n- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                      .setColor(config.hexEmbedColor)
                      .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                      .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                      .setTimestamp();
    // الرد على العضو بامبيد التحويل
    const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
    const msg2 = await interaction.channel.send(`#credit ${bank} ${tax(roleprice)}`)

    // كليكتير لرسالة التحويل بروبوت
    var check = await interaction.client.probot.collect(interaction, {
                      probotId: `282859044593598464`,
                      owners: [bank],
                      time: 1000 * 60 * 5,
                      userId: interaction.user.id,
                      price: roleprice,
                      fullPrice: false,
                      });
                  
    if(check.status){
                      // حذف رسالة التحويل
                      await msg.delete();
                      await msg2.delete();
                      // ارسال ايمبد تمت عملية التحويل
                      let embedDone = new EmbedBuilder().setColor("Green").setDescription(`
- 😊 **تم شراء رتبة __\`${rolename}\`__ **.
- ⛔ **لا تنسى قراءة قوانين البائ3ين قبل نشر منشورك**.
- 🔏 **تاكد من تشفير منشورك قبل نشره**.`)
                      await interaction.channel.send({embeds: [embedDone]})
  
                      // جلب الرتبة في السيرفر واعطاء رتبة للعضو
                      let role1 = interaction.guild.roles.cache.get(roleid);
                      if(!role1) return interaction.channel.send(`حدث خطا يرجى الاتصال بالادارة`);
                      await interaction.member.roles.add(role1).catch(() => {console.log(`i can't give ${rolename} role`)});
  
                      // جلب روم اللوج من السيرفر
                      const logChannelId = await settingsDB.get(`rolesLogsRoom`)
                      let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
  
                      // ارسال رسالة في روم اللوج
                      var embed2 = new EmbedBuilder()
                      .setColor('Green')
                      .setTitle(`**__New Buying ${rolename} Role__**`)
                      .setDescription(`**Role Type :** __\`Normal Role\`__
                      **Name Buyed a Role :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                      **Role Name :** __${rolename}__
                      **Role ID :** __\`${roleid}\`__
                      **Role Price :** __\`${roleprice}\`__
                      `)
                      await theLogChannel.send({embeds: [embed2]})
                  }else if (check.error) {
                    await msg.delete();
                    await msg2.delete();
                    return interaction.channel.send(`**⌛ الوقت قد انتهي ، ${interaction.user}**`).catch(err =>{})
                  } else {
                    await msg.delete();
                    await msg2.delete();
                    return interaction.channel.send(`**❌ اعد المحاوله. ، ${interaction.user}**`);
  
    }
}

async function buyRareRole(interaction ,  bank , roleid , rolename , roleprice , roleavailable , roletype) {
  const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
  if(interaction.member.roles.cache.has(roleid)){
    await interaction.deferUpdate();
    await interaction.message.edit({content : `**❌ | <@&${roleid}> - عذرا لديك هذه الرتبة بالفعل**` , components : [row2] , embeds : []});
    return;
  }
  if(parseInt(roleavailable) <= parseInt(0)){
    await interaction.deferUpdate();
    await interaction.message.edit({content : `**❌ | <@&${roleid}> - غير متوفرة**` , components : [row2] , embeds : []});
    return;
  }
  // كلاينت التحويل لبروبوت
  interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

  // تعديل القائمة بايمبد التحويل
  const embed = new EmbedBuilder()
                    .setTitle(`الرجاء التحويل لاكمال عملية شراء رتبة __\`${rolename}\`__`)
                    .setDescription(`** الرجاء تحويل \`${roleprice}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(roleprice)}\`\`\`\n- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                    .setColor(config.hexEmbedColor)
                    .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                    .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                    .setTimestamp();
  // الرد على العضو بامبيد التحويل
  const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
  const msg2 = interaction.channel.send(`#credit ${bank} ${tax(roleprice)}`)

  // كليكتير لرسالة التحويل بروبوت
  var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: roleprice,
                    fullPrice: false,
                    });
                
  if(check.status){
                    // انقاص من عدد الرتب المتوفرة
                    const allTheRoleAvailables = await settingsDB.get(`rareRolesAvailable`);
                    allTheRoleAvailables[roletype] = parseInt(roleavailable - 1)
                    await settingsDB.set("rareRolesAvailable" , allTheRoleAvailables)
                    // حذف رسالة التحويل
                    await msg.delete();
                    await msg2.delete();
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`
- 😊 **تم شراء رتبة __\`${rolename}\`__ **
- ⛔ **لا تنسى قراءة قوانين البائ3ين قبل نشر منشورك**
- 🔏 **تاكد من تشفير منشورك قبل نشره**
                      `)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب الرتبة في السيرفر واعطاء رتبة للعضو
                    let role1 = interaction.guild.roles.cache.get(roleid);
                    if(!role1) return interaction.channel.send(`حدث خطا يرجى الاتصال بالادارة`);
                    await interaction.member.roles.add(role1).catch(() => {console.log(`i can't give ${rolename} role`)});

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`rolesLogsRoom`)
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`**__New Buying ${rolename} Role__**`)
                    .setDescription(`**Role Type :** __\`Rare Role\`__
                    **Name Buyed a Role :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **Role Name :** __${rolename}__
                    **Role ID :** __\`${roleid}\`__
                    **Role Price :** __\`${roleprice}\`__
                    `)
                    await theLogChannel.send({embeds: [embed2]})
  } else if (check.error) {
                  await msg.delete();
                  await msg2.delete();
                  return interaction.channel.send(`**⌛ الوقت قد انتهي ، ${interaction.user}**`).catch(err =>{})
  } else {
                  await msg.delete();
                  await msg2.delete();
                  return interaction.channel.send(`**❌ اعد المحاوله ، ${interaction.user}**`);

  }
      
}
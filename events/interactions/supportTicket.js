const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType , ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const { Database } = require('st.db')
const settingsDB = new Database("/database/settings.json");
const supportTicketsDB = new Database("/database/supportTickets.json");
const levelSchema = require('../../database/schemas/level');
const level = require('../../database/schemas/level');
const calculateLevelXp = require('../../utils/calculateLevelXp')
const moment = require("moment");
const ms = require('ms');
const timestamp = require('discord-timestamp');
const config = require('../../config.js')
const staffPointsDB = new Database('/database/staffPoints');
const blacklistDB = new Database('/database/blackList');
const { hexEmbedColor, images } = require('../../config.js')


module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
                if(interaction.customId == "OpenSupportTicketShowModal"){
                  let ticketExists = false;
                        await interaction.guild.channels.cache.forEach(ch => {
                          if(ch.topic === interaction.user.id && ch.parent.id == "1234362665728737364") { /// ضع هنا أيدي كاتيجوري التذاكر
                            ticketExists = true
                            return interaction.reply({content : `** 🤨 | يبدو انك قد فتحت تذكرة بالفعل <#${ch.id}>**` , ephemeral : true})
                          }
                        });
                        if(ticketExists === false){
                          const modal = new ModalBuilder().setTitle('فتح تذكرة دعم').setCustomId('OpenSupportTicketSubmitModal');
                          const reasonInpt = new TextInputBuilder().setCustomId('reasonValue').setLabel('سبب فتح التذكرة').setStyle(TextInputStyle.Paragraph).setPlaceholder('استفسار / شراء ...')
                          const reasonRow = new ActionRowBuilder().addComponents(reasonInpt)
                          modal.addComponents(reasonRow);
                          await interaction.showModal(modal)
                        }
                }else if(interaction.customId == "OpenSupportTicketSubmitModal"){
                  try {
                    const reasonValue = interaction.fields.getTextInputValue('reasonValue');
                    await interaction.reply({content : `⌛ | جاري انشاء التذكرة` , ephemeral : true})   

                    const theTicketsNumbers = supportTicketsDB.get(`supportTicketsNumber`) || 0;
                    const theNewTicketsNumber = theTicketsNumbers + 1

                    const supportTicketsInfos = settingsDB.get('SupportTickets')

                    await interaction.guild.channels
                    .create({
                      name: `ticket-${theNewTicketsNumber}`,
                      type: ChannelType.GuildText,
                      permissionOverwrites: [
                        {
                          id: interaction.guild.id,
                          deny: ["ViewChannel"],
                        },
                        {
                          id: interaction.user.id,
                          allow: ["ViewChannel", "SendMessages"],
                        },
                        {
                          id: `${supportTicketsInfos.supportRole}`,
                          allow: ["ViewChannel", "SendMessages"],
                        },
                      ],
                      parent: `${supportTicketsInfos.ticketsCategory}`,
                      topic : `${interaction.user.id}`
                    }).then(async(c) => {
                        const embed = new EmbedBuilder()
                                                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                                .setFooter({text : `ticket by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                                                .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))
                                                .setDescription(`▫️ **أهلاً وسهلاً في __سيرفر الش-ب__!**

▫️ إذا كنت ترغب في **شراء شيء معين**، يرجى الضغط على زر الشراء أدناه.

▫️ إذا كان لديك **استفسار** حول أي شيء في الخادم، يرجى الانتظار حتى يرد عليك أحد الإداريين.`)
                                                .setColor(config.hexEmbedColor)
                                                .setImage(images.support || null);
                        const reasonEmbed = new EmbedBuilder()
                                                    .addFields({name : `سبب فتح التذكرة` , value : `\`\`\`${reasonValue}\`\`\``})
                                                    .setColor(config.hexEmbedColor)

                        const select = new StringSelectMenuBuilder()
                          .setCustomId('faqsSelect')
                          .setPlaceholder('تحتاج مساعدة ؟')
                          .addOptions(
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('كيف يمكنني بيع منتجات في السيرفر ؟')
                                  .setValue('faqs1'),
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('كيف أقدم بلاغًا عن شخص نصب علي؟')
                                  .setValue('faqs2'),
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('كيف يمكنني الإبلاغ عن شخص زاود ولم يشترِ مني؟')
                                  .setValue('faqs3'),
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('كيف يمكنني طلب وسيط موثوق يتوسط بيننا؟')
                                  .setValue('faqs4'),
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('ماهو سبب سحب رتبتي ؟')
                                  .setValue('faqs5'),
                              new StringSelectMenuOptionBuilder()
                                  .setLabel('ما هي الخطوات اللازمة لطلب مزاد على منتجي؟')
                                  .setValue('faqs6'),
                          );
                        const row = new ActionRowBuilder().addComponents(
                          new ButtonBuilder().setCustomId('buySupportTickets').setLabel('الشراء').setStyle(ButtonStyle.Success).setEmoji('🛒'),
                          new ButtonBuilder().setCustomId('claimSupportTickets').setLabel('الاستلام').setStyle(ButtonStyle.Primary).setEmoji('📩'),
                          new ButtonBuilder().setCustomId('controlSupportTickets').setLabel('مساعد الادارة').setStyle(ButtonStyle.Secondary).setEmoji('⚙️'),
                          new ButtonBuilder().setCustomId('deleteSupportTicket').setLabel('حذف التذكرة').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
                        )
                        const row2 = new ActionRowBuilder().addComponents(select)

                        const msg = await c.send({content : `||<@${interaction.user.id}>|| | <@&${supportTicketsInfos.supportRole}>` , embeds : [embed , reasonEmbed] , components : [row , row2]})
                        await c.send(images.line)
                        await msg.pin();
                        await supportTicketsDB.set(`supportTicketsNumber` , theNewTicketsNumber)
                        await interaction.editReply({content : `😊 | توجه الى التذكرة : <#${c.id}>` , ephemeral : true})
                    })
                  } catch (error) {
                    console.log(error)
                  }
                }else if(interaction.customId == "claimSupportTickets"){
                  try {
                    const supportTicketsInfos = settingsDB.get('SupportTickets')
                    if(!interaction.member.roles.cache.has(supportTicketsInfos.supportRole)) return interaction.update().catch(async() => {return;})
                    
                    let staffData = await staffPointsDB.get("support" + "_" + interaction.user.id);
                    let number = 1;
                    if(staffData){
                          let newNumber = parseInt(staffData.tickets) + parseInt(number)
                          staffData.tickets = newNumber
                          await staffPointsDB.set("support" + "_" + interaction.user.id , staffData);
                    }else{
                          await staffPointsDB.set("support" + "_" + interaction.user.id , {
                              "tickets" : parseInt(number),
                              "warns" : 0
                          })
                    }
              
                    let staffWeekData = await staffPointsDB.get("support" + "_" + "week" + "_" + interaction.user.id);
                    if(staffWeekData){
                          let newNumber = parseInt(staffWeekData.tickets) + parseInt(number)
                          staffWeekData.tickets = newNumber
                          await staffPointsDB.set("support" + "_" + "week" + "_" + interaction.user.id , staffWeekData);
                    }else{
                          await staffPointsDB.set("support" + "_" + "week" + "_" + interaction.user.id , {
                              "tickets" : parseInt(number),
                              "warns" : 0
                          })
                    }

                    const select = new StringSelectMenuBuilder()
                    .setCustomId('faqsSelect')
                    .setPlaceholder('تحتاج مساعدة ؟')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('كيف يمكنني بيع منتجات في السيرفر ؟')
                            .setValue('faqs1'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('كيف أقدم بلاغًا عن شخص نصب علي؟')
                            .setValue('faqs2'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('كيف يمكنني الإبلاغ عن شخص زاود ولم يشترِ مني؟')
                            .setValue('faqs3'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('كيف يمكنني طلب وسيط موثوق يتوسط بيننا؟')
                            .setValue('faqs4'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('ماهو سبب سحب رتبتي ؟')
                            .setValue('faqs5'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('ما هي الخطوات اللازمة لطلب مزاد على منتجي؟')
                            .setValue('faqs6'),
                    );
                    const row = new ActionRowBuilder().addComponents(
                      new ButtonBuilder().setCustomId('buySupportTickets').setLabel('الشراء').setStyle(ButtonStyle.Success).setEmoji('🛒'),
                      new ButtonBuilder().setCustomId('claimSupportTickets').setLabel(`استلمها ${interaction.user.username}`).setStyle(ButtonStyle.Primary).setEmoji('📩').setDisabled(true),
                      new ButtonBuilder().setCustomId('controlSupportTickets').setLabel('مساعد الادارة').setStyle(ButtonStyle.Secondary).setEmoji('⚙️'),
                      new ButtonBuilder().setCustomId('deleteSupportTicket').setLabel('حذف التذكرة').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
                    )
                    const row2 = new ActionRowBuilder().addComponents(select)
  
                    const claimedEmbed = new EmbedBuilder()
                                                  .setDescription(`🛠️ | قام الاداري ${interaction.user} باستلام تذكرتك`)
                                                  .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                                  .setFooter({text : `${interaction.client.user.username}` , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                                                  .setColor(config.hexEmbedColor)
  
                    await interaction.update({components : [row , row2]})
                    await interaction.channel.send({content : `<@${interaction.channel.topic}>` , embeds : [claimedEmbed]})
                    await interaction.channel.send(images.line)  

                    await interaction.channel.setName(`ticket-${interaction.user.username}`)
                  } catch (error) {
                    console.log(error)
                  }
                }else if(interaction.customId == "deleteSupportTicket"){
                    try {
                      const supportTicketsInfos = settingsDB.get('SupportTickets')
                      if(!interaction.member.roles.cache.has(supportTicketsInfos.supportRole)) return interaction.update().catch(async() => {return;})
                      await interaction.channel.send({content : `- ▫️ <@${interaction.channel.topic}> ، سيقوم الاداري بإغلاق التذكرة قريباً.\n- ❔ هل تحتاج إلى مساعدة إضافية ؟` , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('supportTicketCancelBtn').setLabel('نعم').setEmoji('☑️').setStyle(ButtonStyle.Secondary),new ButtonBuilder().setCustomId('supportTicketDeleteBtn').setLabel('لا').setEmoji('✖️').setStyle(ButtonStyle.Danger))]})
                    } catch (error) {
                      console.log(error)
                    }
                }else if(interaction.customId == "supportTicketCancelBtn"){
                  await interaction.message.delete();
                }else if(interaction.customId == "supportTicketDeleteBtn"){
                  await interaction.reply(`**جاري انشاء الترانسكريبت | 💾**`)
                  await interaction.message.delete();
                  // Must be awaited
                  const supportTicketsInfos = settingsDB.get('SupportTickets')
                  const attachment = await discordTranscripts.createTranscript(interaction.channel , {
                    limit: -1,
                    returnType: 'attachment',
                    filename: interaction.channel.name + '.html',
                    saveImages: true,
                    footerText: "Ticket Opened in Shop S",
                    poweredBy: false,
                    saveImages: true,
                    ssr: true
                });

                  const user = await interaction.client.users.cache.get(interaction.channel.topic);
                  const embed = new EmbedBuilder()
                                          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                          .setTitle('اغلاق تذكرة دعم')
                                          .addFields(
                                            {name : `🆔 ايدي التذكرة` , value : `${interaction.channel.id}` , inline : true},
                                            {name : `🔓 فتحها :` , value : `<@${interaction.channel.topic}>` , inline : true},
                                            {name : `🔒 اغلقها :` , value : `<@${interaction.user.id}>` , inline : true},
                                            {name : `⌚ وقت الانشاء :` , value : `<t:${timestamp(moment(interaction.channel.createdTimestamp))}:R>` , inline : true},
                                            {name : `❓ السبب :` , value : `غير محدد` , inline : true}
                                          )
                                          .setTimestamp()
                                          .setColor(config.hexEmbedColor);
                  const msg = await interaction.guild.channels.cache.get(supportTicketsInfos.ticketsLogs).send({files : [attachment]})
                  await interaction.guild.channels.cache.get(supportTicketsInfos.ticketsLogs).send({embeds : [embed] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://mahto.id/chat-exporter?url=${msg.attachments.first().url}`).setLabel("سجل التذكرة"))]})

                  if(user){
                    await user.send({embeds : [embed] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://mahto.id/chat-exporter?url=${msg.attachments.first().url}`).setLabel("سجل التذكرة"))]})
                  }

                  const reply = await interaction.editReply(`**تم حفظ الترانسكريبت | ☑️**`)
                  setTimeout(async() => {
                    await reply.edit(`**جاري حذف التذكرة | 🗑️**`)
                  }, 2_000);
                  setTimeout(async() => {
                    await interaction.channel.delete();
                  }, 4_000);
                }else if (interaction.customId === "controlSupportTickets") {
                    try {
                          const embed = new EmbedBuilder()
                                  .setColor(config.hexEmbedColor)
                                  .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic: true}) })
                                  .setDescription(`**- 📟 أهلاً وسهلا في مساعد الإدارة، اختر الخيار الذي تحتاجه.**`);
                          const select = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
                                  .setCustomId('controlSupportSelect')
                                  .setPlaceholder('في ماذا ساساعدك ؟')
                                  .addOptions(
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('اضافة عضو للتذكرة')
                                          .setValue('addMemberShowModal'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('حذف عضو من التذكرة')
                                          .setValue('removeMemberShowModal'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('تغيير اسم التذكرة')
                                          .setValue('renameTicketShowModal'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('نقل رتبة بيع الى حساب ثاني')
                                          .setValue('transferRoleShowModal'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('نداء الادارة العليا')
                                          .setValue('comeHighStaff'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('اعطاء بلاك ليست لعضو')
                                          .setValue('blacklistMemberShowModal'),
                                      new StringSelectMenuOptionBuilder()
                                          .setLabel('حذف بلاك ليست من عضو')
                                          .setValue('removeBlacklistMemberShowModal'),
                                  ));
                          await interaction.reply({embeds : [embed] , components : [select] , ephemeral : true}).then((msg) => {
                                const collector = interaction.channel.createMessageComponentCollector({
                                  filter: (i) => i.user.id === interaction.user.id,
                                  time: 30_000,
                                  max: 1,
                              });
                              collector.on("collect", async (i) => {
                                  await msg.delete().catch(error => { })
                              });
                              collector.on("end", (collected) => {
                                  if (collected.size === 0) {
                                      if (msg) {
                                          msg.delete().catch(error => { })
                                      }
                                  }
                              });
                          })
                    } catch (error) {
                      console.log(error);
                    }
                }else if(interaction.customId === "controlSupportSelect"){
                    if(interaction.values[0] === "addMemberShowModal"){
                          const modal = new ModalBuilder().setTitle('اضافة عضو للتذكرة').setCustomId('addMemberSubmitModal');
                          const memberIdInp = new TextInputBuilder().setCustomId('addMemberMemberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
                          const inpRow = new ActionRowBuilder().addComponents(memberIdInp);
                          modal.addComponents(inpRow);
                          await interaction.showModal(modal);
                    }else if(interaction.values[0] === "removeMemberShowModal"){
                          const modal = new ModalBuilder().setTitle('حذف عضو من التذكرة').setCustomId('removeMemberSubmitModal');
                          const memberIdInp = new TextInputBuilder().setCustomId('removeMemberMemberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
                          const inpRow = new ActionRowBuilder().addComponents(memberIdInp);
                          modal.addComponents(inpRow);
                          await interaction.showModal(modal);
                    }else if(interaction.values[0] === "renameTicketShowModal"){
                          const modal = new ModalBuilder().setTitle('تغيير اسم التكت').setCustomId('renameTicketSubmitModal');
                          const newNameInp = new TextInputBuilder().setCustomId('newNameValue').setLabel('اسم التذكرة الجديد').setStyle(TextInputStyle.Short).setRequired(true);
                          const inpRow = new ActionRowBuilder().addComponents(newNameInp);
                          modal.addComponents(inpRow);
                          await interaction.showModal(modal);
                    }else if(interaction.values[0] === "transferRoleShowModal"){
                          const modal = new ModalBuilder().setTitle('نقل رتبة بيع').setCustomId('transferRoleSubmitModal');
                          const oldIdInp = new TextInputBuilder().setCustomId('oldAccountId').setLabel('ايدي الحساب القديم').setStyle(TextInputStyle.Short).setRequired(true);
                          const newIdInp = new TextInputBuilder().setCustomId('newAccountId').setLabel('ايدي الحساب الجديد المراد نقل الرتب فيه').setStyle(TextInputStyle.Short).setRequired(true);
                          const inpRow0 = new ActionRowBuilder().addComponents(oldIdInp);
                          const inpRow1 = new ActionRowBuilder().addComponents(newIdInp);
                          modal.addComponents(inpRow0 , inpRow1);
                          await interaction.showModal(modal);
                    }else if(interaction.values[0] === "comeHighStaff"){
                          await interaction.channel.send(`**- ℹ️ هناك من يحتاجك في هذه التذكرة <@&1230015671614701660>**`);
                          await interaction.channel.setName(`في انتظار العليا`);
                    }else if(interaction.values[0] === "blacklistMemberShowModal"){
                          const modal = new ModalBuilder().setTitle('اعطاء بلاك ليست').setCustomId('blacklistMemberSubmitModal');
                          const memberIdInp = new TextInputBuilder().setCustomId('memberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
                          const typeInp = new TextInputBuilder().setCustomId('blacklistType').setLabel('نوع البلاك ليست').setPlaceholder('مزاد / تكت / ادارة').setStyle(TextInputStyle.Short).setRequired(true);
                          const reasonInp = new TextInputBuilder().setCustomId('blacklistReason').setLabel('سبب البلاك ليست').setStyle(TextInputStyle.Short).setRequired(true);
                          const inpRow0 = new ActionRowBuilder().addComponents(memberIdInp);
                          const inpRow1 = new ActionRowBuilder().addComponents(typeInp);
                          const inpRow2 = new ActionRowBuilder().addComponents(reasonInp);
                          modal.addComponents(inpRow0 , inpRow1 , inpRow2);
                          await interaction.showModal(modal);
                }else if(interaction.values[0] === "removeBlacklistMemberShowModal"){
                  const modal = new ModalBuilder().setTitle('ازالة بلاك ليست').setCustomId('removeBlacklistMemberSubmitModal');
                  const memberIdInp = new TextInputBuilder().setCustomId('memberId').setLabel('ايدي العضو').setStyle(TextInputStyle.Short).setRequired(true);
                  const typeInp = new TextInputBuilder().setCustomId('blacklistType').setLabel('نوع البلاك ليست').setPlaceholder('مزاد / تكت / ادارة').setStyle(TextInputStyle.Short).setRequired(true);
                  const inpRow0 = new ActionRowBuilder().addComponents(memberIdInp);
                  const inpRow1 = new ActionRowBuilder().addComponents(typeInp);
                  modal.addComponents(inpRow0 , inpRow1);
                  await interaction.showModal(modal);
        }

                await interaction.message.edit({components : [interaction.message.components[0]]})
                }else if(interaction.customId === "addMemberSubmitModal"){
                  try {
                    const memberId = interaction.fields.getTextInputValue('addMemberMemberId');
                    const theMember = await interaction.client.users.fetch(memberId)
                    if(theMember){
                      await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم اضافة \`${theMember.username}\` للتذكرة**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
                      await interaction.channel.permissionOverwrites.edit(theMember.id , {
                        ViewChannel: true,
                        SendMessages: true
                      })
                    }else{
                      await interaction.reply({embeds : [new EmbedBuilder().setColor('Red').setDescription(`**عذرا لم اجد عضوا بهذا الايدي \`${memberId}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})] , ephemeral : true})
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }else if (interaction.customId === "removeMemberSubmitModal") {
                      const memberId = interaction.fields.getTextInputValue('removeMemberMemberId');
                      const theMember = await interaction.client.users.fetch(memberId).catch(() => {return;})
                    if(theMember){
                      await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم حذف \`${theMember.username}\` من التذكرة**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
                      await interaction.channel.permissionOverwrites.edit(theMember.id , {
                        ViewChannel: false,
                        SendMessages: false
                      })
                    }else{
                      await interaction.reply({embeds : [new EmbedBuilder().setColor('Red').setDescription(`**عذرا لم اجد عضوا بهذا الايدي \`${memberId}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})] , ephemeral : true})
                    }
                }else if(interaction.customId === "renameTicketSubmitModal"){
                  const newName = interaction.fields.getTextInputValue('newNameValue');
                  await interaction.reply({embeds : [new EmbedBuilder().setColor('Green').setDescription(`**تم تغيير الاسم التكت ل \`${newName}\`**`).setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).setFooter({text : `Requested by : ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})]})
                  await interaction.channel.setName(newName)
                }else if (interaction.customId === "transferRoleSubmitModal") {
                    const oldAccountId = interaction.fields.getTextInputValue('oldAccountId');
                    const newAccountId = interaction.fields.getTextInputValue('newAccountId');
                    
                    try {
                        const oldMember = await interaction.guild.members.fetch(oldAccountId);
                        const newMember = await interaction.guild.members.fetch(newAccountId);
                        
                        if (oldMember && newMember) {
                            const roleIds = await settingsDB.get(`rolesIds`) || []
                            if(!oldMember.roles.cache.some(role => roleIds.includes(role.id))){
                              return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription(`**هذا العضو \`${oldMember.user.username}\` لا يمتلك اي رتب بيع لنقلها**`)
                                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                ]
                            });
                            }
                            const roles = oldMember.roles.cache.filter(role => roleIds.includes(role.id));
                            
                            for (const [roleId, role] of roles) {
                                await oldMember.roles.remove(role);
                                await newMember.roles.add(role);
                            }
                            const rolesMention = roles.map(role => `<@&${role.id}>`).join(', ');

                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Green')
                                        .setDescription(`**تم نقل جميع الرتب من الحساب القديم \`${oldMember.user.username}\` إلى الحساب الجديد \`${newMember.user.username}\`**`)
                                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                ]
                            });
                            // جلب روم اللوج من السيرفر
                            const logChannelId = await settingsDB.get(`transferLogsRoom`)
                            let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                            // ارسال رسالة في روم اللوج
                            var embed2 = new EmbedBuilder()
                            .setColor('White')
                            .setTitle(`**__New Transfer Roles__**`)
                            .setDescription(`**Staff Username:** __\`${interaction.user.username}\`__ | ${interaction.user}
                            **Old Member :** __\`${oldMember.user.username}\`__ | ${oldMember.user}
                            **New Member :** __\`${newMember.user.username}\`__ | ${newMember.user}
                            **Roles :** __\`${roles? roles.length : 0}\` role__ | ${rolesMention}`)
                            await theLogChannel.send({embeds: [embed2]}).catch(() => {return;})
                        } else {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription(`**عذراً، لم أتمكن من العثور على الحساب القديم أو الجديد باستخدام الأيدي المدخلة.**`)
                                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                ]
                            });
                        }
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setDescription(`**حدث خطأ أثناء نقل الرتب.**`)
                                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            ]
                        });
                    }
              }else if (interaction.customId === "blacklistMemberSubmitModal") {
                try {
                  const memberId = interaction.fields.getTextInputValue(`memberId`);
                  const blacklistType = interaction.fields.getTextInputValue(`blacklistType`);
                  const blacklistReason = interaction.fields.getTextInputValue(`blacklistReason`);
  
                  const theMember = await interaction.guild.members.fetch(memberId).catch(() => {
                    return interaction.reply({content : `**- ❌ لم اعثر على عضو بهذا الايدي \`${memberId}\`**` , ephemeral : true})
                  });
  
                  if(!theMember){
                    return interaction.reply({content : `**- ❌ لم اعثر على عضو بهذا الايدي \`${memberId}\`**` , ephemeral : true})
                  }
  
                  if(!['مزاد' , 'تكت' , 'ادارة'].includes(blacklistType)){
                      return interaction.reply({content : `**- ❌ حدد نوع البلاك ليست: مزاد، تكت، أو ادارة**` , ephemeral : true})
                  }
  
                  const data = await blacklistDB.get(`BlackList`)
                  const blackList = await settingsDB.get(`blackList`);
                  const e = data?.find((t) => t.userid == memberId && t.type == blacklistType)
                  if(e){
                    return interaction.reply({content : `**- ❌ هذا العضو لديه بلاك ليست \`${blacklistType}\` بالفعل**` , ephemeral : true})
                  }
                 let role;
                  if(blacklistType === 'مزاد'){
                    role = blackList.mazad
                  }else if(blacklistType === "تكت"){
                    role = blackList.tickets
                  }else if(blacklistType === "ادارة"){
                    role = blackList.staff
                  }
                 
                     await blacklistDB.push(`BlackList`, {
                         userid: memberId,
                         type: blacklistType,
                         role: role, 
                         reason : blacklistReason
                     });
                 
                  await theMember.roles.add(role)
                  
                  await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`**تم اضافة \`${theMember.user.username}\` الى قائمة بلاك ليست __\`${blacklistType}\`__**`)
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    ]
                });
  
                  // جلب روم اللوج من السيرفر
                  const logChannelId = await settingsDB.get(`blackListLogsRoom`)
                  let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
  
                  // ارسال رسالة في روم اللوج
                  var embed2 = new EmbedBuilder()
                                      .setColor('Green')
                                      .setTitle(`**__New Add BlackList__**`)
                                      .setDescription(`**Staff Username:** __\`${interaction.user.username}\`__ | ${interaction.user}
                                      **BlackList Type :** __\`${blacklistType}\`__
                                      **BlackList Member :** __\`${theMember.user.username}\`__ | ${theMember.user}
                                      **Reason :** __\`${blacklistReason}\`__`)
                  await theLogChannel.send({embeds: [embed2]}).catch(() => {return;})  
                } catch (error) {
                  console.log(error);
                }
              }else if (interaction.customId === "removeBlacklistMemberSubmitModal") {
                const memberId = interaction.fields.getTextInputValue(`memberId`);
                const blacklistType = interaction.fields.getTextInputValue(`blacklistType`);

                const theMember = await interaction.guild.members.fetch(memberId);

                if(!theMember){
                  return interaction.reply({content : `**- ❌ لم اعثر على عضو بهذا الايدي \`${memberId}\`**` , ephemeral : true})
                }

                if(!['مزاد' , 'تكت' , 'ادارة'].includes(blacklistType)){
                    return interaction.reply({content : `**- ❌ حدد نوع البلاك ليست: مزاد، تكت، أو ادارة**` , ephemeral : true})
                }

                const data = await blacklistDB.get(`BlackList`)
                const blackList = await settingsDB.get(`blackList`);
                const e = data?.find((t) => t.userid == memberId && t.type == blacklistType)
                if(!e){
                  return interaction.reply({content : `**- ❌ هذا العضو ليس لديه بلاك ليست \`${blacklistType}\` لازالته**` , ephemeral : true})
                }
               const role = blacklistType === 'مزاد' ? blackList.mazad : 
               blacklistType === 'تكت' ? blackList.tickets :
               blacklistType === 'ادارة' ? blackList.staff : null 
               
               const updatedData = data.filter((Data) => Data.userid !== memberId && Data.type == blacklistType);
               await blacklistDB.set(`BlackList`, updatedData);
               
                await theMember.roles.remove(role)
                
                await interaction.reply({
                  embeds: [
                      new EmbedBuilder()
                          .setColor('Green')
                          .setDescription(`**تم ازالة \`${theMember.user.username}\` من قائمة بلاك ليست __\`${blacklistType}\`__**`)
                          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                          .setFooter({ text: `Requested by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  ]
              });

                // جلب روم اللوج من السيرفر
                const logChannelId = await settingsDB.get(`blackListLogsRoom`)
                let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                // ارسال رسالة في روم اللوج
                var embed2 = new EmbedBuilder()
                                    .setColor('Red')
                                    .setTitle(`**__New Remove BlackList__**`)
                                    .setDescription(`**Staff Username:** __\`${interaction.user.username}\`__ | ${interaction.user}
                                    **BlackList Type :** __\`${blacklistType}\`__
                                    **BlackList Member :** __\`${theMember.user.username}\`__ | ${theMember.user}
                                    **Reason :** __\`غير محدد\`__`)
                await theLogChannel.send({embeds: [embed2]}).catch(() => {return;})

              }
              
  }
}
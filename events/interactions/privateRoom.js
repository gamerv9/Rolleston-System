const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Database } = require('st.db')
const pricesDB = new Database("/database/prices.json")
const settingsDB = new Database("/database/settings.json")
const { privateRoomsModel } = require('../../database/schemas/privateRoomsModel')
const { Probot } = require("discord-probot-transfer");
const moment = require("moment");
const ms = require('ms');
const timestamp = require('discord-timestamp');
const tax = require("../../utils/probotTax")
const containsBadWord = require('../../utils/containsBadWord');
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(interaction.customId == "buySelect"){
          if(interaction.values[0] == "privateRoom"){
            const bank = await settingsDB.get('bank');
            const privateRoomsPrices = await pricesDB.get(`privateRooms`);
            const availablePrivateRooms = await settingsDB.get(`privateroomsAvailable`);

            if(!privateRoomsPrices || !bank){
                  await interaction.reply({content : `❎ | **عذرا لم يتم تحديد اعدادات الرومات الخاصة**` , ephemeral : true})
                  return;
            } 

            if(!availablePrivateRooms && availablePrivateRooms !== 0){
              await settingsDB.set(`privateroomsAvailable` , 15);
            }

            const userInfos = await privateRoomsModel.findOne({userId : interaction.user.id});
            if(userInfos && interaction.guild.channels.cache.get(userInfos.room_id)){
              let embed_error = new EmbedBuilder().setColor("#b10707").setDescription(`❎ | **لديك روم بالفعل ، لا يمكنك شراء اخرى .**`)
              const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
              await interaction.deferUpdate(); 
              await interaction.message.edit({content : `||<@${interaction.user.id}>||` , embeds : [embed_error] , components : [row2]})
              return;
            }else if(availablePrivateRooms <= 0){
              let embed_error = new EmbedBuilder().setColor("#b10707").setDescription(`❎ | **لا يوجد رومات متوفره حاليا .**`)
              const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
              await interaction.deferUpdate();
              await interaction.message.edit({content : `||<@${interaction.user.id}>||` , embeds : [embed_error] , components : [row2]})
              return;
            }else{
              const embed = new EmbedBuilder()
              .setDescription(`### > الروم الخاصة ب \`${privateRoomsPrices.firstBuy} كريدت\` \n### - هل انت متاكد من مواصلة عملية الشراء ؟`)
              .setColor(hexEmbedColor)
              .setImage(images.privateRooms || null)
              .setThumbnail(interaction.guild.iconURL({dynamic : true}))
              .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
              .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
              .setTimestamp();
              const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('privateRoomPurchaseConfirm').setLabel('نعم').setStyle(ButtonStyle.Success).setEmoji('✔️'),new ButtonBuilder().setCustomId('returnSelect').setLabel('الغاء العملية').setStyle(ButtonStyle.Danger).setEmoji('✖️'))
              await interaction.deferUpdate();
              await interaction.message.edit({content : `||<@${interaction.user.id}>||` , embeds : [embed] , components : [row]})
            }
          }
        }else if(interaction.customId == "privateRoomPurchaseConfirm"){
          const bank = await settingsDB.get('bank');
          const privateRoomsPrices = await pricesDB.get(`privateRooms`);
          interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});
            const now = new Date();
            const targetTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes in milliseconds
            //<t:${Math.floor(targetTime.getTime() / 1000)}:R></t:$>

            const embed = new EmbedBuilder()
                                          .setTitle('الرجاء التحويل لاكمال عملية شراء `روم خاصة`')
                                          .setDescription(`** الرجاء تحويل \`${privateRoomsPrices.firstBuy}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(privateRoomsPrices.firstBuy)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                                          .setColor(hexEmbedColor)
                                          .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                                          .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                                          .setTimestamp();
            const msg = await interaction.message.edit({content : `<t:${Math.floor(targetTime.getTime() / 1000)}:R>` , embeds : [embed] , components : []})
            await interaction.channel.send(`#credit ${bank} ${tax(privateRoomsPrices.firstBuy)}`)
                                          var check = await interaction.client.probot.collect(interaction, {
                                            probotId: `282859044593598464`,
                                            owners: [bank],
                                            time: 1000 * 60 * 5,
                                            userId: interaction.user.id,
                                            price: privateRoomsPrices.firstBuy,
                                            fullPrice: false,
                                            });
            if(check.status){
              // تنقيص روم من الرومات المتوفره
              await settingsDB.add(`privateroomsAvailable` , -1)

              // جلب روم اللوج من السيرفر
              const logChannelId = await settingsDB.get(`privateRoomsLog`)
              let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

              // ارسال ايمبد تمت عملية التحويل
              let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء روم خاصة من قبل ${interaction.user.username}**`)
              await interaction.channel.send({embeds: [embedDone]})

              await msg.delete();


              // انشاء الروم الخاصة بالصلاحيات المناسبة
              const privateRoomsCategory = await settingsDB.get(`privateRoomsCategory`);
              await interaction.guild.channels.create
              (
                {
                name : `〢❃・${interaction.user.username}` ,
                type : 0,
                parent : privateRoomsCategory
                }
              ).then(async(ch) => {
                // انشاء صلاحيات الروم المناسبة لكل من الايفريون و صاحب الروم
                await ch.permissionOverwrites.create(interaction.guild.roles.everyone , {
                  ViewChannel : true,
                  ReadMessageHistory : true,
                  SendMessages : false,
                  SendMessagesInThreads : true,
                  AttachFiles : false,
                  CreatePublicThreads : false,
                  CreatePrivateThreads : false,
                  AddReactions : false,
                  UseApplicationCommands : false,
                  MentionEveryone : false
                })
                await ch.permissionOverwrites.create(interaction.user , {
                  ViewChannel : true,
                  ReadMessageHistory : true,
                  SendMessages : true,
                  SendMessagesInThreads : false,
                  AttachFiles : true,
                  CreatePublicThreads : false,
                  CreatePrivateThreads : false,
                  AddReactions : false,
                  UseApplicationCommands : false,
                  MentionEveryone : true
                })
                // ارسال ايمبد الى الروم الخاصة
                let embed1 = new EmbedBuilder()
                                          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                          .setTitle(`روم خاصة جديدة ✅`)
                                            .setDescription(`
                                          **__مالك الروم الخاصة :__** ${interaction.user}

                                          **__صُنعت بتاريخ__ : ** <t:${timestamp(moment(ch.createdTimestamp))}:D>

                                          **__تنتهي في__ : ** <t:${timestamp(moment(ms("7d")) + Date.now())}:R>
                                          `)
                                          .setColor(hexEmbedColor)
                                          .setFooter({text : interaction.guild.name, iconURL : interaction.guild.iconURL({dynamic: true})})
                                          .setThumbnail(interaction.user.displayAvatarURL({dynamic : true}));
                const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('privateRoomChangeName').setLabel('تغيير الاسم').setStyle(ButtonStyle.Primary).setEmoji('📝'));
                await ch.send({content : `||<@${interaction.user.id}>||` , embeds : [embed1] , components : [btn]}).then(async(msg_c) => {
                  await msg_c.pin();
                  await msg_c.channel.send( images.line)
                  await msg_c.channel.setRateLimitPerUser(3600)

                // ارسال رسالة الى روم اللوج
                var embed2 = new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(`**__New Buying Private Room__**`)
                                    .setDescription(`**Name Room :** __\`${ch.name}\`__
                                    **Name Buyed a Room :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                                    **Subscribe Time The Room :** __<t:${timestamp(moment((ms("7d")) + ch.createdTimestamp))}:R>__
                                    **Ends at Time Room :** __<t:${timestamp(moment((ms("7d")) + ch.createdTimestamp))}:f>__`)
                await theLogChannel.send({embeds: [embed2]})

                // انشاء مودال في مونجو بجميع معلومات الروم
                await privateRoomsModel.create({
                  userId : interaction.user.id,
                  room_id : ch.id,
                  room_price : privateRoomsPrices.firstBuy,
                  room_msg_id : msg_c.id,
                  room_duration : "7d",
                  room_createdAt : Date.now(),
                  room_endedAt : Date.now() + 604_800_000
                })
                })
              })
            }
            
        }else if(interaction.customId == "privateRoomChangeName"){
          const check = await privateRoomsModel.findOne({userId : interaction.user.id , room_id : interaction.channel.id});
          if(check){
            const modal = new ModalBuilder().setTitle('تغيير اسم الروم الخاصة').setCustomId("privateRoomChangeNameModal")
            const nameInpt = new TextInputBuilder().setCustomId('nameInpt').setLabel('الاسم الجديد').setMinLength(3).setMaxLength(15).setPlaceholder('لا يمكنك تغييره الا مرة واحدة').setStyle(TextInputStyle.Short);
            const nameRow = new ActionRowBuilder().addComponents(nameInpt);
            modal.addComponents(nameRow)
            await interaction.showModal(modal)     
          }else{
            await interaction.reply({content : `❌ | انت لست صاحب هذه الروم` , ephemeral : true})
          }
        }else if(interaction.customId == "privateRoomChangeNameModal"){
          // جلب روم اللوج من السيرفر
          const logChannelId = await settingsDB.get(`privateRoomsLog`)
          let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId)
          // جلب الاسم المقدم من صاحب الروم
          const nameValue = interaction.fields.getTextInputValue('nameInpt');
          // التحقق اذا اسم الروم الجديد يحتوي على كلمة محظورة
          if(containsBadWord(nameValue)){
            return interaction.reply({content : `❌ | عذرا يبدو ان اسم الروم يحتوي على كلمة ممنوعه` , ephemeral : true})
          }else{
            await interaction.reply({content : `تم تغيير اسم الروم بنجاح` , ephemeral : true})
            await interaction.message.edit({components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('privateRoomChangeName').setLabel('تم تغيير الاسم الروم').setStyle(ButtonStyle.Secondary).setDisabled(true))]})

            var embed2 = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle(`**__New Change Private Room Name__**`)
            .setDescription(`**Old Name Room :** __\`${interaction.channel.name}\`__
            **New Name Room :** __\`${nameValue}\`__
            **Name Buyed a Room :** __\`${interaction.user.tag}\`__ | ${interaction.user}
            **Id Of Room :** __\`${interaction.channel.id}\`__`)
            await theLogChannel.send({embeds : [embed2]})

            await interaction.channel.setName(`〢❃・${nameValue}`)

        }
        }else if(interaction.customId == "renewConfirm"){
          const check = await privateRoomsModel.findOne({userId : interaction.user.id , room_id : interaction.channel.id});
          if(check){
            const bank = await settingsDB.get('bank');
            const privateRoomsPrices = await pricesDB.get(`privateRooms`);
            interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

            interaction.reply({content : `> يرجى تحويل المبلغ التالي :` , embeds : [new EmbedBuilder().setDescription(`\`\`\`#credit ${bank} ${tax(privateRoomsPrices.renew)}\`\`\``)]})

            var checkTransfer = await interaction.client.probot.collect(interaction, {
              probotId: `282859044593598464`,
              owners: [bank],
              time: 1000 * 60 * 5,
              userId: interaction.user.id,
              price: privateRoomsPrices.renew,
              fullPrice: false,
              });
            
            if(checkTransfer.status){
              // حذف رد التحويل
              await interaction.deleteReply();

              await interaction.channel.send({embeds : [new EmbedBuilder().setColor('Green').setDescription('**تم التحويل بنجاح [جاري تجديد الروم] ...**')]})

              setTimeout(async() => {

                // جلب رتبة ايفري ون و تغيير صلاحيات الروم الخاصة        
                await interaction.channel.permissionOverwrites.create(interaction.guild.roles.everyone , {
                  ViewChannel : true,
                  ReadMessageHistory : true,
                  SendMessages : false,
                  SendMessagesInThreads : true,
                  AttachFiles : false,
                  CreatePublicThreads : false,
                  CreatePrivateThreads : false,
                  AddReactions : false,
                  UseApplicationCommands : false,
                  MentionEveryone : false
                })

                await interaction.channel.permissionOverwrites.create(interaction.user , {
                  ViewChannel : true,
                  ReadMessageHistory : true,
                  SendMessages : true,
                  SendMessagesInThreads : false,
                  AttachFiles : true,
                  CreatePublicThreads : false,
                  CreatePrivateThreads : false,
                  AddReactions : false,
                  UseApplicationCommands : false,
                  MentionEveryone : true
                })

                // تغيير سلو مود الروم لساعة
                await interaction.channel.setRateLimitPerUser(3600);
  
                // حذف جميع الرسائل في الروم و ارسال رسالة التجديد
                await interaction.channel.bulkDelete(100)
                let renewEmbed = new EmbedBuilder()
                                        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                        .setTitle(`تم تجديد الروم الخاصة ✅`)
                                          .setDescription(`
                                        **__مالك الروم الخاصة :__** ${interaction.user}
  
                                        **جٌددت بتاريخ__ : ** <t:${Math.floor(Date.now() / 1000)}:D>
  
                                        **__تنتهي في__ : ** <t:${timestamp(moment(ms("7d")) + Date.now())}:R>
                                        `)
                                        .setColor(hexEmbedColor)
                                        .setFooter({text : interaction.guild.name, iconURL : interaction.guild.iconURL({dynamic: true})})
                                        .setThumbnail(interaction.user.displayAvatarURL({dynamic : true}));
                const msg = await interaction.channel.send({content : `||<@${interaction.user.id}>||` , embeds : [renewEmbed]})
              
  
                // ارسال رسالة في روم اللوج
                const logChannelId = await settingsDB.get(`privateRoomsLog`)
                let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId)
  
                var embed2 = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`**__Renew Private Room__**`)
                .setDescription(`**Name Room :** __\`${interaction.channel.name}\`__
                **Name Buyed a Room :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                **Subscribe Time The Room :** __<t:${Math.floor(Date.now() / 1000)}:D>__
                **Ends at Time Room :** __<t:${timestamp(moment(ms("7d")) + Date.now())}:R>__`)
                await theLogChannel.send({embeds : [embed2]});
                
                // ارسال رسالة الى صاحب الروم الخاصة
                await interaction.user.send({content : `**عميلنا العزيز،**\n**شكرا لتجديد الروم الخاصة <#${interaction.channel.id}>\n\`نتمنى يوما سعيدا لك\`**`})
  
                // تغيير حالة الروم في الداتا بيس
                check.room_endedAt = Date.now() + 604_800_000;
                check.room_status = "on";
                check.room_msg_id = msg.id;
                check.save();
              }, 5_000);
            }
          }else{
              await interaction.reply({content : `❌ | انت لست صاحب هذه الروم` , ephemeral : true})
          }
        }else if(interaction.customId == "renewCancel"){
          const check = await privateRoomsModel.findOne({userId : interaction.user.id , room_id : interaction.channel.id});
          if(check){
            const embed = new EmbedBuilder()
                                  .setDescription(`هل انت متاكد من عدم التجديد ؟`)
                                  .setColor('Yellow');
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('cancelRenewYes').setLabel('نعم').setStyle(ButtonStyle.Danger),
              new ButtonBuilder().setCustomId('cancelRenewNo').setLabel('لا').setStyle(ButtonStyle.Success),
            )
            await interaction.reply({embeds: [embed] , components : [row]})
          }else{
            await interaction.reply({content : `❌ | انت لست صاحب هذه الروم` , ephemeral : true})
          }
        }else if(interaction.customId == "cancelRenewYes"){
          await interaction.reply({embeds : [new EmbedBuilder().setDescription('> جاري حذف الروم ...').setColor('Gold')]});
          // حذف معلومات الروم الخاصة
          await privateRoomsModel.findOneAndDelete({userId : interaction.user.id , room_id : interaction.channel.id}).then(async() => {
                // اضافة روم الى الرومات المتوفره
                await settingsDB.add(`privateroomsAvailable` , 1)
                // ارسال رسالة في روم اللوج
                const logChannelId = await settingsDB.get(`privateRoomsLog`)
                let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId)
  
                var embed2 = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`**__Delete Private Room__**`)
                .setDescription(`**Name Room :** __\`${interaction.channel.name}\`__
                **Name Buyed a Room :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                **The room deleter :** __<@${interaction.user.id}>__`)
                await theLogChannel.send({embeds : [embed2]});

                await interaction.channel.delete();
          }).catch(() => {  
            return interaction.channel.send(`> لقد حدث خطا يرجى الاتصال بالدعم الفني`)
          })

        }else if(interaction.customId == "cancelRenewNo"){
          await interaction.reply({content : `تم الغاء العملية` , ephemeral : true})
          await interaction.message.delete();
        }
  }
}
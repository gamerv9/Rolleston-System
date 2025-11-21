const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder , StringSelectMenuBuilder , StringSelectMenuOptionBuilder , TextInputBuilder , TextInputStyle} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const { Database } = require('st.db')
const pricesDB = new Database("/database/prices.json")
const settingsDB = new Database("/database/settings.json")
const adsDB = new Database("/database/ads.json")
const { Probot } = require("discord-probot-transfer");
const tax = require("../../utils/probotTax")
const { millifytolongify } = require('millifytolongify')
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        // سلكت منيو رسالة الشراء
        if(interaction.customId == "buySelect"){
            if(interaction.values[0] == "AdS"){

                const adsPrices = pricesDB.get(`adsPrices`);
                const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

                let embed = new EmbedBuilder()
                .setColor(hexEmbedColor)
                .setTitle('شراء اعلان لسيرفر ديسكورد')
                .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                .setDescription(`**### > جميع معلومات الاعلانات موجودة هنا <#1229059629640585308> **`)
                .setImage(images.ads || null);
                const row = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('buyAdsSelect')
                                    .setPlaceholder('. انقر واختر الاعلان المناسب لك')
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan1}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan1)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan1'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan2}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan2)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan2'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan3}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan3)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan3'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan4}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan4)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan4'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan5}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan5)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan5'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan6}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan6)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan6'),
                                        new StringSelectMenuOptionBuilder()
                                        .setLabel(`${adsNames.plan7}`)
                                        .setDescription(`السعر : ${millifytolongify.convertToMillify(adsPrices.plan7)}`)
                                        .setEmoji('📣')
                                        .setValue('adsPlan7'),
                                    ),
                            );
                const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
            await interaction.deferUpdate();
            await interaction.message.edit({content : `` , embeds : [embed] , components : [row , row2]})
            }
        }else if (interaction.customId == "buyAdsSelect") {
              // جلب معلومات التحويل : حساب البنك / سعر الاعلان / معلومات الاعلان ( الاسم)
              const adsPrices = pricesDB.get(`adsPrices`);
              if(!adsPrices)return;
              const bank = await settingsDB.get('bank'); //--حساب البنك--
              if(!bank)return;
              const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--
              if(!adsNames)return;
        if (interaction.values[0] == "adsPlan1") { // ----- الخطة 1 --------- بدون منشن
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan1ModalSubmit');
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan1Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(adsInpt)
        await interaction.showModal(modal)
        await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan1ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
        }else if (interaction.values[0] == "adsPlan2") { // ----- الخطة 2 --------- منشن هير
            const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan2ModalSubmit');
            const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan2Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
            modal.addComponents(adsInpt)
            await interaction.showModal(modal)
            await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan2ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
        }else if (interaction.values[0] == "adsPlan3") { // ----- الخطة 3 --------- منشن ايفري ون
            const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan3ModalSubmit');
            const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan3Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
            modal.addComponents(adsInpt)
            await interaction.showModal(modal)
            await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan3ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
        }else if (interaction.values[0] == "adsPlan4") { // ----- الخطة 4 --------- منشن ايفري ون + جيف اوي
            const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan4ModalSubmit');
            const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan4Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
            modal.addComponents(adsInpt)
            await interaction.showModal(modal)
            await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan4ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
            }else if (interaction.values[0] == "adsPlan5") { // ----- الخطة 5 --------- منشن ايفري ون + روم خاصة بدون جيف اوي
                const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan5ModalSubmit');
                const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan5Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
                const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan5Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
                modal.addComponents(nameRoomInpt , adsInpt)
                await interaction.showModal(modal)
                await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan5ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
            }else if (interaction.values[0] == "adsPlan6") { // ----- الخطة 6 --------- منشن ايفري ون + روم خاصة بجيف اوي
                const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan6ModalSubmit');
                const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan6Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
                const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan6Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
                modal.addComponents(nameRoomInpt , adsInpt)
                await interaction.showModal(modal)
                await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan6ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
            }else if (interaction.values[0] == "adsPlan7") { // ----- الخطة 5 --------- منشن ايفري ون + روم خاصة بدون جيف اوي
                const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan7ModalSubmit');
                const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan7Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
                const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan7Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
                modal.addComponents(nameRoomInpt , adsInpt)
                await interaction.showModal(modal)
                await interaction.message.edit({content : images.ads, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsPlan7ShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})     
            }
    }else if(interaction.customId == "adsPlan1ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan1ModalSubmit');
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan1Inpt').setLabel('ضع اعلانك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan2ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan2ModalSubmit');
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan2Inpt').setLabel('ضع اعلانك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan3ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan3ModalSubmit');
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan3Inpt').setLabel('ضع اعلانك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan4ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan4ModalSubmit');
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan4Inpt').setLabel('ضع اعلانك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan5ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan5ModalSubmit');
        const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan5Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan5Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(nameRoomInpt , adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan6ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan6ModalSubmit');
        const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan6Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan6Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(nameRoomInpt , adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan7ShowModal"){
        const modal = new ModalBuilder().setTitle('شراء اعلان').setCustomId('adsPlan7ModalSubmit');
        const nameRoomInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('nameRoomPlan7Inpt').setLabel('ضع اسم الروم هنا ').setStyle(TextInputStyle.Short).setMaxLength(15).setPlaceholder('من فضلك ضع اسم الروم هنا'))
        const adsInpt = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('adsPlan7Inpt').setLabel('ضع اعلانك هنا ').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة اعلانك هنا + رابط السيرفر'))
        modal.addComponents(nameRoomInpt , adsInpt)
        await interaction.showModal(modal)
    }else if(interaction.customId == "adsPlan1ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan1Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan1}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan1}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan1)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan1)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan1,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan1}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم الاعلان
                    const adsChannelMention = await settingsDB.get(`adsChannelMention`);
                    const theadsChannelMention = await interaction.guild.channels.cache.get(adsChannelMention);
                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // ارسال الاعلان في روم الاعلانات
                    const ad = await theadsChannelMention.send({content : `${theNewAd}` , components : [adsMasoulyaBtn]})
                    await theadsChannelMention.send(`تبي زيه ؟ حياك <#1229059629640585308>`)
                    await theadsChannelMention.send(images.line)

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`adsLogsRoom`)
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`**__New Buying Mention AD__**`)
                    .setDescription(`**Mention Type :** __\`No Mention\`__
                    **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **AD Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${adsChannelMention}/${ad.id})__
                    **AD ID :** __\`${ad.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                    // // حذف التذكرة بعد عملية الشراء
                    // await interaction.channel.send(`**تم عملية الشراء سيتم قفل التكت بعد 3 ثواني **`)
                    // setTimeout(async() => {
                    //   await interaction.channel.delete();
                    // }, 3_000);
                }
    }else if(interaction.customId == "adsPlan2ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan2Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan2}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan2}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan2)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan2)}`)

        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan2,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan2}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم الاعلان
                    const adsChannelMention = await settingsDB.get(`adsChannelMention`);
                    const theadsChannelMention = await interaction.guild.channels.cache.get(adsChannelMention);
                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // ارسال الاعلان في روم الاعلانات
                    const ad = await theadsChannelMention.send({content : `${theNewAd} \n \n - ||@here||` , components : [adsMasoulyaBtn]})
                    await theadsChannelMention.send(`تبي زيه ؟ حياك <#1229059629640585308>`)
                    await theadsChannelMention.send(images.line)

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`adsLogsRoom`)
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`**__New Buying Mention AD__**`)
                    .setDescription(`**Mention Type :** __\`Here\`__
                    **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **AD Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${adsChannelMention}/${ad.id})__
                    **AD ID :** __\`${ad.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                    // // حذف التذكرة بعد عملية الشراء
                    // await interaction.channel.send(`**تم عملية الشراء سيتم قفل التكت بعد 3 ثواني **`)
                    // setTimeout(async() => {
                    //   await interaction.channel.delete();
                    // }, 3_000);
                }
    }else if(interaction.customId == "adsPlan3ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan3Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan3}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan3}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan3)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan3)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan3,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan3}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم الاعلان
                    const adsChannelMention = await settingsDB.get(`adsChannelMention`);
                    const theadsChannelMention = await interaction.guild.channels.cache.get(adsChannelMention);
                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // ارسال الاعلان في روم الاعلانات
                    const ad = await theadsChannelMention.send({content : `${theNewAd} \n \n - ||@everyone||` , components : [adsMasoulyaBtn]})
                    await theadsChannelMention.send(`تبي زيه ؟ حياك <#1229059629640585308>`)
                    await theadsChannelMention.send(images.line)

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`adsLogsRoom`);
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`**__New Buying Mention AD__**`)
                    .setDescription(`**Mention Type :** __\`Everyone\`__
                    **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **AD Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${adsChannelMention}/${ad.id})__
                    **AD ID :** __\`${ad.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                }
    }else if(interaction.customId == "adsPlan4ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan4Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan4}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan4}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan4)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan4)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan4,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan4}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم الاعلان
                    const adsGiveawayRoom = await settingsDB.get(`adsGiveawayRoom`);
                    const theadsGiveawayRoom = await interaction.guild.channels.cache.get(adsGiveawayRoom);
                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // ارسال الاعلان في روم الاعلانات
                    const ad = await theadsGiveawayRoom.send({content : `${theNewAd} \n \n - ||@everyone||` , components : [adsMasoulyaBtn]})
                    await theadsGiveawayRoom.send(`+start 24h 2 150k`)
                    setTimeout(async() => {
                        await theadsGiveawayRoom.send(`تبي زيه ؟ حياك <#1229059629640585308>`)
                        await theadsGiveawayRoom.send(images.line)
                    }, 2_000);
                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`adsLogsRoom`);
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`**__New Buying Giveaway AD__**`)
                    .setDescription(`**Mention Type :** __\`Gifts AD\`__
                    **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **AD Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${adsGiveawayRoom}/${ad.id})__
                    **AD ID :** __\`${ad.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                }
    }else if(interaction.customId == "adsPlan5ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan5Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');
        // جلب اسم الروم
        const nameRoomPlan5Inpt = interaction.fields.getTextInputValue(`nameRoomPlan5Inpt`)

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan5}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan5}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan5)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan5)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan5,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan5}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب ايدي كاتيجوري رومات الاعلانات
                    const adsPrivateRoomCategory = await settingsDB.get(`adsPrivateRoomCategory`);

                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // انشاء روم اعلان خاصة
                    await interaction.guild.channels.create({
                        name : `${nameRoomPlan5Inpt}`,
                        type : 0,
                        parent : adsPrivateRoomCategory
                    }).then(async(ch) => {
                        // التعديل على صلاحية الروم
                        await ch.permissionOverwrites.create(interaction.guild.roles.everyone , { ViewChannel : true , ReadMessageHistory : true , SendMessages : false , SendMessagesInThreads : true , AttachFiles : false , CreatePublicThreads : false , CreatePrivateThreads : false , AddReactions : false , UseApplicationCommands : false , MentionEveryone : false })
                        // ارسال الرسائل الي روم الاعلان
                        const embed = new EmbedBuilder().setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).addFields({name : `** نوع الاعلان : **` , value : `__\`${adsNames.plan5}\`__` , inline : false},{name : `** صاحب الروم : **` , value : `__<@${interaction.user.id}>__` , inline : false},{name : `** مدة الاعلان : **` , value : `_\`يومين\`_` , inline : false},).setColor('Green');
                        await ch.send({embeds : [embed]});
                        await ch.send({content : `${theNewAd} \n \n - ||@everyone||` , components : [adsMasoulyaBtn]});
                        await ch.send(`تبي زيه ؟ حياك <#1229059629640585308>`);
                        await ch.send(images.line);

                        // جلب روم اللوج من السيرفر
                        const logChannelId = await settingsDB.get(`adsLogsRoom`);
                        let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
    
                        // ارسال رسالة في روم اللوج
                        var embed2 = new EmbedBuilder()
                        .setColor('LuminousVividPink')
                        .setTitle(`**__New Buying Private Room AD__**`)
                        .setDescription(`**Mention Type :** __\`Everyone\`__
                        **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                        **AD Room Name :** __\`${ch.name}\`__ | ${ch.id}`)
                        const attachment = await discordTranscripts.createTranscript(ch)
                        await theLogChannel.send({embeds: [embed2] , files : [attachment]})
                    })
                    // حذف رسالة التحويل
                    await msg.delete();
                }
    }else if(interaction.customId == "adsPlan6ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan6Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');
        // جلب اسم الروم
        const nameRoomPlan6Inpt = interaction.fields.getTextInputValue(`nameRoomPlan6Inpt`)

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan6}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan6}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan6)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan6)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan6,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan6}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب ايدي كاتيجوري رومات الاعلانات
                    const adsPrivateRoomCategory = await settingsDB.get(`adsPrivateRoomCategory`);

                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // انشاء روم اعلان خاصة
                    await interaction.guild.channels.create({
                        name : `${nameRoomPlan6Inpt}`,
                        type : 0,
                        parent : adsPrivateRoomCategory
                    }).then(async(ch) => {
                        // التعديل على صلاحية الروم
                        await ch.permissionOverwrites.create(interaction.guild.roles.everyone , { ViewChannel : true , ReadMessageHistory : true , SendMessages : false , SendMessagesInThreads : true , AttachFiles : false , CreatePublicThreads : false , CreatePrivateThreads : false , AddReactions : false , UseApplicationCommands : false , MentionEveryone : false })
                        // ارسال الرسائل الي روم الاعلان
                        const embed = new EmbedBuilder().setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).addFields({name : `** نوع الاعلان : **` , value : `__\`${adsNames.plan6}\`__` , inline : false},{name : `** صاحب الروم : **` , value : `__<@${interaction.user.id}>__` , inline : false},{name : `** مدة الاعلان : **` , value : `_\`3 ايام\`_` , inline : false},).setColor('Green');
                        await ch.send({embeds : [embed]});
                        await ch.send({content : `${theNewAd} \n \n - ||@everyone||` , components : [adsMasoulyaBtn]});
                        await ch.send(`+start 3d 2 300k`)
                        setTimeout(async() => {
                            await ch.send(`تبي زيه ؟ حياك <#1229059629640585308>`);
                            await ch.send(images.line);
                        }, 2_500);

                        // جلب روم اللوج من السيرفر
                        const logChannelId = await settingsDB.get(`adsLogsRoom`);
                        let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
    
                        // ارسال رسالة في روم اللوج
                        var embed2 = new EmbedBuilder()
                        .setColor('LuminousVividPink')
                        .setTitle(`**__New Buying Private Room AD + Giveaway__**`)
                        .setDescription(`**Mention Type :** __\`Everyone\`__
                        **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                        **AD Room Name :** __\`${ch.name}\`__ | ${ch.id}`)
                        const attachment = await discordTranscripts.createTranscript(ch)
                        await theLogChannel.send({embeds: [embed2] , files : [attachment]})
                    })
                    // حذف رسالة التحويل
                    await msg.delete();
                }
    }else if(interaction.customId == "adsPlan7ModalSubmit"){
        await interaction.deferReply({ephemeral : true})
        // جلب رسالة الاعلان و حذف اي منشن سواء ايفري ون او حتى هير
        let theAd = interaction.fields.getTextInputValue(`adsPlan7Inpt`);
        let theNewAd = theAd.replace(/@(everyone|here)/gi, '');
        // جلب اسم الروم
        const nameRoomPlan7Inpt = interaction.fields.getTextInputValue(`nameRoomPlan7Inpt`)

        // جلب معلومات التحويل : حساب البنك / سعر الاعلانات / اسماء الاعلانات
        const adsPrices = pricesDB.get(`adsPrices`)
        const bank = await settingsDB.get('bank');
        const adsNames = await settingsDB.get(`adsNames`); //--اسم الرتبة--

        // كلاينت التحويل لبروبوت
        interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

        // تعديل القائمة بايمبد التحويل
        const embed = new EmbedBuilder()
                            .setTitle(`الرجاء التحويل لاكمال عملية شراء \`${adsNames.plan7}\``)
                            .setDescription(`** الرجاء تحويل \`${adsPrices.plan7}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(adsPrices.plan7)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                            .setColor(hexEmbedColor)
                            .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                            .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                            .setTimestamp();
        // الرد على العضو بامبيد التحويل
        const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
        await interaction.channel.send(`#credit ${bank} ${tax(adsPrices.plan7)}`)
        await interaction.editReply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});


        // كليكتير لرسالة التحويل بروبوت
        var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: adsPrices.plan7,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`${adsNames.plan7}\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب ايدي كاتيجوري رومات الاعلانات
                    const adsFirstPrivateRoomCategory = await settingsDB.get(`adsFirstPrivateRoomCategory`);

                    // زر الخلاء من مسؤولية الاعلانات
                    const adsMasoulyaBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('adsMasoulyaBtn').setStyle(ButtonStyle.Danger).setLabel(`اعلان مدفوع ليس لنا علاقة بما يحدث في السيرفر`).setEmoji('❕').setDisabled(true));
                    // انشاء روم اعلان خاصة
                    const firstChannel = interaction.guild.channels.cache.first();
                    await interaction.guild.channels.create({
                        name : `${nameRoomPlan7Inpt}`,
                        type : 0,
                        parent : adsFirstPrivateRoomCategory
                    }).then(async(ch) => {
                        // التعديل على صلاحية الروم
                        await ch.permissionOverwrites.create(interaction.guild.roles.everyone , { ViewChannel : true , ReadMessageHistory : true , SendMessages : false , SendMessagesInThreads : true , AttachFiles : false , CreatePublicThreads : false , CreatePrivateThreads : false , AddReactions : false , UseApplicationCommands : false , MentionEveryone : false })
                        // ارسال الرسائل الي روم الاعلان
                        const embed = new EmbedBuilder().setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})}).addFields({name : `** نوع الاعلان : **` , value : `__\`${adsNames.plan7}\`__` , inline : false},{name : `** صاحب الروم : **` , value : `__<@${interaction.user.id}>__` , inline : false},{name : `** مدة الاعلان : **` , value : `_\`3 ايام\`_` , inline : false},).setColor('Green');
                        await ch.send({embeds : [embed]});
                        await ch.send({content : `${theNewAd} \n \n - ||@everyone||` , components : [adsMasoulyaBtn]});
                        await ch.send(`+start 3d 2 400k`)
                        setTimeout(async() => {
                            await ch.send(`تبي زيه ؟ حياك <#1229059629640585308>`);
                            await ch.send(images.line);
                        }, 2_500);

                        // جلب روم اللوج من السيرفر
                        const logChannelId = await settingsDB.get(`adsLogsRoom`);
                        let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 
    
                        // ارسال رسالة في روم اللوج
                        var embed2 = new EmbedBuilder()
                        .setColor('LuminousVividPink')
                        .setTitle(`**__New Buying First Private Room AD + Giveaway__**`)
                        .setDescription(`**Mention Type :** __\`Everyone\`__
                        **Name Buyed an AD :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                        **AD Room Name :** __\`${ch.name}\`__ | ${ch.id}`)
                        const attachment = await discordTranscripts.createTranscript(ch)
                        await theLogChannel.send({embeds: [embed2] , files : [attachment]})
                    })
                    // حذف رسالة التحويل
                    await msg.delete();
                }
    }
        
  }
}
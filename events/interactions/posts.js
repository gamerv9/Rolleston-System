const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const pricesDB = new Database("/database/prices.json")
const settingsDB = new Database("/database/settings.json")
const postsDB = new Database("/database/posts.json")
const { Probot } = require("discord-probot-transfer");
const tax = require("../../utils/probotTax")
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(interaction.customId == "buySelect"){
            if(interaction.values[0] == "postSpecial"){
                const modal = new ModalBuilder()
                                    .setTitle('منشورات مميزة')
                                    .setCustomId('postSpecialModal');
                const manshorInpt = new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('manshorInpt').setLabel('ضع منشورك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة منشورك هنا')
                )
                modal.addComponents(manshorInpt)
                await interaction.showModal(modal)
                await interaction.message.edit({content : images.posts, embeds : [] , components : [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('postShowModal').setLabel('اظهار الموديل').setEmoji('📃').setStyle(ButtonStyle.Success)) , new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))]})
            }
        }else if(interaction.customId == "postSpecialModal"){
            // اول رسالة تلقاها من المودال
            const firstResponse = await interaction.fields.getTextInputValue('manshorInpt');
            // حذف جميع الروابط
            const firstResponseWithoutLinks = firstResponse.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            // حذف جميع المنشن @here او حتى @everyone
            const firstResponseFinal = firstResponseWithoutLinks.replace(/@(everyone|here)/gi, '');
            // جلب اسعار المناشير : ايفري ون / هير
            const postsPrices = pricesDB.get(`posts`)
            if(!postsPrices) return interaction.reply({content : `لم يتم تحديد اسعار المناشير` , ephemeral : true})
            const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('postsSelect')
                    .setPlaceholder('انقر لختيار نوع المنشن')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                        .setLabel(`@Everyone = ${postsPrices.everyone ? postsPrices.everyone : "100k"}`)
                        .setValue('everyonepost'),
                        new StringSelectMenuOptionBuilder()
                        .setLabel(`@Here = ${postsPrices.here ? postsPrices.here : "50k"}`)
                        .setValue('herepost'),
                    ),
            );
            await postsDB.set(`post_${interaction.user.id}` , firstResponseFinal)
            await interaction.reply({content : `** ✅ | تم حفظ المنشور. يُرجى المواصلة **` , ephemeral : true});
            const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('returnSelect').setLabel('العودة').setEmoji('↩️').setStyle(ButtonStyle.Secondary))
            await interaction.message.edit({content: `**من فضلك قم بختيار نوع المنشن من الاسفل**`, components: [row , row2] , embeds : []});
            setTimeout(async() => {
                await interaction.deleteReply();
            }, 200);
            // }
        }else if(interaction.customId == "postsSelect"){
            if(interaction.values[0] == "everyonepost"){
                // جلب معلومات التحويل : حساب البنك / سعر المنشور
                const postsPrices = pricesDB.get(`posts`)
                const bank = await settingsDB.get('bank');

                // كلاينت التحويل لبروبوت
                interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

                // تعديل القائمة بايمبد التحويل
                const embed = new EmbedBuilder()
                .setTitle('الرجاء التحويل لاكمال عملية شراء `منشور مميز ايفري ون`')
                .setDescription(`** الرجاء تحويل \`${postsPrices.everyone}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(postsPrices.everyone)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                .setColor(hexEmbedColor)
                .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                .setTimestamp();
                // الرد على العضو بامبيد التحويل
                const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
                await interaction.channel.send(`#credit ${bank} ${tax(postsPrices.everyone)}`)

                // كليكتير لرسالة التحويل بروبوت
                var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: postsPrices.everyone,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`منشور مميز ايفري ون\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم المناشير المميز و رسالة المنشور الخاصة بالعضو
                    const postsRoom = await settingsDB.get(`postsRoom`);
                    const thePostsRooms = await interaction.guild.channels.cache.get(postsRoom);
                    const postText = await postsDB.get(`post_${interaction.user.id}`)
                    // ارسال المنشور في روم المناشير
                    const post = await thePostsRooms.send(`${postText}
**تواصل مع:** <@${interaction.user.id}>
@everyone`)
                    await thePostsRooms.send( images.line)

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`postsLogsRoom`)
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`**__New Buying Special Post__**`)
                    .setDescription(`**Post Type :** __\`@everyone\`__
                    **Name Buyed a Post :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **Post Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${postsRoom}/${post.id})__
                    **Post ID :** __\`${post.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                }
            }else if(interaction.values[0] == "herepost"){                                
                // جلب معلومات التحويل : حساب البنك / سعر المنشور
                const postsPrices = pricesDB.get(`posts`)
                const bank = await settingsDB.get('bank');

                // كلاينت التحويل لبروبوت
                interaction.client.probot = Probot(interaction.client, {fetchGuilds: true,data: [{fetchMembers: true,guildId: interaction.guild.id,probotId: "282859044593598464",owners: [bank],},],});

                // تعديل القائمة بايمبد التحويل
                const embed = new EmbedBuilder()
                .setTitle('الرجاء التحويل لاكمال عملية شراء `منشور مميز هير`')
                .setDescription(`** الرجاء تحويل \`${postsPrices.here}\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(postsPrices.here)}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`)           
                .setColor(hexEmbedColor)
                .setAuthor({name : interaction.client.user.username , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})})
                .setFooter({text : interaction.user.username , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
                .setTimestamp();
                // الرد على العضو بامبيد التحويل
                const msg = await interaction.message.edit({embeds : [embed] , content : `` , components : []});
                await interaction.channel.send(`#credit ${bank} ${tax(postsPrices.here)}`)

                // كليكتير لرسالة التحويل بروبوت
                var check = await interaction.client.probot.collect(interaction, {
                    probotId: `282859044593598464`,
                    owners: [bank],
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: postsPrices.here,
                    fullPrice: false,
                    });
                
                if(check.status){
                    // ارسال ايمبد تمت عملية التحويل
                    let embedDone = new EmbedBuilder().setColor("Green").setDescription(`✅ | **تم شراء __\`منشور مميز هير\`__ من قبل ${interaction.user.username}**`)
                    await interaction.channel.send({embeds: [embedDone]})

                    // جلب روم المناشير المميز و رسالة المنشور الخاصة بالعضو
                    const postsRoom = await settingsDB.get(`postsRoom`);
                    const thePostsRooms = await interaction.guild.channels.cache.get(postsRoom);
                    const postText = await postsDB.get(`post_${interaction.user.id}`)
                    // ارسال المنشور في روم المناشير
                    const post = await thePostsRooms.send(`${postText}
**تواصل مع:** <@${interaction.user.id}>
@here`)
                    await thePostsRooms.send(images.line)

                    // جلب روم اللوج من السيرفر
                    const logChannelId = await settingsDB.get(`postsLogsRoom`)
                    let theLogChannel = interaction.guild.channels.cache.find(c => c.id == logChannelId) 

                    // ارسال رسالة في روم اللوج
                    var embed2 = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`**__New Buying Special Post__**`)
                    .setDescription(`**Post Type :** __\`@here\`__
                    **Name Buyed a Post :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                    **Post Link :** __[URL](https://discord.com/channels/${interaction.guild.id}/${postsRoom}/${post.id})__
                    **Post ID :** __\`${post.id}\`__`)
                    await theLogChannel.send({embeds: [embed2]})

                    // حذف رسالة التحويل
                    await msg.delete();
                }
            }
        }else if(interaction.customId == "postShowModal"){
            const modal = new ModalBuilder()
                                    .setTitle('منشورات مميزة')
                                    .setCustomId('postSpecialModal');
                const manshorInpt = new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('manshorInpt').setLabel('ضع منشورك هنا').setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setPlaceholder('من فضلك ضع رسالة منشورك هنا')
                )
                modal.addComponents(manshorInpt)
                await interaction.showModal(modal)
        }
  }
}
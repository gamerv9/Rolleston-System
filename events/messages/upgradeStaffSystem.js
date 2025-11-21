const { Events, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { prefix, hexEmbedColor } = require('../../config.js');
const { Database } = require('st.db');
const settingsDB = new Database('/database/settings.json');
const staffPointsDB = new Database('/database/staffPoints');
const moment = require('moment');

module.exports = {
    name: Events.MessageCreate,
    aliases: [],
    /**
     * @param {Message} message
     */
    execute: async (message) => {
        if (message.content.startsWith(prefix + "نقط")) {
            const supportRole = await settingsDB.get('supportRole');
            const wassitRole = await settingsDB.get('wassitRole');
            const kadhiRole = await settingsDB.get('kadhiRole');

            const mentionOrID = message.content.split(/\s+/)[1];
            let targetMember;

            if (mentionOrID) {
                targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);
            } else {
                targetMember = message.member;
            }

            if (!targetMember) {
                return message.reply('**منشن حد أو حط الإيدي 😶**');
            }

            if (message.member.roles.cache.has(supportRole)) {
                if (!targetMember.roles.cache.has(supportRole)) {
                    return message.reply(`**😶 الشخص ده مش إداري هنا**`);
                } else {
                    const supportData = await staffPointsDB.get(`support_${targetMember.id}`) || { tickets: 0, warns: 0 };
                    const totalPoints = supportData.tickets + supportData.warns;

                    const supportRawateb = await settingsDB.get('support_Ratb') || [];
                    const supportRatb = supportRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 5000, warns: 3000 };
                    const TotalPrice = (supportRatb.tickets * supportData.tickets) + (supportRatb.warns * supportData.warns);

                    const embed = new EmbedBuilder()
                        .setColor(hexEmbedColor)
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setFields(
                            {
                                name: "** الاداري :**",
                                value: `<@${targetMember.id}>`
                            },
                            {
                                name: "**التكتات :**",
                                value: `\`${supportData.tickets}\``,
                                inline: true
                            },
                            {
                                name: "** التحذيرات : **",
                                value: `\`${supportData.warns}\``,
                                inline: true
                            },
                            {
                                name: "** عدد نقاطه : **",
                                value: `\`${totalPoints}\``,
                                inline: true
                            },
                            {
                                name: "**الكريدت :**",
                                value: `\`${TotalPrice}\``
                            }
                        )
                        .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('allPoints')
                            .setLabel('all')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('weekPoints')
                            .setLabel('week')
                            .setStyle(ButtonStyle.Primary)
                    );

                    const reply = await message.reply({ embeds: [embed], components: [row] });
                    const filter = (i) => i.user.id === message.author.id;
                    const collector = reply.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        filter,
                    });

                    collector.on("collect", async (interaction) => {
                        if (interaction.customId === "allPoints") {
                            await interaction.update({ embeds: [embed], components: [row] });
                        } else if (interaction.customId === "weekPoints") {
                            const supportData = await staffPointsDB.get(`support_week_${targetMember.id}`) || { tickets: 0, warns: 0 };
                            const totalWeekPoints = supportData.tickets + supportData.warns;
        
                            const supportRawateb = await settingsDB.get('support_Ratb') || [];
                            const supportRatb = supportRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 5000, warns: 3000 };
                            const TotalWeekPrice = (supportRatb.tickets * supportData.tickets) + (supportRatb.warns * supportData.warns);
        
                            const weekEmbed = new EmbedBuilder()
                                .setColor(hexEmbedColor)
                                .setThumbnail(message.guild.iconURL({dynamic: true}))
                                .setFields(
                                    {
                                        name: "** الاداري :**",
                                        value: `<@${targetMember.id}>`
                                    },
                                    {
                                        name: "**التكتات :**",
                                        value: `\`${supportData.tickets}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** التحذيرات : **",
                                        value: `\`${supportData.warns}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** عدد نقاطه : **",
                                        value: `\`${totalWeekPoints}\``,
                                        inline: true
                                    },
                                    {
                                        name: "**الكريدت :**",
                                        value: `\`${TotalWeekPrice}\``
                                    }
                                )
                                .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        
                            const weekRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('allPoints')
                                    .setLabel('all')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('weekPoints')
                                    .setLabel('week')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            );

                            await interaction.update({ embeds: [weekEmbed], components: [weekRow] });
                        }
                    });
                }
            } else if (message.member.roles.cache.has(wassitRole)) {
                if (!targetMember.roles.cache.has(wassitRole)) {
                    return message.reply(`**😶 الشخص ده مش وسيط هنا**`);
                } else {
                    const wasitData = await staffPointsDB.get(`wasit_${targetMember.id}`) || { tickets: 0 };
                    const totalPoints = wasitData.tickets;

                    const wasitRawateb = await settingsDB.get('wasit_Ratb') || [];
                    const wasitRatb = wasitRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 2000 };
                    const TotalPrice = wasitRatb.tickets * wasitData.tickets;

                    const embed = new EmbedBuilder()
                        .setColor(hexEmbedColor)
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setFields(
                            {
                                name: "** الوسيط :**",
                                value: `<@${targetMember.id}>`
                            },
                            {
                                name: "**التكتات :**",
                                value: `\`${wasitData.tickets}\``,
                                inline: true
                            },
                            {
                                name: "** عدد نقاطه : **",
                                value: `\`${totalPoints}\``,
                                inline: true
                            },
                            {
                                name: "**الكريدت :**",
                                value: `\`${TotalPrice}\``
                            }
                        )
                        .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('allPoints')
                            .setLabel('all')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('weekPoints')
                            .setLabel('week')
                            .setStyle(ButtonStyle.Primary)
                    );

                    const reply = await message.reply({ embeds: [embed], components: [row] });
                    const filter = (i) => i.user.id === message.author.id;
                    const collector = reply.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        filter,
                    });

                    collector.on("collect", async (interaction) => {
                        if (interaction.customId === "allPoints") {
                            const wasitData = await staffPointsDB.get(`wasit_${targetMember.id}`) || { tickets: 0 };
                            const totalWeekPoints = wasitData.tickets;
        
                            const wasitRawateb = await settingsDB.get('wasit_Ratb') || [];
                            const wasitRatb = wasitRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 2000 };
                            const TotalWeekPrice = wasitRatb.tickets * wasitData.tickets;
        
                            const weekEmbed = new EmbedBuilder()
                                .setColor(hexEmbedColor)
                                .setThumbnail(message.guild.iconURL({dynamic: true}))
                                .setFields(
                                    {
                                        name: "** الوسيط :**",
                                        value: `<@${targetMember.id}>`
                                    },
                                    {
                                        name: "**التكتات :**",
                                        value: `\`${wasitData.tickets}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** عدد نقاطه : **",
                                        value: `\`${totalWeekPoints}\``,
                                        inline: true
                                    },
                                    {
                                        name: "**الكريدت :**",
                                        value: `\`${TotalWeekPrice}\``
                                    }
                                )
                                .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        
                            const weekRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('allPoints')
                                    .setLabel('all')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('weekPoints')
                                    .setLabel('week')
                                    .setStyle(ButtonStyle.Primary)
                            );

                            await interaction.update({ embeds: [weekEmbed], components: [weekRow] });
                        } else if (interaction.customId === "weekPoints") {
                            const wasitData = await staffPointsDB.get(`wasit_week_${targetMember.id}`) || { tickets: 0 };
                            const totalWeekPoints = wasitData.tickets;
        
                            const wasitRawateb = await settingsDB.get('wasit_Ratb') || [];
                            const wasitRatb = wasitRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 2000 };
                            const TotalWeekPrice = wasitRatb.tickets * wasitData.tickets;
        
                            const weekEmbed = new EmbedBuilder()
                                .setColor(hexEmbedColor)
                                .setThumbnail(message.guild.iconURL({dynamic: true}))
                                .setFields(
                                    {
                                        name: "** الوسيط :**",
                                        value: `<@${targetMember.id}>`
                                    },
                                    {
                                        name: "**التكتات :**",
                                        value: `\`${wasitData.tickets}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** عدد نقاطه : **",
                                        value: `\`${totalWeekPoints}\``,
                                        inline: true
                                    },
                                    {
                                        name: "**الكريدت :**",
                                        value: `\`${TotalWeekPrice}\``
                                    }
                                )
                                .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        
                            const weekRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('allPoints')
                                    .setLabel('all')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('weekPoints')
                                    .setLabel('week')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            );

                            await interaction.update({ embeds: [weekEmbed], components: [weekRow] });
                        }
                    });
                }
            } else if (message.member.roles.cache.has(kadhiRole)) {
                if (!targetMember.roles.cache.has(kadhiRole)) {
                    return message.reply(`**😶 الشخص ده مش قاضي هنا**`);
                } else {
                    const kadhiData = await staffPointsDB.get(`kadhi_${targetMember.id}`) || { tickets: 0 };
                    const totalPoints = kadhiData.tickets;

                    const kadhiRawateb = await settingsDB.get('kadhi_Ratb') || [];
                    const kadhiRatb = kadhiRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 1000 };
                    const TotalPrice = kadhiRatb.tickets * kadhiData.tickets;

                    const embed = new EmbedBuilder()
                        .setColor(hexEmbedColor)
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setFields(
                            {
                                name: "** القاضي :**",
                                value: `<@${targetMember.id}>`
                            },
                            {
                                name: "**التكتات :**",
                                value: `\`${kadhiData.tickets}\``,
                                inline: true
                            },
                            {
                                name: "** عدد نقاطه : **",
                                value: `\`${totalPoints}\``,
                                inline: true
                            },
                            {
                                name: "**الكريدت :**",
                                value: `\`${TotalPrice}\``
                            }
                        )
                        .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('allPoints')
                            .setLabel('all')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('weekPoints')
                            .setLabel('week')
                            .setStyle(ButtonStyle.Primary)
                    );

                    const reply = await message.reply({ embeds: [embed], components: [row] });
                    const filter = (i) => i.user.id === message.author.id;
                    const collector = reply.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        filter,
                    });

                    collector.on("collect", async (interaction) => {
                        if (interaction.customId === "allPoints") {
                            const kadhiData = await staffPointsDB.get(`kadhi_${targetMember.id}`) || { tickets: 0 };
                            const totalWeekPoints = kadhiData.tickets;
        
                            const kadhiRawateb = await settingsDB.get('kadhi_Ratb') || [];
                            const kadhiRatb = kadhiRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 1000 };
                            const TotalWeekPrice = kadhiRatb.tickets * kadhiData.tickets;
        
                            const weekEmbed = new EmbedBuilder()
                                .setColor(hexEmbedColor)
                                .setThumbnail(message.guild.iconURL({dynamic: true}))
                                .setFields(
                                    {
                                        name: "** القاضي :**",
                                        value: `<@${targetMember.id}>`
                                    },
                                    {
                                        name: "**التكتات :**",
                                        value: `\`${kadhiData.tickets}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** عدد نقاطه : **",
                                        value: `\`${totalWeekPoints}\``,
                                        inline: true
                                    },
                                    {
                                        name: "**الكريدت :**",
                                        value: `\`${TotalWeekPrice}\``
                                    }
                                )
                                .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        
                            const weekRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('allPoints')
                                    .setLabel('all')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('weekPoints')
                                    .setLabel('week')
                                    .setStyle(ButtonStyle.Primary)
                            );

                            await interaction.update({ embeds: [weekEmbed], components: [weekRow] });
                        } else if (interaction.customId === "weekPoints") {
                            const kadhiData = await staffPointsDB.get(`kadhi_week_${targetMember.id}`) || { tickets: 0 };
                            const totalWeekPoints = kadhiData.tickets;
        
                            const kadhiRawateb = await settingsDB.get('kadhi_Ratb') || [];
                            const kadhiRatb = kadhiRawateb.find((d) => targetMember.roles.cache.has(d.id)) || { tickets: 1000 };
                            const TotalWeekPrice = kadhiRatb.tickets * kadhiData.tickets;
        
                            const weekEmbed = new EmbedBuilder()
                                .setColor(hexEmbedColor)
                                .setThumbnail(message.guild.iconURL({dynamic: true}))
                                .setFields(
                                    {
                                        name: "** القاضي :**",
                                        value: `<@${targetMember.id}>`
                                    },
                                    {
                                        name: "**التكتات :**",
                                        value: `\`${kadhiData.tickets}\``,
                                        inline: true
                                    },
                                    {
                                        name: "** عدد نقاطه : **",
                                        value: `\`${totalWeekPoints}\``,
                                        inline: true
                                    },
                                    {
                                        name: "**الكريدت :**",
                                        value: `\`${TotalWeekPrice}\``
                                    }
                                )
                                .setFooter({ text: `Requested by : ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
        
                            const weekRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('allPoints')
                                    .setLabel('all')
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId('weekPoints')
                                    .setLabel('week')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            );

                            await interaction.update({ embeds: [weekEmbed], components: [weekRow] });
                        }
                    });
                }
            }else{
                return message.reply(`**😶 الشخص ده مش من الطاقم هنا**`);
            }
        }

        if(message.content.startsWith(prefix + "warn(+)")){
            try {
                let mas2oulyat = await settingsDB.get(`mas2oulyat`);
                if(!message.member.roles.cache.some(role => mas2oulyat.supportPoints.includes(role.id))) return;
                const mentionOrID = message.content.split(/\s+/)[1];
                const targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);
                const args = message.content.toLowerCase().split(" ");
                const number = args[2];
                let reason = message.content.split(" ").slice(3).join(" ");
        
                if (!targetMember) {
                    return message.reply('منشن شخص أو حط الإيدي 😶');
                }
                if(!number || isNaN(number) || number <= 0){
                    return message.reply(`**😶 ادخل رقم صحيح**`)
                }
    
                if(!reason){
                    return message.reply(`**🤨 قول لي السبب يا زعيم.**`)
                }
    
                if(targetMember.id === message.author.id){
                    return message.reply(`**🤨 ماينفعش تضيف نقاط لنفسك يا باشا.**`)
                }
    
                const supportRole = await settingsDB.get('supportRole');
    
                let staffType;
                if(targetMember.roles.cache.has(supportRole)){
                    staffType = "support"
                }else{
                    return message.reply(`**🫥 يسطا الاداريين فقط عندهم التحذيرات**`)
                }
                
                let staffData = await staffPointsDB.get(staffType + "_" + targetMember.id);
                if(staffData){
                    let newNumber = parseInt(staffData.warns) + parseInt(number)
                    staffData.warns = newNumber
                    await staffPointsDB.set(staffType + "_" + targetMember.id , staffData);
                }else{
                    await staffPointsDB.set(staffType + "_" + targetMember.id , {
                        "tickets" : 0,
                        "warns" : parseInt(number)
                    })
                }
    
                let staffWeekData = await staffPointsDB.get(staffType + "_" + "week" + "_" + targetMember.id);
                if(staffWeekData){
                    let newNumber = parseInt(staffWeekData.warns) + parseInt(number)
                    staffWeekData.warns = newNumber
                    await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , staffWeekData);
                }else{
                    await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , {
                        "tickets" : 0,
                        "warns" : parseInt(number)
                    })
                }
                
                // جلب روم اللوج من السيرفر
                const logChannelId = await settingsDB.get(`staffPointsLogs`)
                let theLogChannel = message.guild.channels.cache.find(c => c.id == logChannelId) 
    
                // ارسال رسالة في روم اللوج
                var embed2 = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`**__New Adding Warns Points__**`)
                .setDescription(`**Points Type :** __\`Warns\`__
                **Action Type :** __\`Add [+]\`__
                **Name Manager :** __\`${message.author.tag}\`__ | ${message.author.id}
                **Name Staff :** __\`${targetMember.user.username}\`__ | ${targetMember.id}
                **Points Number :** __\`${number}\`__
                **Reason :** __\`${reason}\`__
                `)
                await theLogChannel.send({embeds: [embed2]})
    
                await message.reply(`✅ - تم اضافة ${number} تحذيرات الى _${targetMember.user.username}_`)
            } catch (error) {
                console.log(error);
            }
        }

        if(message.content.startsWith(prefix + "warn(-)")){
            try {
                let mas2oulyat = await settingsDB.get(`mas2oulyat`);
                if(!message.member.roles.cache.some(role => mas2oulyat.supportPoints.includes(role.id))) return;

                const mentionOrID = message.content.split(/\s+/)[1];
                const targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);
                const args = message.content.toLowerCase().split(" ");
                const number = args[2];
                let reason = message.content.split(" ").slice(3).join(" ");
        
                if (!targetMember) {
                    return message.reply('منشن شخص أو حط الإيدي 😶');
                }
                if(!number || isNaN(number) || number <= 0){
                    return message.reply(`**😶 ادخل رقم صحيح**`)
                }
    
                if(!reason){
                    return message.reply(`**🤨 قول لي السبب يا زعيم.**`)
                }
    
                if(targetMember.id === message.author.id){
                    return message.reply(`**🤨 ماينفعش تحذف نقاط من نفسك يا باشا.**`)
                }
    
                const supportRole = await settingsDB.get('supportRole');
    
                let staffType;
                if(targetMember.roles.cache.has(supportRole)){
                    staffType = "support"
                }else{
                    return message.reply(`**🫥 يسطا الاداريين فقط عندهم التحذيرات**`)
                }
                
                let staffData = await staffPointsDB.get(staffType + "_" + targetMember.id);
                let staffWeekData = await staffPointsDB.get(staffType + "_" + "week" + "_" + targetMember.id);
                if(!staffData){
                    return message.reply(`**🫥 الإداري ده معندوش ${number} تحذيرات أساسًا يا كبير.**`)
                }
                if(parseInt(staffData.warns) < parseInt(number)){
                    return message.reply(`**🫥 الإداري ده معندوش ${number} تحذيرات أساسًا يا كبير.**`)
                }

                if(staffData){
                    let newNumber = parseInt(staffData.warns) - parseInt(number)
                    staffData.warns = newNumber
                    await staffPointsDB.set(staffType + "_" + targetMember.id , staffData);
                }

                if(staffWeekData && parseInt(staffWeekData.warns) > parseInt(number)){
                    let newNumber = parseInt(staffWeekData.warns) - parseInt(number)
                    staffWeekData.warns = newNumber
                    await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , staffWeekData);
                }
                
                // جلب روم اللوج من السيرفر
                const logChannelId = await settingsDB.get(`staffPointsLogs`)
                let theLogChannel = message.guild.channels.cache.find(c => c.id == logChannelId) 
    
                // ارسال رسالة في روم اللوج
                var embed2 = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`**__New Removing Warns Points__**`)
                .setDescription(`**Points Type :** __\`Warns\`__
                **Action Type :** __\`Remove [-]\`__
                **Name Manager :** __\`${message.author.tag}\`__ | ${message.author.id}
                **Name Staff :** __\`${targetMember.user.username}\`__ | ${targetMember.id}
                **Points Number :** __\`${number}\`__
                **Reason :** __\`${reason}\`__
                `)
                await theLogChannel.send({embeds: [embed2]})
    
                await message.reply(`✅ - تم حذف ${number} تحذيرات من _${targetMember.user.username}_`)
            } catch (error) {
                console.log(error);
            }
        }

        if(message.content.startsWith(prefix + "ticket(+)")){
            try {
                let mas2oulyat = await settingsDB.get(`mas2oulyat`);
                if(!message.member.roles.cache.some(role => mas2oulyat.supportPoints.includes(role.id))) return;

                const mentionOrID = message.content.split(/\s+/)[1];
                const targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);
                const args = message.content.toLowerCase().split(" ");
                const number = args[2];
                let reason = message.content.split(" ").slice(3).join(" ");
        
                if (!targetMember) {
                    return message.reply('منشن شخص أو حط الإيدي 😶');
                }
                if(!number || isNaN(number) || number <= 0){
                    return message.reply(`**😶 ادخل رقم صحيح**`)
                }
    
                if(!reason){
                    return message.reply(`**🤨 قول لي السبب يا زعيم.**`)
                }
    
                if(targetMember.id === message.author.id){
                    return message.reply(`**🤨 ماينفعش تضيف نقاط لنفسك يا باشا.**`)
                }
    
                const supportRole = await settingsDB.get('supportRole');
                const wassitRole = await settingsDB.get('wassitRole');
                const kadhiRole = await settingsDB.get('kadhiRole');

                if(message.member.roles.cache.has(supportRole) && targetMember.roles.cache.has(supportRole)){
                    try {
                        addTicketsPoints("support" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(wassitRole) && targetMember.roles.cache.has(wassitRole)){
                    try {
                        addTicketsPoints("wasit" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(kadhiRole) && targetMember.roles.cache.has(kadhiRole)){
                    try {
                        addTicketsPoints("kadhi" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    return message.react("❌")
                }
            } catch (error) {
                console.log(error);
            }
        }

        if(message.content.startsWith(prefix + "ticket(-)")){
            try {
                let mas2oulyat = await settingsDB.get(`mas2oulyat`);
                if(!message.member.roles.cache.some(role => mas2oulyat.supportPoints.includes(role.id))) return;

                const mentionOrID = message.content.split(/\s+/)[1];
                const targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);
                const args = message.content.toLowerCase().split(" ");
                const number = args[2];
                let reason = message.content.split(" ").slice(3).join(" ");
        
                if (!targetMember) {
                    return message.reply('منشن شخص أو حط الإيدي 😶');
                }
                if(!number || isNaN(number) || number <= 0){
                    return message.reply(`**😶 ادخل رقم صحيح**`)
                }
    
                if(!reason){
                    return message.reply(`**🤨 قول لي السبب يا زعيم.**`)
                }
    
                if(targetMember.id === message.author.id){
                    return message.reply(`**🤨 ماينفعش تحذف نقاط من نفسك يا باشا.**`)
                }
    
                const supportRole = await settingsDB.get('supportRole');
                const wassitRole = await settingsDB.get('wassitRole');
                const kadhiRole = await settingsDB.get('kadhiRole');

                if(message.member.roles.cache.has(supportRole) && targetMember.roles.cache.has(supportRole)){
                    try {
                        removeTicketsPoints("support" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(wassitRole) && targetMember.roles.cache.has(wassitRole)){
                    try {
                        removeTicketsPoints("wasit" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(kadhiRole) && targetMember.roles.cache.has(kadhiRole)){
                    try {
                        removeTicketsPoints("kadhi" , message , targetMember , staffPointsDB , number , reason)
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    return message.react("❌")
                }
            } catch (error) {
                console.log(error);
            }
        }

        if(message.content.startsWith(prefix + "تصفير-اسبوعي")){
            try {
                let mas2oulyat = await settingsDB.get(`mas2oulyat`);
                if(!message.member.roles.cache.some(role => mas2oulyat.supportPoints.includes(role.id))) return;

                const mentionOrID = message.content.split(/\s+/)[1];
                const targetMember = message.mentions.members.first() || message.guild.members.cache.get(mentionOrID);        
                if (!targetMember) {
                    return message.reply('منشن شخص أو حط الإيدي 😶');
                }
    
                const supportRole = await settingsDB.get('supportRole');
                const wassitRole = await settingsDB.get('wassitRole');
                const kadhiRole = await settingsDB.get('kadhiRole');

                if(message.member.roles.cache.has(supportRole) && targetMember.roles.cache.has(supportRole)){
                    try {
                        tasfirStaffPoints("support" , message , staffPointsDB , targetMember)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(wassitRole) && targetMember.roles.cache.has(wassitRole)){
                    try {
                        tasfirStaffPoints("wasit" , message , staffPointsDB , targetMember)
                    } catch (error) {
                        console.log(error)
                    }
                }else if(message.member.roles.cache.has(kadhiRole) && targetMember.roles.cache.has(kadhiRole)){
                    try {
                        tasfirStaffPoints("kadhi" , message , staffPointsDB , targetMember)
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    return message.react("❌")
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
};

async function addTicketsPoints(staffType , message , targetMember , staffPointsDB , number , reason) {
        let staffData = await staffPointsDB.get(staffType + "_" + targetMember.id);
        if(staffData){
            let newNumber = parseInt(staffData.tickets) + parseInt(number)
            staffData.tickets = newNumber
            await staffPointsDB.set(staffType + "_" + targetMember.id , staffData);
        }else{
            await staffPointsDB.set(staffType + "_" + targetMember.id , {
                "tickets" : parseInt(number),
                "warns" : 0
            })
        }

        let staffWeekData = await staffPointsDB.get(staffType + "_" + "week" + "_" + targetMember.id);
        if(staffWeekData){
            let newNumber = parseInt(staffWeekData.tickets) + parseInt(number)
            staffWeekData.tickets = newNumber
            await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , staffWeekData);
        }else{
            await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , {
                "tickets" : parseInt(number),
                "warns" : 0
            })
        }
        
        // جلب روم اللوج من السيرفر
        const logChannelId = await settingsDB.get(`staffPointsLogs`)
        let theLogChannel = message.guild.channels.cache.find(c => c.id == logChannelId) 

        // ارسال رسالة في روم اللوج
        var embed2 = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`**__New Adding Tickets Points__**`)
        .setDescription(`**Points Type :** __\`Tickets\`__
        **Action Type :** __\`Add [+]\`__
        **Name Manager :** __\`${message.author.tag}\`__ | ${message.author.id}
        **Name Staff :** __\`${targetMember.user.username}\`__ | ${targetMember.id}
        **Points Number :** __\`${number}\`__
        **Reason :** __\`${reason}\`__
        `)
        await theLogChannel.send({embeds: [embed2]})

        await message.reply(`✅ - تم اضافة ${number} تكتات الى _${targetMember.user.username}_`)
}


async function removeTicketsPoints(staffType , message , targetMember , staffPointsDB , number , reason) {
    let staffData = await staffPointsDB.get(staffType + "_" + targetMember.id);
    let staffWeekData = await staffPointsDB.get(staffType + "_" + "week" + "_" + targetMember.id);
    if(!staffData){
        return message.reply(`**🫥 الشخص ده معندوش ${number} تكتات أساسًا يا كبير.**`)
    }
    if(parseInt(staffData.tickets) < parseInt(number)){
        return message.reply(`**🫥 الشخص ده معندوش ${number} تكتات أساسًا يا كبير.**`)
    }

    if(staffData){
        let newNumber = parseInt(staffData.tickets) - parseInt(number)
        staffData.tickets = newNumber
        await staffPointsDB.set(staffType + "_" + targetMember.id , staffData);
    }

    if(staffWeekData && parseInt(staffWeekData.tickets) > parseInt(number)){
        let newNumber = parseInt(staffWeekData.tickets) - parseInt(number)
        staffWeekData.tickets = newNumber
        await staffPointsDB.set(staffType + "_" + "week" + "_" + targetMember.id , staffWeekData);
    }
    
    // جلب روم اللوج من السيرفر
    const logChannelId = await settingsDB.get(`staffPointsLogs`)
    let theLogChannel = message.guild.channels.cache.find(c => c.id == logChannelId) 

    // ارسال رسالة في روم اللوج
    var embed2 = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`**__New Removing Tickets Points__**`)
    .setDescription(`**Points Type :** __\`Tickets\`__
    **Action Type :** __\`Remove [-]\`__
    **Name Manager :** __\`${message.author.tag}\`__ | ${message.author.id}
    **Name Staff :** __\`${targetMember.user.username}\`__ | ${targetMember.id}
    **Points Number :** __\`${number}\`__
    **Reason :** __\`${reason}\`__
    `)
    await theLogChannel.send({embeds: [embed2]})

    await message.reply(`✅ - تم حذف ${number} تكتات من _${targetMember.user.username}_`)
}

async function tasfirStaffPoints(staffType , message , staffPointsDB , targetMember) {
    const staffData = await staffPointsDB.get(`${staffType}_week_${targetMember.id}`);

    if(staffData){    
        let number = staffData?.tickets + "tickets" + staffData?.warns + "warns"
        await staffPointsDB.delete(`${staffType}_week_${targetMember.id}`)
        // جلب روم اللوج من السيرفر
        const logChannelId = await settingsDB.get(`staffPointsLogs`)
        let theLogChannel = message.guild.channels.cache.find(c => c.id == logChannelId) 

        // ارسال رسالة في روم اللوج
        var embed2 = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`**__New Zeroing Points__**`)
        .setDescription(`**Staff Type :** __\`${staffType}\`__
        **Action Type :** __\`Tasfir [∞]\`__
        **Name Manager :** __\`${message.author.tag}\`__ | ${message.author.id}
        **Name Staff :** __\`${targetMember.user.username}\`__ | ${targetMember.id}
        **Points Number :** __\`${number}\`__
        `)
        await theLogChannel.send({embeds: [embed2]})

        await message.reply(`__تم تصفير النقاط الأسبوعية لهذا الإداري ✨🔄__`)
    }else{
        return message.reply(`**😗 ده الإداري لسه ماعندوش نقاط أسبوعية يا زميل.**`)
    }
}
const {
  Events,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Database } = require("st.db");
const pricesDB = new Database("/database/prices.json");
const settingsDB = new Database("/database/settings.json");
const { Probot } = require("discord-probot-transfer");
const tax = require("../../utils/probotTax");
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
   * @param {client} Client
   */
  async execute(interaction) {
    // سلكت منيو رسالة الشراء
    if (interaction.customId == "buySelect") {
      if (interaction.values[0] == "warnRemove") {
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("returnSelect")
            .setLabel("العودة")
            .setEmoji("↩️")
            .setStyle(ButtonStyle.Secondary)
        );
        let normalRolesIDs = (await settingsDB.get(`normalRolesIDs`)) || [];
        let rareRolesIDs = (await settingsDB.get(`rareRolesIDs`)) || [];

        // التحقق اذا الشخص عنده رتبة بائع
        let roles =
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role1
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role2
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role3
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role4
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role5
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role6
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == normalRolesIDs.role7
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == rareRolesIDs.role1
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == rareRolesIDs.role2
          ) ||
          interaction.member.roles.cache.find(
            (y) => y.id == rareRolesIDs.role3
          );
        let embed_error = new EmbedBuilder()
          .setColor("#b10707")
          .setDescription(`\`❎\` **انت لست بائـ3 لإزالة التحذيرات .**`);
        if (!roles) {
          await interaction.deferUpdate();
          await interaction.message.edit({
            content: ``,
            embeds: [embed_error],
            components: [row2],
          });
          return;
        }

        // التحقق اذا الشخص عنده رتب تحذير ( 1 و 2 / 1 فقط / 0 تحذير )
        const warnsRolesIDs = await settingsDB.get(`warnsRolesIDs`);
        let role1 = await interaction.member.roles.cache.has(
          warnsRolesIDs.warn1
        );
        let role2 = await interaction.member.roles.cache.has(
          warnsRolesIDs.warn2
        );

        // لديه تحذير رقم 1 فقط
        if (role1 && !role2) {
          // جلب معلومات التحويل : حساب البنك / سعر التحذير
          const warnsPrices = pricesDB.get(`warnsRoles`);
          const bank = await settingsDB.get("bank");

          // كلاينت التحويل لبروبوت
          interaction.client.probot = Probot(interaction.client, {
            fetchGuilds: true,
            data: [
              {
                fetchMembers: true,
                guildId: interaction.guild.id,
                probotId: "282859044593598464",
                owners: [bank],
              },
            ],
          });

          // تعديل القائمة بايمبد التحويل
          const embed = new EmbedBuilder()
            .setTitle("الرجاء التحويل لاكمال عملية الشراء `لازالة تحذيرك`") // تحذيراتك
            .setDescription(
              `** الرجاء تحويل \`${
                warnsPrices.oneWarn
              }\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(
                warnsPrices.oneWarn
              )}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`
            )
            .setColor(hexEmbedColor)
            .setAuthor({
              name: interaction.client.user.username,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
          // الرد على العضو بامبيد التحويل
          const msg = await interaction.message.edit({
            embeds: [embed],
            content: ``,
            components: [],
          });
          await interaction.channel.send(`#credit ${bank} ${tax(warnsPrices.oneWarn)}`)

          // كليكتير لرسالة التحويل بروبوت
          var check = await interaction.client.probot.collect(interaction, {
            probotId: `282859044593598464`,
            owners: [bank],
            time: 1000 * 60 * 5,
            userId: interaction.user.id,
            price: warnsPrices.oneWarn,
            fullPrice: false,
          });

          if (check.status) {
            // ارسال ايمبد تمت عملية التحويل
            let embedDone = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `✅ | **تم شراء __\`ازالة تحذير\`__ من قبل ${interaction.user.username}**`
              );
            await interaction.channel.send({ embeds: [embedDone] });

            // ازالة التحذيرات من البائع
            if (interaction.member.roles.cache.has(warnsRolesIDs.warn1)) {
              await interaction.member.roles
                .remove(warnsRolesIDs.warn1)
                .catch((err) => {
                  console.log(err);
                  interaction.channel.send(`\`❌\` | حدث خطا اتصل بالادارة`);
                });
            }

            if (interaction.member.roles.cache.has(warnsRolesIDs.warn2)) {
              await interaction.member.roles
                .remove(warnsRolesIDs.warn2)
                .catch(() => {
                  console.log(err);
                  interaction.channel.send(`\`❌\` | حدث خطا اتصل بالادارة`);
                });
            }

            // جلب روم اللوج من السيرفر
            const logChannelId = await settingsDB.get(`warnsLogsRoom`);
            let theLogChannel = interaction.guild.channels.cache.find(
              (c) => c.id == logChannelId
            );

            // ارسال رسالة في روم اللوج
            var embed2 = new EmbedBuilder()
              .setColor("DarkGold")
              .setTitle(`**__New Remove Warns Roles__**`)
              .setDescription(`**Warns Types :** __\`warn1\`__
                                      **Name Buyed a Remove Warns :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                                      **R.Warns Prices :** __\`${warnsPrices.oneWarn}\`__`);
            await theLogChannel.send({ embeds: [embed2] });

            // حذف رسالة التحويل
            await msg.delete();
          }
        }
        // لديه تحذير رقم 1 و 2
        else if (role1 && role2) {
          // جلب معلومات التحويل : حساب البنك / سعر التحذير
          const warnsPrices = pricesDB.get(`warnsRoles`);
          const bank = await settingsDB.get("bank");

          // كلاينت التحويل لبروبوت
          interaction.client.probot = Probot(interaction.client, {
            fetchGuilds: true,
            data: [
              {
                fetchMembers: true,
                guildId: interaction.guild.id,
                probotId: "282859044593598464",
                owners: [bank],
              },
            ],
          });

          // تعديل القائمة بايمبد التحويل
          const embed = new EmbedBuilder()
            .setTitle("الرجاء التحويل لاكمال عملية الشراء `لازالة تحذيرك`") // تحذيراتك
            .setDescription(
              `** الرجاء تحويل \`${
                warnsPrices.twoWarns
              }\` الى <@${bank}>\n \`\`\`#credit ${bank} ${tax(
                warnsPrices.twoWarns
              )}\`\`\`- التحويل في هذه الروم فقط \n- لديك 5 دقائق للتحويل **`
            )
            .setColor(hexEmbedColor)
            .setAuthor({
              name: interaction.client.user.username,
              iconURL: interaction.client.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
          // الرد على العضو بامبيد التحويل
          const msg = await interaction.message.edit({
            embeds: [embed],
            content: ``,
            components: [],
          });
          await interaction.channel.send(`#credit ${bank} ${tax(warnsPrices.twoWarns)}`)

          // كليكتير لرسالة التحويل بروبوت
          var check = await interaction.client.probot.collect(interaction, {
            probotId: `282859044593598464`,
            owners: [bank],
            time: 1000 * 60 * 5,
            userId: interaction.user.id,
            price: warnsPrices.twoWarns,
            fullPrice: false,
          });

          if (check.status) {
            // ارسال ايمبد تمت عملية التحويل
            let embedDone = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `✅ | **تم شراء __\`ازالة تحذير\`__ من قبل ${interaction.user.username}**`
              );
            await interaction.channel.send({ embeds: [embedDone] });

            // ازالة التحذيرات من البائع
            if (interaction.member.roles.cache.has(warnsRolesIDs.warn1)) {
              await interaction.member.roles
                .remove(warnsRolesIDs.warn1)
                .catch((err) => {
                  console.log(err);
                  interaction.channel.send(`\`❌\` | حدث خطا اتصل بالادارة`);
                });
            }

            if (interaction.member.roles.cache.has(warnsRolesIDs.warn2)) {
              await interaction.member.roles
                .remove(warnsRolesIDs.warn2)
                .catch(() => {
                  console.log(err);
                  interaction.channel.send(`\`❌\` | حدث خطا اتصل بالادارة`);
                });
            }

            // جلب روم اللوج من السيرفر
            const logChannelId = await settingsDB.get(`warnsLogsRoom`);
            let theLogChannel = interaction.guild.channels.cache.find(
              (c) => c.id == logChannelId
            );

            // ارسال رسالة في روم اللوج
            var embed2 = new EmbedBuilder()
              .setColor("DarkGold")
              .setTitle(`**__New Remove Warns Roles__**`)
              .setDescription(`**Warns Types :** __\`warn1 && warn2\`__
                                                    **Name Buyed a Remove Warns :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                                                    **R.Warns Prices :** __\`${warnsPrices.twoWarns}\`__`);
            await theLogChannel.send({ embeds: [embed2] });

            // حذف رسالة التحويل
            await msg.delete();
          }
        }
        // ليس دليه اي تحذير
        else {
          let embed_dont_have = new EmbedBuilder()
            .setColor("#b10707")
            .setDescription(`\`❎\` **ليس لديك تحذيرات لإزالتها .**`);
          await interaction.deferUpdate();
          await interaction.message.edit({
            embeds: [embed_dont_have],
            components: [row2],
            content: ``,
          });
          return;
        }
      }
    }
  },
};

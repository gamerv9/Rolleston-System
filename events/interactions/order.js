const {
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  Events,
  Interaction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  time,
} = require("discord.js");
const { Database } = require("st.db");
const settingsDB = new Database("/database/settings.json");
const ordersDB = new Database("/database/orders.json");
const { hexEmbedColor, images } = require('../../config.js')

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    if (interaction.customId == "orderShowModel") {
      const modal = new ModalBuilder()
        .setTitle("الطلبات")
        .setCustomId("orderSubmitModal");
      const theOrder = new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("theOrder")
          .setLabel("الطلب")
          .setPlaceholder("اكتب طلبك هنا")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(150)
      );
      modal.addComponents(theOrder);
      await interaction.showModal(modal);
    } else if (interaction.customId == "orderRules") {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
        .setTitle(`📜 | قوانين الطلبات`)
        .setDescription(
          `**
### > \`🌐\` | القوانين العامة :
- \`❌\` ممنوع الاستهبال بالطلبات.
- \`❌\` ممنوع بيع أي منتج.
- \`❌\` ممنوع الطلب في قسم خاطئ، _مثال_:
 - طلب نيترو في قسم البرمجيات.
 - طلب حساب في قسم التصاميم.

### > \`🚫\` | الكلمات الممنوعة :
- \`❌\` يُمنع ذكر أي كلمة من الكلمات التالية أو حتى مرادف من مرادفاتها :
 - شوب.
 - بيع.
 - شراء.
 - سعر.
 - ثمن.
 - دفع.
- \`✅\` يجب تشفيرها بحذف حرف منها على الأقل، مثال: شوب => ش-ب.

### > \`🚫\` | الطلبات الممنوعة :
- \`❌\` يمنع طلب هذه المنتجات :
 - المواقع الإباحية وكل متعلقاتها.
 - برامج الغش بكل أنواعها.
 - أي نوع من العملات (وهمية / حقيقية).
 - التوكنات وكل متعلقاتها.
 - بوتات مثل بوتاتنا الخاصة.
 - أي منتج مخالف لقوانين الديسكورد.

هذه القوانين تهدف إلى ضمان بيئة آمنة ومنظمة لأعضاء السيرفر.
**`
        )
        .setColor(hexEmbedColor)
        .setImage(images.orderRules || null);

      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (interaction.customId == "orderSubmitModal") {
      const theOrder = await interaction.fields.getTextInputValue("theOrder");

      // حذف جميع الروابط
      const firstResponseWithoutLinks = theOrder.replace(
        /(?:https?|ftp):\/\/[\n\S]+/g,
        ""
      );
      // حذف جميع المنشن @here او حتى @everyone
      const firstResponseFinal = firstResponseWithoutLinks.replace(
        /@(everyone|here)/gi,
        ""
      );

      const select = new StringSelectMenuBuilder()
        .setCustomId("orderSelect")
        .setPlaceholder("اختر هنا")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("منتجات")
            .setDescription("حسابات / نيترو / فيزا / العاب / طرق ...")
            .setValue("montajet")
            .setEmoji("📦"),
          new StringSelectMenuOptionBuilder()
            .setLabel("تصاميم")
            .setDescription("صور سيرفر / لوجو / بانر / صورة مصغرة ...")
            .setValue("tasamim")
            .setEmoji("🖼️"),
          new StringSelectMenuOptionBuilder()
            .setLabel("برمجيات")
            .setDescription("كود / موقع / بوت / اداة ...")
            .setValue("barmajyat")
            .setEmoji("💻")
        );

      await ordersDB.set(`order_${interaction.user.id}`, firstResponseFinal);

      // الرد على المودال
      const selectRow = new ActionRowBuilder().addComponents(select);
      await interaction.reply({
        content: `** > \`💡\` - اختر نوع المنتج من القائمة التالية **`,
        components: [selectRow],
        ephemeral: true,
      });
      setTimeout(async() => {
        interaction.deleteReply();
      }, 15_000);
    } else if (interaction.customId === "orderSelect") {
      if (interaction.values[0] === "montajet") {
        // جلب معلومات نظام الطلبات و طلب العضو
        const orderSystem = await settingsDB.get(`orderSystem`);
        const montajetChannel = interaction.guild.channels.cache.get( orderSystem.montajetChannel );
        const firstResponseFinal =
          (await ordersDB.get(`order_${interaction.user.id}`)) || "";

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("Random")
          .setTimestamp()
          .setDescription(`** ### طلب جديد من ${interaction.user}
> الطلب :
\`\`\`${firstResponseFinal}\`\`\`
**`);
        const btns = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("deleteOrder")
            .setLabel("حذف")
            .setStyle(ButtonStyle.Secondary)
        );

        try {
          await interaction.update({
            content: `** \`✅\` تم ارسال طلبك الى البائعين بنجاح **`,
            components: [],
            ephemeral: true,
          });
          await montajetChannel.send({
            content: `||<@&${orderSystem.ordersRole}> | ${interaction.user}||`,
            embeds: [embed],
            components: [btns],
          });
          await montajetChannel.send( images.line );
        } catch (error) {
          console.log("⛔ error in order system", error);
          interaction.reply({
            content: `لقد حدث خطا يرجى الاتصال بالادارة`,
            ephemeral: true,
          });
        }
      }else if (interaction.values[0] === "tasamim") {
        // جلب معلومات نظام الطلبات و طلب العضو
        const orderSystem = await settingsDB.get(`orderSystem`);
        const montajetChannel = interaction.guild.channels.cache.get( orderSystem.tasamimChannel ); // تعديل
        const firstResponseFinal =
          (await ordersDB.get(`order_${interaction.user.id}`)) || "";

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("Random")
          .setTimestamp()
          .setDescription(`** ### طلب جديد من ${interaction.user}
> الطلب :
\`\`\`${firstResponseFinal}\`\`\`
**`);
        const btns = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("deleteOrder")
            .setLabel("حذف")
            .setStyle(ButtonStyle.Secondary)
        );

        try {
          await interaction.update({
            content: `** \`✅\` تم ارسال طلبك الى البائعين بنجاح **`,
            components: [],
            ephemeral: true,
          });
          await montajetChannel.send({
            content: `||<@&${orderSystem.ordersRole}> | ${interaction.user}||`,
            embeds: [embed],
            components: [btns],
          });
          await montajetChannel.send( images.line );
        } catch (error) {
          console.log("⛔ error in order system", error);
          interaction.reply({
            content: `لقد حدث خطا يرجى الاتصال بالادارة`,
            ephemeral: true,
          });
        }
      }else if (interaction.values[0] === "barmajyat") {
        // جلب معلومات نظام الطلبات و طلب العضو
        const orderSystem = await settingsDB.get(`orderSystem`);
        const montajetChannel = interaction.guild.channels.cache.get( orderSystem.barmajyatChannel ); // تعديل
        const firstResponseFinal =
          (await ordersDB.get(`order_${interaction.user.id}`)) || "";

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor("Random")
          .setTimestamp()
          .setDescription(`** ### طلب جديد من ${interaction.user}
> الطلب :
\`\`\`${firstResponseFinal}\`\`\`
**`);
        const btns = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("deleteOrder")
            .setLabel("حذف")
            .setStyle(ButtonStyle.Secondary)
        );

        try {
          await interaction.update({
            content: `** \`✅\` تم ارسال طلبك الى البائعين بنجاح **`,
            components: [],
            ephemeral: true,
          });
          await montajetChannel.send({
            content: `||<@&${orderSystem.ordersRole}> | ${interaction.user}||`,
            embeds: [embed],
            components: [btns],
          });
          await montajetChannel.send( images.line );
        } catch (error) {
          console.log("⛔ error in order system", error);
          interaction.reply({
            content: `لقد حدث خطا يرجى الاتصال بالادارة`,
            ephemeral: true,
          });
        }
      }
    } else if (interaction.customId == "deleteOrder") {
      const orderSystem = await settingsDB.get(`orderSystem`);
      if (!interaction.member.roles.cache.has(orderSystem.ordersAdminRole))
        return interaction.reply({
          content: `\`❌\` انت لست مسؤول طلبات`,
          ephemeral: true,
        });
      const modal = new ModalBuilder()
        .setTitle("سبب حذف الطلب")
        .setCustomId("deleteOrderModalSubmit");
      const deleteOrderReasonInpt = new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("deleteOrderReasonInpt")
          .setLabel("سبب حذف الطلب")
          .setStyle(TextInputStyle.Short)
      );

      modal.addComponents(deleteOrderReasonInpt);
      await interaction.showModal(modal);
    } else if (interaction.customId == "deleteOrderModalSubmit") {
      try {
        // جلب معلومات نظام الطلبات
        const orderSystem = await settingsDB.get(`orderSystem`);
        // جلب العضو الذي تم منشنته في الرسالة
        const mentionedUserRegex = /<@!?(\d+)>/;
        const mentionedUserMatch = interaction.message.content.match(
          mentionedUserRegex
        );
        const mentionedUserId = mentionedUserMatch[1];
        const mentionedUser = interaction.guild.members.cache.get(
          mentionedUserId
        );

        // الرد برسالة
        await interaction.reply({
          content: `\`✅\` - تم حذف الطلب بنجاح`,
          ephemeral: true,
        });
        // جلب سبب الحذف
        const deleteOrderReason = await interaction.fields.getTextInputValue(
          "deleteOrderReasonInpt"
        );
        // ارسال رسالة الى صاحب الطلب
        await mentionedUser
          .send({
            content: `> \`✅\` تم حذف طلبك \n \`-\` من قبل : <@${interaction.user.id}> \n \`-\` بسبب : _${deleteOrderReason}_`
          })
          .catch(() => {});
        // ارسال رسالة الى روم اللوج
        const logChannel = await interaction.guild.channels.cache.get(
          orderSystem.orderRoomLogs
        );
        var embed2 = new EmbedBuilder()
          .setColor("Purple")
          .setTitle(`**__New Remove Order__**`)
          .setDescription(`**Name Remove the Order :** __\`${interaction.user.tag}\`__ | ${interaction.user}
                                **Name Owner the Order :** __\`${mentionedUser.id}\`__ | ${mentionedUser}
                                **Remove Reason :** __\`${deleteOrderReason}\`__`);
        await logChannel.send({ embeds: [embed2] });
        // حذف الطلب
        await interaction.message.delete();
      } catch (error) {
        console.log("⛔ error in order system", error);
        interaction.reply({
          content: `لقد حدث خطا يرجى الاتصال بالادارة`,
          ephemeral: true,
        });
      }
    }
  },
};

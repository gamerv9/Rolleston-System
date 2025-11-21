const {
  Message,
  Events,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { Database } = require("st.db");
const settingsDB = new Database("/database/settings.json");
const { hexEmbedColor, images } = require("../../config.js");

module.exports = {
  name: Events.MessageCreate,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    if (message.author.bot) return;

    const feedbackRoom = await settingsDB.get("feedbackRoom") || null;
    if (message.channel.id !== feedbackRoom) return;

    const msgContent = message.content;

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("feedback_rating")
      .setPlaceholder("اختر تقييمك من 1 إلى 5")
      .addOptions([
        { label: "⭐", value: "1" },
        { label: "⭐⭐", value: "2" },
        { label: "⭐⭐⭐", value: "3" },
        { label: "⭐⭐⭐⭐", value: "4" },
        { label: "⭐⭐⭐⭐⭐", value: "5" },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const feedbackMessage = await message.reply({
      content: `كم نجمة تقيم رأيك ؟`,
      components: [row],
    });

    const collector = feedbackMessage.createMessageComponentCollector({
      filter: (interaction) =>
        interaction.customId === "feedback_rating" &&
        interaction.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      const selectedValue = interaction.values[0];
      const stars = "⭐".repeat(parseInt(selectedValue));

      await feedbackMessage.delete();

      const webhook = await message.channel.createWebhook({
        name: message.author.username,
        avatar: message.author.displayAvatarURL({ dynamic: true }),
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setColor(hexEmbedColor)
        .setDescription(`- **Feedback :** ${msgContent}\n\n-# **Rating:** ${stars}`)
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      await webhook.send({ content : `- <@${message.author.id}>`, embeds: [embed] });
      await webhook.send({files: [images.line]});
      await webhook.delete();
      await message.delete();
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        await feedbackMessage.delete().catch(() => {});
        await message.delete();
      }
    });
  },
};

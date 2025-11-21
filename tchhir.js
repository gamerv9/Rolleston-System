const { Client, ActivityType } = require("discord.js");
const Discord = require("discord.js");
const mongoose = require('mongoose');
const client = new Client({ intents: 131071 });
const { Database } = require('st.db');
const settingsDB = new Database("/database/settings.json");
const { images, tachhirPrefix } = require('./config.js');
require("dotenv").config();
const fs = require("fs");

const LOG_FILE = './log.txt';
function getTimestamp() {
  return `[${new Date().toLocaleString()}]`;
}
function log(type, message, isError = false) {
  const formatted = `${getTimestamp()} [${type}] ${message}`;
  console.log(formatted);
  fs.appendFileSync(LOG_FILE, formatted + '\n', 'utf8');
}

const prefix = tachhirPrefix;
const nassbinRoomId = settingsDB.get(`nassbinRoom`);
const kathiRoleId = settingsDB.get(`kadhiRole`);
const mshrofRoleId = settingsDB.get(`mshrofKodhatRole`);

client.on("ready", async (client) => {
  let activities = [
    `الاسرع - الافضل - الاضمن`,
    `.gg/shop`,
    `SHOP | الشوب الاقوى عربيا`,
    `Shop S`,
    `SHOP | خيارك الافضل`
  ], i = 0;
  setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Streaming, url: `https://twitch.tv/shop` }), 2000);
  log("READY", `Tachhir Bot is online as ${client.user.tag}`);
});

const NassabinModel = mongoose.model('نصابين', new mongoose.Schema({
  nassabID: String,
  mansoubID: String,
  Thestory: String,
  Proves: [String]
}, { timestamps: true }));

client.on("messageCreate", async (message) => {
  if (message.content == "تشهير") {
    if (!message.member.roles.cache.has(kathiRoleId))
      return message.reply(`\`❌\` | انت لست قاضي`);
    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL()}` })
      .setColor("Yellow")
      .setTitle(`**نموذج التبليغ عن النصب :**`)
      .setDescription(`**اضغط على الزر في الاسفل لأظهار النموذج**`);
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder().setEmoji("🕵️‍♂️").setCustomId(`setup_${message.author.id}`).setStyle("Secondary")
    );
    await message.reply({ embeds: [embed], components: [row] });
    log("COMMAND", `User ${message.author.tag} initiated setup`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId == `setup_${interaction.user.id}`) {
      log("INTERACTION", `User ${interaction.user.tag} opened modal`);
      const modal = new Discord.ModalBuilder().setCustomId("modal").setTitle("نموذج التبليغ عن النصب");
      let userid = new Discord.TextInputBuilder().setCustomId("userid").setLabel("ايدي صاحب البلاغ :").setRequired(true).setPlaceholder("ايدي صاحب البلاغ هنا").setStyle("Short");
      let scammerid = new Discord.TextInputBuilder().setCustomId("scammerid").setLabel("ايدي النصاب").setRequired(true).setPlaceholder("ايدي النصاب هنا").setStyle("Short");
      let scammertag = new Discord.TextInputBuilder().setCustomId("scammertag").setLabel("تاغ النصاب").setRequired(true).setPlaceholder("تاغ النصاب هنا").setStyle("Short");
      let story = new Discord.TextInputBuilder().setCustomId("story").setLabel("القصة :").setRequired(true).setPlaceholder("اكتب القصة كاملة هنا").setStyle("Paragraph");
      let proof = new Discord.TextInputBuilder().setCustomId("proof").setLabel("دلائل النصب(روابط فقط بين كل رابط حط | ):").setRequired(true).setPlaceholder("اكتب دلائل النصب بالروابط هنا").setStyle("Paragraph");
      const first = new Discord.ActionRowBuilder().addComponents(userid);
      const second = new Discord.ActionRowBuilder().addComponents(scammerid);
      const third = new Discord.ActionRowBuilder().addComponents(scammertag);
      const four = new Discord.ActionRowBuilder().addComponents(story);
      const five = new Discord.ActionRowBuilder().addComponents(proof);
      modal.addComponents(first, second, third, four, five);
      await interaction.showModal(modal);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isModalSubmit()) {
    if (interaction.customId == "modal") {
      try {
        let userid = await interaction.fields.getTextInputValue("userid");
        let scammerid = await interaction.fields.getTextInputValue("scammerid");
        let scammertag = await interaction.fields.getTextInputValue("scammertag");
        let story = await interaction.fields.getTextInputValue("story");
        let proof = await interaction.fields.getTextInputValue("proof");

        log("REPORT", `Received report from ${interaction.user.tag} about scammer ID ${scammerid}`);

        const check = await NassabinModel.findOne({ nassabID: scammerid });
        if (check) return interaction.message.edit({ content: `\`❌\` هذا الشخص موجود بالفعل في قائمة النصابين` });

        const directoryUrls = proof.split('|').map(link => link.trim());

        let theNassabinRoom = await interaction.guild.channels.cache.get(nassbinRoomId);
        if (!theNassabinRoom) return interaction.reply(`\`❌\` | لم اعثر على روم النصابين`);

        let theMansoub = await client.users.cache.get(userid);
        let theNassab = await interaction.guild.members.cache.get(scammerid);

        if (theNassab) {
          log("ROLE", `Removing all roles and adding 'نصاب' to ${scammerid}`);
          await theNassab.roles.set([]);
          const roleToAdd = interaction.guild.roles.cache.find(role => role.name === 'نصاب');
          if (roleToAdd) {
            await theNassab.roles.add(roleToAdd);
          }
        }

        await NassabinModel.create({
          nassabID: scammerid,
          mansoubID: userid,
          Thestory: story,
          Proves: directoryUrls
        });

        let embed = new Discord.EmbedBuilder()
          .setTitle('نصاب جديد')
          .addFields(
            { name: 'القاضي', value: `${interaction.user}`, inline: true },
            { name: 'صاحب البلاغ', value: `${theMansoub ? theMansoub.username : "الاسم غير محدد"} \n __\`${userid}\`__`, inline: true },
            { name: 'النصاب', value: `${scammertag} __ \n \`${scammerid}\`__`, inline: true },
            { name: 'القصة كاملة', value: `\`\`\`${story}\`\`\``, inline: false }
          );
        let btn = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel(`يجب اخذ وسيط لكل عملية شراء`).setCustomId('wassit_nassabin').setDisabled(true).setStyle(Discord.ButtonStyle.Danger));
        const themsg = await theNassabinRoom.send({ content: `** > ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ إِلَّا أَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ ۚ وَلا تَقْتُلُوا أَنْفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا﴾ **`, embeds: [embed], components: [btn] });
        await themsg.startThread({ name: `الدلائل` }).then(async (thread) => {
          for (const url of directoryUrls) {
            await thread.send(url);
          }
          await theNassabinRoom.send(images.line);
        });
        await interaction.message.edit({ content: `\`✅\` - تم تشهير النصاب بنجاح`, embeds: [], components: [] });
      } catch (error) {
        log("ERROR", error.stack || error.toString(), true);
      }
    }
  }
});

setTimeout(async () => {
  client.on('guildMemberAdd', async (member) => {
    const existingUser = await NassabinModel.findOne({ nassabID: member.id });
    if (existingUser) {
      const nassabRole = member.guild.roles.cache.find(role => role.name === 'نصاب');
      if (nassabRole) {
        await member.roles.set([]);
        await member.roles.add(nassabRole);
        member.guild.channels.cache.forEach(async (channel) => {
          if (channel.name === "روم-النصابين") return;
          await channel.permissionOverwrites.create(nassabRole, { ViewChannel: false });
        });
        log("ROLE", `Assigned 'نصاب' role to ${member.user.tag}`);
      } else {
        log("ROLE", `Role 'نصاب' not found for ${member.user.tag}`);
      }
    }
  });
}, 15000);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("فحص")) {
    const args = message.content.split(' ');
    const mention = message.mentions.users.first();
    const userId = mention ? mention.id : args[1];
    if (!userId) return message.reply(`\`❌\` | ضع ايدي الشخص او منشنه من فضلك`);

    const member = message.client.users.cache.get(userId);
    const check = await NassabinModel.findOne({ nassabID: userId });

    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: member.username, iconURL: member.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
    let btn = new Discord.ButtonBuilder().setCustomId('scammersCheck').setDisabled(true);

    if (check) {
      embed.setDescription(`### > \`🚨\` هذا الشخص \`نصاب\``)
        .addFields(
          { name: `قصة النصب`, value: `\`\`\`${check.Thestory}\`\`\``, inline: false },
          { name: `تاريخ الاضافة`, value: `<t:${Math.floor(check.createdAt.getTime() / 1000)}:R>`, inline: false }
        )
        .setColor("#BB2124");
      btn.setLabel(`لا تتعامل معه ابدا`).setStyle(Discord.ButtonStyle.Danger).setEmoji('❕');
    } else {
      embed.setDescription(`### > \`✅\` هذا الشخص \`ليس نصاب\``)
        .setColor("#22BB33");
      btn.setLabel(`خذ وسيطا لتضمن حقك`).setStyle(Discord.ButtonStyle.Success).setEmoji('💡');
    }

    const row = new Discord.ActionRowBuilder().addComponents(btn);
    message.reply({ embeds: [embed], components: [row] });
    log("CHECK", `User ${message.author.tag} checked user ID ${userId}`);
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("ازالة")) {
    if (!message.member.roles.cache.has(mshrofRoleId)) return message.reply(`\`❌\` | انت لست مسؤول القضاة`);
    const args = message.content.split(' ');
    const mention = message.mentions.users.first();
    const userId = mention ? mention.id : args[1];
    if (!userId) return message.reply(`\`❌\` | ضع ايدي الشخص او منشنه من فضلك`);

    const check = await NassabinModel.findOne({ nassabID: userId });
    if (!check) return message.reply(`\`❌\` | هذا الشخص غير موجود في قائمة النصابين`);

    await NassabinModel.findOneAndDelete({ nassabID: userId });
    const nassabRole = message.guild.roles.cache.find(role => role.name === 'نصاب');
    await message.guild.members.cache.get(userId).roles.remove(nassabRole).catch(() => {});

    const embed = new Discord.EmbedBuilder()
      .setColor('#11806a')
      .setDescription(`### \`✅\` | تمت إزالة الشخص من قائمة النصابين بنجاح.`);
    await message.reply({ embeds: [embed] });
    log("REMOVE", `Removed user ID ${userId} from scammers list by ${message.author.tag}`);
  }
});

client.login(process.env.tachhirToken);
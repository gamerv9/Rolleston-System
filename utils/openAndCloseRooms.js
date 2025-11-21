// جلب روم الاخبار و رومات البيع
const { Database } = require("st.db");
const settingsDB = new Database("/database/settings.json");
const { images } = require("../config");
const schedule = require("node-schedule");

async function openAndCloseFunction(client, EmbedBuilder) {
  const openAndCloseSystem = await settingsDB.get(`openAndCloseSystem`);
  const rule = new schedule.RecurrenceRule();
  rule.hour = openAndCloseSystem.closeHour || "00"; /// حط الوقت هنا بتوقيت تونس
  rule.minute = openAndCloseSystem.closeMinute || "00";
  rule.tz = openAndCloseSystem.tz;

  const job = schedule.scheduleJob(rule, async function () {
    openAndCloseSystem.buyChannels.forEach(async (channel) => {
      let ch = await client.channels.cache.get(channel);

      const guild = ch.guild;
      const everyoneRole = guild.roles.everyone;

      if (ch) {
        await ch.permissionOverwrites.edit(everyoneRole, {
          ViewChannel: false,
          SendMessages: false,
        });
      }
    });

    let log = await client.channels.cache.get(
      openAndCloseSystem.announcementsRoom
    );

    if (log) {
      await log.bulkDelete(100);
      await log.send({
        content: `@here`,
        embeds: [
          new EmbedBuilder()
            .setTitle(`${log.guild.name}`)
            .setDescription(`** الرومات مغلقه الان **`)
            .setColor("Red"),
        ],
      });
      await log.send(images.line);
    }
  });

  // اعدادات وقت فتح الرومات
  const rule1 = new schedule.RecurrenceRule();
  rule1.hour = openAndCloseSystem.openHour; /// حط الوقت هنا بتوقيت تونس
  rule1.minute = openAndCloseSystem.openMinute;
  rule1.tz = openAndCloseSystem.tz;

  const job1 = schedule.scheduleJob(rule1, async function () {
    openAndCloseSystem.buyChannels.forEach((channel) => {
      let ch = client.channels.cache.get(channel);

      const guild = ch.guild;
      const everyoneRole = guild.roles.everyone;

      if (ch) {
        ch.permissionOverwrites
          .edit(everyoneRole, {
            ViewChannel: true,
            SendMessages: false,
          })
          .then(async (x) => {
            const msges = await ch.messages.fetch();

            if (msges) await ch.bulkDelete(msges);
          });
      }
    });

    let log = await client.channels.cache.get(
      openAndCloseSystem.announcementsRoom
    );

    const currentDate = new Date();
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);

    if (log) {
      await log.bulkDelete(100);
      await log.send({
        content: `@here`,
        embeds: [
          new EmbedBuilder()
            .setTitle(`${log.guild.name}`)
            .setDescription(
              `** الرومات مفتوحه الان **
   `
            )
            .setColor("Green"),
        ],
      });
      await log.send(images.line);
    }
  });
}

module.exports = openAndCloseFunction;

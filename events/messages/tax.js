const { prefix } = require('../../config.js');
const { Message, EmbedBuilder, Events } = require("discord.js");
const config = require("../../config.js");
const pbtax = require('pb-tax');

module.exports = {
    name: Events.MessageCreate,
    aliases: ["الضرائب"],
    /**
     * 
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.content.startsWith(prefix + "tax") || message.content.startsWith(prefix + "ضريبة") || message.content.startsWith(prefix + "ضريبه") || message.content.startsWith(prefix + "t")) {
            try {
                const args = message.content.split(" ");

                if (!args[1]) return message.reply(`**🤔 يبدو انك لم تذكر المبلغ المراد 7ساب ضريبته**`);

                let number = args[1];
                if (number.endsWith("m")) number = number.replace(/m/gi, "") * 1000000;
                else if (number.endsWith("k")) number = number.replace(/k/gi, "") * 1000;
                else if (number.endsWith("K")) number = number.replace(/K/gi, "") * 1000;
                else if (number.endsWith("M")) number = number.replace(/M/gi, "") * 1000000;
                else if (number.endsWith("B")) number = number.replace(/B/gi, "") * 1000000000;
                else if (number.endsWith("b")) number = number.replace(/b/gi, "") * 1000000000;
                else if (number.endsWith("T")) number = number.replace(/T/gi, "") * 1000000000000;
                else if (number.endsWith("t")) number = number.replace(/t/gi, "") * 1000000000000;

                if (isNaN(number)) return message.reply(`**🤔 يبدو انك لم تذكر المبلغ المراد 7ساب ضريبته بشكل صحيح**`);

                let percentage = 5;
                if (args[2] && args[2].endsWith("%")) {
                    percentage = parseFloat(args[2].replace("%", ""));
                    if (isNaN(percentage)) return message.reply(`**🤔 يبدو انك لم تذكر النسبة بشكل صحيح**`);
                }

                const tax = pbtax(number);
                const amountWithPercentage = tax.wasit;
                const taxMediator = parseInt(tax.wasit) - parseInt(tax.all);

                const percentageAmount = (number * percentage) / 100;
                const totalAmountWithPercentage = parseFloat(amountWithPercentage) + percentageAmount;

                const embed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic: true}) })
                    .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
                    .setColor(config.hexEmbedColor)
                    .addFields(
                        { name: `ضريبة البروبوت - 🤖`, value: `> \`${parseInt(tax.all) - parseInt(number)}\``, inline: false },
                        { name: `ضريبة الوسيط - ⚖️`, value: `> \`${taxMediator}\``, inline: false },
                        { name: `المبلغ بدون ضريبة الوسيط - ⛔`, value: `> \`${tax.all}\``, inline: false },
                        { name: `المبلغ الاجمالي - 🧮`, value: `> \`${tax.wasit}\``, inline: false },
                        { name: `المبلغ الاجمالي + ${percentage}% - 📊`, value: `> \`${totalAmountWithPercentage}\``, inline: false },
                        { name: `المبلغ بدون ضرائب - 💰`, value: `> \`${number}\``, inline: false },
                    )
                    .setTimestamp()
                    .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL({ dynamic: true }) });

                message.reply({ embeds: [embed] });
            } catch (error) {
                console.log(error);
            }
        }
    }
};

const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db")
const settingsDB = new Database("/database/settings.json")
const timestamp = require('discord-timestamp');
const moment = require("moment");
const { hexEmbedColor, images } = require('../config.js')


async function checkPrivateRoomsCount(client) {
	const privateroomsAvailable = await settingsDB.get(`privateroomsAvailable`);
	if(!privateroomsAvailable && privateroomsAvailable !== 0) return;
	const privateRoomsCount = await settingsDB.get(`privateRoomsCount`)
	if(!privateRoomsCount) return;
	const { privateRoomsCountMsgId , privateRoomsCounttChannelId } = privateRoomsCount
	if(!privateRoomsCountMsgId || !privateRoomsCounttChannelId) return;
	let embed = new EmbedBuilder()
					.setColor(hexEmbedColor)
					.setDescription(`** عدد الرومات الخاصة المتوفره : \`${privateroomsAvailable !== 0 ? privateroomsAvailable : "غير متوفرة"}\` **

					<t:${timestamp(moment(Date.now()))}:R> **اخر تحديث في**
					`)
					.setImage(images.privateRooms || null);
	client.channels.cache.get(privateRoomsCounttChannelId).messages.fetch(privateRoomsCountMsgId).then(msg1 => msg1.edit({embeds: [embed]})).catch(async err => {
		client.channels.cache.get(privateRoomsCounttChannelId).send({embeds: [embed]}).then(async msg => {
			privateRoomsCount.privateRoomsCountMsgId = msg.id;
			settingsDB.set(`privateRoomsCount` , privateRoomsCount)
		})
		})
}

module.exports = checkPrivateRoomsCount
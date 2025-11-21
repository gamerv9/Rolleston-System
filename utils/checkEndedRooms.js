const { EmbedBuilder, ActionRowBuilder , ButtonStyle, ButtonBuilder } = require("discord.js");
const { Database } = require("st.db")
const settingsDB = new Database("/database/settings.json")
const timestamp = require('discord-timestamp');
const moment = require("moment");
const pricesDB = new Database("/database/prices.json")
const {privateRoomsModel} = require('../database/schemas/privateRoomsModel');

// Check private rooms
async function checkEndedRooms(client) {
	try {
	  const currentDateTime = new Date();
	  const endedRooms = await privateRoomsModel.find({ room_endedAt: { $lte: currentDateTime } , room_status : "on" });
		
	  for (const room of endedRooms) {
		// التعاريف الخاصة
		const privateRoomsPrices = await pricesDB.get(`privateRooms`);

		// سيعود اذا الروم فعالة
		if(room.room_status == "renew") return;

		// حذف جميع الرسائل في الروم الخاصة
		const channel = await client.channels.fetch(room.room_id)
		await channel.bulkDelete(100)
  
		// ارسال رسالة الى خاص العضو
		const user = await client.users.fetch(room.userId);
		await user.send({content : `**عميلنا العزيز،**\n**اشتراكك في الروم خاصة <#${channel.id}> سينتهي بعد يومين يرجي التجديد قبل انتهاء المده .**\n**\`سعر التجديد فقط ${privateRoomsPrices.renew} كريدت\`**`});

		// ارسال رسالة الى الروم الخاصة
		let embed_end = new EmbedBuilder()
								.setDescription(`انتهت صلاحية اشتراك الروم ، إذا كنت ترغب في تجديدها ، فلديك يومان لتجديده أو ستحذف الروم`)
								.setColor("#9b0e09")
		const row = new ActionRowBuilder().addComponents(
								new ButtonBuilder()
								.setStyle(ButtonStyle.Success)
								.setLabel("تجديد")
								.setCustomId(`renewConfirm`),
								new ButtonBuilder()
								.setStyle(ButtonStyle.Danger)
								.setLabel("عدم التجديد")
								.setCustomId(`renewCancel`)
		)
		const msg = await channel.send({content : `<@${room.userId}>` , embeds : [embed_end] , components : [row]});

		// تغيير صلاحية الروم لرتبة الايفري ون
		await channel.permissionOverwrites.create(channel.guild.roles.everyone , {
			ViewChannel : false
		})
		await channel.setRateLimitPerUser(0);

		// تغيير حالة الروم الى حالة : التجديد
		room.room_status = "renew";
		room.room_renew_msg_id = msg.id;
		await room.save();
	  }
	} catch (error) {
	  console.error('Error checking and processing ended rooms:', error);
	}
  }

module.exports = checkEndedRooms
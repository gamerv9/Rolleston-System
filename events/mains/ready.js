const { Client , Events , ActivityType   } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {Client} client 
	 */
	execute(client) {
		client.user.setStatus('online')
		console.log(`Ready! Logged in as ${client.user.tag} , My ID : ${client.user.id}`);
		let activities = [ `الاسرع - الافضل - الاضمن`, `.gg/shop`, `SHOP | الشوب الاقوى عربيا` , `Shop S` , `SHOP | خيارك الافضل` ], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}` , type: ActivityType.Streaming , url : `https://twitch.tv/shop` , }), 2000);
	},
};
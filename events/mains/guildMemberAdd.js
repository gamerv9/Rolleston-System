const { Events, GuildMember } = require('discord.js');
const { Database } = require('st.db');
const blacklistDB = new Database('/database/blackList');

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        const data = await blacklistDB.get('BlackList');
        const blacklistEntries = data?.filter((entry) => entry.userid == member.id);

        if (blacklistEntries && blacklistEntries.length > 0) {
            for (const entry of blacklistEntries) {
                await member.roles.add(entry.role);
                console.log(`Role ${entry.role} added to ${member.displayName} for blacklist type: ${entry.type}`);
            }
        }
    }
}
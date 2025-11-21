const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const tachfirDB = new Database("/database/tachfir.json")
const settingsDB = new Database("/database/settings.json")
const { hexEmbedColor, images } = require('../../config.js');

module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(!interaction.isStringSelectMenu()) return;

        if(interaction.customId === "rulesSelect"){
            await interaction.deferReply({ephemeral : true});

            let normalRolesIDs = (await settingsDB.get(`normalRolesIDs`)) || [];
            let rareRolesIDs = (await settingsDB.get(`rareRolesIDs`)) || [];
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
            let supportRole = await settingsDB.get('supportRole') || null;

            const data = [
                /// معلومات قوانين السيرفر
                {
                    id : "rulesSelect-server",
                    role : (interaction.member.roles.cache.has(interaction.guild.roles.cache.find((r) => r.name === "@everyone").id)),
                    permissionMessage : null,
                    title : "__Server Rules・قوانين السيرفر__",
                    description : "هنا وصف قوانين السيرفر"
                },
                /// معلومات قوانين البائعين
                {
                    id : "rulesSelect-seller",
                    role : roles,
                    permissionMessage : "أنت لست بائع في السيرفر عشان تشوف القوانين يحبيبي",
                    title : "__Sellers Rules・قوانين البائعين__",
                    description : "هنا وصف قوانين البائعين"
                },
                /// معلومات قوانين الإدارة
                {
                    id : "rulesSelect-support",
                    role : (interaction.member.roles.cache.has(supportRole)),
                    permissionMessage : "أنت لست اداري في السيرفر عشان تشوف القوانين يحبيبي",
                    title : "__Staff Rules・قوانين الإدارة__",
                    description : "هنا وصف قوانين الإدارة"
                },
            ]

            const currentData = await data.find((d) => d.id == interaction.values[0]);
            if(currentData){
                if(currentData.role){
                                    let embed = new EmbedBuilder()
                                    .setTitle(currentData.title)
                                    .setDescription(currentData.description)
                                    .setColor(hexEmbedColor);
                await interaction.editReply({embeds : [embed]});
                } else{
                    return interaction.editReply({content : `**${currentData.permissionMessage}**`})
                }
            }else{
                await interaction.editReply({content : `**لقد حدث خطأ الرجاء الإتصال بالإدارة**`})
            }
        }
  }
}
const {Events, Interaction, EmbedBuilder ,ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle  , StringSelectMenuBuilder , StringSelectMenuOptionBuilder} = require('discord.js');
const { Database } = require('st.db')
const tachfirDB = new Database("/database/tachfir.json")
const settingsDB = new Database("/database/settings.json")


module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
    * @param {client} Client
  */
  async execute(interaction){
        if(interaction.customId == "discountBtn"){
            interaction.reply({content : `ستتوفر هذه الميزة قريبا` , ephemeral : true})
        }
  }
}
const { Events, Interaction, EmbedBuilder ,InteractionType } = require('discord.js');
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
        if(!interaction.isButton()) return;
        if(interaction.customId == "cancelBtn"){
            await interaction.message.edit({content : `** ❌ | تم الغاء عملية الشراء بنجاح **` , embeds : [] , components : []})
        }
  }
}
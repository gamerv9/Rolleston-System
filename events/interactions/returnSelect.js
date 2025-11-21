const { Events, Interaction, StringSelectMenuBuilder , StringSelectMenuOptionBuilder , ButtonBuilder , ButtonStyle , ActionRowBuilder} = require('discord.js');
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
        if(interaction.customId == "returnSelect"){
            const select = new StringSelectMenuBuilder()
                .setCustomId('buySelect')
                .setPlaceholder('انفر هنا لشراء الشيء الذي تريده')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('رتبة عادية')
                        .setDescription('لشراء رتبة بائع عادية تمكنك من نشر منشوراتك')
                        .setValue('roleNormal'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('رتبة فخمة')
                        .setDescription('لشراء رتبة بائع نادرة بمميزات قوية')
                        .setValue('roleRare'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('روم خاصة')
                        .setDescription('لشراء روم خاصة باسم انت تختاره')
                        .setValue('privateRoom'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('منشور مميز')
                        .setDescription('لشراء منشور مميز بمنشن هير او ايفري ون')
                        .setValue('postSpecial'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('ازالة تحذير')
                        .setDescription('لازالة جميع تحذيراتك')
                        .setValue('warnRemove'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('اعلان')
                        .setDescription('لشراء اعلان لسيرفرك')
                        .setValue('AdS'),
                );
            const selectRow = new ActionRowBuilder().addComponents(select);

            const cancelBtn = new ButtonBuilder().setCustomId('cancelBtn').setLabel('الغاء العملية').setStyle(ButtonStyle.Danger).setEmoji('✖️');

            const discountBtn = new ButtonBuilder().setCustomId('discountBtn').setLabel('كود خصم').setStyle(ButtonStyle.Success).setEmoji('🏷️');
            const gifBtn = new ButtonBuilder().setCustomId('gifBtn').setLabel('اهداء لصديق').setStyle(ButtonStyle.Primary).setEmoji('🎀');
            const btnsRow = new ActionRowBuilder().addComponents(discountBtn , gifBtn , cancelBtn);

			await interaction.deferUpdate();
            await interaction.message.edit({ content: `**・\`-\` _${interaction.guild.name}_ مرحبا بك <@${interaction.user.id}> 👋 ، نورت\n・\`-\` من فضلك قم باختيار الذي تريد شراءه من القائمة التاليه :**`, components: [selectRow, btnsRow] , embeds : [] })
        }else if(interaction.customId == "buySupportTickets"){
            const select = new StringSelectMenuBuilder()
            .setCustomId('buySelect')
            .setPlaceholder('انفر هنا لشراء الشيء الذي تريده')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('رتبة عادية')
                    .setDescription('لشراء رتبة بائع عادية تمكنك من نشر منشوراتك')
                    .setValue('roleNormal'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('رتبة فخمة')
                    .setDescription('لشراء رتبة بائع نادرة بمميزات قوية')
                    .setValue('roleRare'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('روم خاصة')
                    .setDescription('لشراء روم خاصة باسم انت تختاره')
                    .setValue('privateRoom'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('منشور مميز')
                    .setDescription('لشراء منشور مميز بمنشن هير او ايفري ون')
                    .setValue('postSpecial'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('ازالة تحذير')
                    .setDescription('لازالة جميع تحذيراتك')
                    .setValue('warnRemove'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('اعلان')
                    .setDescription('لشراء اعلان لسيرفرك')
                    .setValue('AdS'),
            );
        const selectRow = new ActionRowBuilder().addComponents(select);

        const cancelBtn = new ButtonBuilder().setCustomId('cancelBtn').setLabel('الغاء العملية').setStyle(ButtonStyle.Danger).setEmoji('✖️');

        const discountBtn = new ButtonBuilder().setCustomId('discountBtn').setLabel('كود خصم').setStyle(ButtonStyle.Success).setEmoji('🏷️');
        const gifBtn = new ButtonBuilder().setCustomId('gifBtn').setLabel('اهداء لصديق').setStyle(ButtonStyle.Primary).setEmoji('🎀');
        const btnsRow = new ActionRowBuilder().addComponents(discountBtn , gifBtn , cancelBtn);

        await interaction.deferUpdate();
        await interaction.channel.send({ content: `**・\`-\` _${interaction.guild.name}_ مرحبا بك <@${interaction.user.id}> 👋 ، نورت\n・\`-\` من فضلك قم باختيار الذي تريد شراءه من القائمة التاليه :**`, components: [selectRow, btnsRow] , embeds : [] })
        }
  }
}
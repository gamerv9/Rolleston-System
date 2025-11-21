const { ContextMenuCommandBuilder , ApplicationCommandType } = require('discord.js')

const contextMenuData = [
    new ContextMenuCommandBuilder()
                .setName('تحذير البائع')
                .setType(ApplicationCommandType.Message),
    new ContextMenuCommandBuilder()
                .setName('سحب رتبة البائع')
                .setType(ApplicationCommandType.Message),
]

module.exports = contextMenuData;
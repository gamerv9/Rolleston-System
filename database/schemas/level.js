const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema(
    {
        "userId": {
            type: String,
            required: true
        },
        "guildId": {
            type: String,
            required: true
        },
        "xp": {
            type: Number,
            default: 0
        },
        "level": {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

levelSchema.statics.getUserRank = async function(userId, guildId) {
    const user = await this.findOne({ userId, guildId });
    if (!user) {
        return null; // User not found
    }

    const rank = await this.countDocuments({ guildId, $or: [{ level: { $gt: user.level } }, { level: user.level, xp: { $gt: user.xp } }] }) + 1;
    return rank;
};

module.exports = mongoose.model('staffLevel', levelSchema);


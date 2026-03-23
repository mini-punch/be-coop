const mongoose = require('mongoose');

const BannedUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    banned_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

BannedUserSchema.statics.createBan = function(userId){
    return this.create({user: userId});
};

BannedUserSchema.statics.removeByUserId = function(userId){
    return this.findOneAndDelete({user : userId});
};

module.exports = mongoose.model('BannedUser', BannedUserSchema);
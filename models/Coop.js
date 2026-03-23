const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const CoopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        tel: {
            type: String,
        },
        open_time: {
            type: String,
        },
        close_time: {
            type: String
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    },{
        timestamps: true
    }
);

CoopSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'coop',
    justOne: false
});

module.exports = mongoose.model('Coop', CoopSchema);

const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        default: 1
    },
    totalSeats: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    created: {
        type: Boolean,
        default: false
    }
})

const totalSeatsModel = mongoose.model('Total_Seats', Schema);

//initializing the total seats available
totalSeatsModel.findOne({ _id: 1, created: false })
    .then(doc => {
        const createTotalSeatsDoc = new totalSeatsModel({
            totalSeats: 500,
            available: true,
            created: true
        })

        createTotalSeatsDoc.save()
            .then((rec) => {
                console.log('created total seats collection')
            }).catch(err => console.log('Total seats already exist'))
    }).catch(err => console.log(err.message))

module.exports = totalSeatsModel;
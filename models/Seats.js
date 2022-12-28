const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    seatNo: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },

})

const seatsModel = mongoose.model('Seats', Schema);

//Creating the seats and set there availablity to false
const initializeCollection = async() => {

    for (let i = 1; i <= 500; i++) {
        const doc = await seatsModel.findOne({ seatNo: i })
        if (!doc) {
            const newSeat = new seatsModel({
                seatNo: i,
                available: true,

            })

            const checkCreation = await newSeat.save()
            if (!checkCreation)
                console.log('Seat not created')
        }
    }
}

initializeCollection()

module.exports = seatsModel;
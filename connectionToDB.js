const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/Seat_Booking', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((res) => console.log('connected to db')).catch(err => console.log('Error connecting to db'))
}
mongoose.set('strictQuery', true)
module.exports = connect
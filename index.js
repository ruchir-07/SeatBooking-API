const express = require('express');
const app = express();
const connect = require('./connectionToDB')
const seatsModel = require('./models/Seats');
const totalSeatsModel = require('./models/Total_Seats');

//Mutex lock for making process to act in atomic nature so that others are not able to access the
//same resource at the same time 
const { Mutex } = require('async-mutex');
const lock = new Mutex()

//connection to mongoDB
connect();

app.get('/availableSeats', (req, res) => {
    totalSeatsModel.findOne({ _id: 1 })
        .then(totalSeats => {
            seatsModel.find({ available: true })
                .then(doc => res.json({ totalSeats, doc }))
                .catch(err => res.json({ error: err.message }))
        }).catch(err => res.json({ error: err.message }))

})

app.post('/bookSeat/:seatNo', (req, res) => {
    const { seatNo } = req.params
    seatsModel.findOne({ seatNo })
        .then(async(doc) => {
            if (doc.available && !lock.isLocked()) {

                await lock.runExclusive(() => {
                    seatsModel.findOneAndUpdate({ seatNo }, { $set: { available: false } })
                        .then(async(rec) => {
                            //decrementing the total number of seats
                            await totalSeatsModel.findOneAndUpdate({ _id: 1 }, { $inc: { totalSeats: -1 } })
                            return res.json({ bookingStatus: `Seat no ${seatNo} booked successfully` });
                        }).catch(err => {
                            return res.json({ bookingStatus: `Seat no ${seatNo} wasn't booked`, error: err.message })
                        })
                })


            } else {
                return res.json({ availablity: `Seat No ${seatNo} already booked`, available: doc.available })
            }
        }).catch(err => {
            return res.json({ error: err.message })
        })
});

app.post('/unbookSeat/:seatNo', (req, res) => {
    const { seatNo } = req.params;

    seatsModel.findOne({ seatNo })
        .then(async(doc) => {

            if (doc.available)
                return res.json({ message: `Seat No ${seatNo} is already available, please try to book again` })
            else {
                await seatsModel.findOneAndUpdate({ seatNo }, { $set: { available: true } });
                await totalSeatsModel.findOneAndUpdate({ _id: 1 }, { $inc: { totalSeats: 1 } })

                return res.json({ message: `Seat No ${seatNo} is unbooked successfully` })
            }
        }).catch(err => res.json({ message: err.message }))
})

const PORT = 2002;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
const mongoose = require('mongoose')
const AppointmentSchema = new mongoose.Schema({
    id: Number,
    firstName: String, 
    lastName: String,
    userEmail: String,
    userPhone: Number,
    serviceType: String,
    selectedDateTime: Date
})
const AppointmentModel = mongoose.model("myappointment",AppointmentSchema);
module.exports = AppointmentModel;
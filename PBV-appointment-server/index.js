const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000
const AppointmentModel = require('./models/Appointment')


require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

app.post("/Appointment", async (req, res) => {
    try {
        const { firstName, lastName, userEmail, userPhone, serviceType, selectedDateTime} = req.body;
        const appointment = await AppointmentModel.create({
            firstName,
            lastName,
            userPhone,
            userEmail,
            serviceType,
            selectedDateTime
        });
        res.status(201).json({ message: "Appointment created successfully", result: appointment });
    } catch (error) {
        res.status(500).json({ error: "Error creating appointment", details: error.message });
    }
});

app.get('/Modify/:account', async (req, res) => {
  try {
    const { account } = req.params;
    const myappointment = await AppointmentModel.find({ userEmail: account }).exec();
    res.json(myappointment);
  } catch (error) {
    console.error(`Error finding appointments for ${account}: ${error}`);
    return res.status(500).send('Error finding appointments');
  }
});

app.delete('/Modify/:account/:id', async (req, res) => {
    
    try {
      const { account, id } = req.params;
      // Use Mongoose to find and delete the appointment by its ID
      console.log(account);
      const deleteResult = await AppointmentModel.deleteOne({userEmail: account,  _id: id });
  
      if (deleteResult.deletedCount === 1) {
        return res.status(204).send(); // Successfully deleted
      } else {
        return res.status(404).send('Appointment not found');
      }
    } catch (error) {
      const { id } = req.params;
      console.error(`Error deleting appointment from ${email} with ID ${id}: ${error}`);
      return res.status(500).send('Error deleting appointment');
    }
  });
  
  
  

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server listening on ${PORT}`);
  });
  
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json');
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.TWILIOAUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

function checkApiKey(req, res, next) {
  const apiKey = req.header('x-api-key'); // API key sent in the request header
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
}

app.post('/send-sms', async (req, res) => {
  const { passengerPhoneNumbers, message, location, date } = req.body;

  // Check for missing parameters
  if (!passengerPhoneNumbers || passengerPhoneNumbers.length === 0 || !message) {
    return res.status(400).json({ error: 'Missing "to" or "message" field' });
  }

  const failedNumbers = [];
  const successNumbers = [];

  try {
    // Map each number to a promise
    const messagePromises = passengerPhoneNumbers.map(async (number) => {
      try {
        const messageResult = await client.messages.create({
          body: message,
          from: '+12567403186',
          to: number
        });
        successNumbers.push(number)
        return { sid: messageResult.sid, number }; // Return success with sid and number
      } catch (error) {
        failedNumbers.push({ number, error: error.message }); // Capture failed numbers and error
        return null; // Return null or some indication of failure
      }
    });

    // Wait for all messages to be processed
    const results = await Promise.all(messagePromises);

    // Filter out successful results
    const successfulResults = results.filter(result => result !== null);
    await updateOrSetDoc({documentId: date, location, newSMS: successNumbers})

    if(successfulResults.length === 0){
      return res.status(404).json({
        message: 'All phone numbers are invalid',
        failed: failedNumbers,
      });
    }
    else if (failedNumbers.length > 0) {
      // Send a response including both successful and failed results
      return res.status(207).json({
        message: 'Some SMS were sent successfully, but some failed',
        successful: successfulResults,
        failed: failedNumbers,
      });
    } else {
      // Send a response if all messages were successful
      return res.status(200).json({
        message: 'All SMS sent successfully',
        successful: successfulResults,
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});


app.get('/getEmails', async (req, res) => {
  const date = req.query.date
  const locationRef = db.collection('Dates').doc(date);
  const locations = await locationRef.get()
  res.json(locations.data())
})

async function updateOrSetDoc(obj) {
  try {
    const docRef = db.collection('Dates').doc(obj.documentId);
    const doc = await docRef.get();

    let locationArray = [];

    if (doc.exists) {
      // If document exists, retrieve the existing data
      const data = doc.data();
      locationArray = data.location || [];
    }

    // Find index of the entry with the matching PickupName
    const locationIndex = locationArray.findIndex(item => item.PickupName === obj.location);

    if (locationIndex !== -1) {
      if(obj.hasOwnProperty("newEmails")){
        if(locationArray[locationIndex].emails){
          locationArray[locationIndex].emails = [...new Set([...locationArray[locationIndex].emails, ...obj.newEmails])];
        }
        else{
          locationArray[locationIndex].emails = obj.newEmails
        }
      }
      if(obj.hasOwnProperty("newSMS")){
        if(locationArray[locationIndex].sms){
          locationArray[locationIndex].sms = [...new Set([...locationArray[locationIndex].sms, ...obj.newSMS])];
        }
        else{
          locationArray[locationIndex].sms = obj.newSMS
        }
      }
    } else {
      if(obj.hasOwnProperty("newEmails")) {
        locationArray.push({
          PickupName: obj.location,
          emails: obj.newEmails
        });
      }
      if(obj.hasOwnProperty("newSMS")) {
        locationArray.push({
          PickupName: obj.location,
          sms: obj.newSMS
        });
      }
    }


    // Update the document with the new location array
    await docRef.set({ location: locationArray });
    return {location: locationArray}

  } catch (error) {
    console.error('Error updating emails:', error);
  }
}

app.post('/add-emails', async (req, res) => {
  const { emails, date, location } = req.body
  const data = await updateOrSetDoc(date, location, emails)
  res.json({message: "Email Sent Successfully", data})
})

app.get('/', (req, res) => {
  res.send('Welcome to the email sender app!');
})

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'smtp', 'hotmail', etc.
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.PASSWORD,  // Replace with your email password
  }
})

async function sendEmail(to, subject, body){
  let mailOptions = {
    from: 'book@tourstoniagarafalls.com', // Replace with your email
    to: to,
    subject: subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error
  }
}

app.post('/send-emails-to-all', checkApiKey, async (req, res) => {
  const { locations } = req.body;
  console.log(locations)

  if (!locations || locations.length === 0) {
    return res.status(400).json({errorMsg: 'Missing to, subject, or text'});
  }


  try{
    locations.map(async (location) => {
      await Promise.all(location.passengerEmailAddresses.map(email => sendEmail(email, location.subject, location.body)))
        .then(() => updateOrSetDoc(location.date, location.location, location.passengerEmailAddresses))
    })

    res.json({message: "Email Sent Successfully"})
  }
  catch (error) {
    console.error('Error in /send-email:', error);
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
})

app.post('/send-email', checkApiKey, async (req, res) => {
  const { passengerEmailAddresses, subject, body, location, date } = req.body;
  if (passengerEmailAddresses.length === 0 || !subject || !body) {
    return res.status(400).json({ errorMsg: 'Missing to, subject, or text' });
  }

  try {
    await Promise.all(passengerEmailAddresses.map(email => sendEmail(email, subject, body)))
      .then(() => {
        const obj = {
          documentId: date,
          location,
          newEmails: passengerEmailAddresses
        }
        return updateOrSetDoc(obj)
      })
      .then((data) => res.json({ message: 'Email sent successfully', data}))

  } catch (error) {
    console.error('Error in /send-email:', error);
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT)
})

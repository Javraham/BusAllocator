const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json');
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
  console.log(apiKey, " ", process.env.API_KEY)
  if (!apiKey || apiKey !== process.env.API_KEY) {
    console.log(apiKey)
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
}


app.get('/emails', async (req, res) => {
  const date = req.query.date
  const emailRef = db.collection('Dates').doc(date);
  const email = await emailRef.get()
  res.json(email.data())
})

async function updateOrSetDoc(documentId, pickupName, newEmails) {
  try {
    const docRef = db.collection('Dates').doc(documentId);
    const doc = await docRef.get();

    let locationArray = [];

    if (doc.exists) {
      // If document exists, retrieve the existing data
      const data = doc.data();
      locationArray = data.location || [];
    }

    // Find index of the entry with the matching PickupName
    const locationIndex = locationArray.findIndex(item => item.PickupName === pickupName);

    if (locationIndex !== -1) {
      // If PickupName exists, update the emails array
      locationArray[locationIndex].emails = [...new Set([...locationArray[locationIndex].emails, ...newEmails])];
    } else {
      // If PickupName does not exist, add a new entry
      locationArray.push({
        PickupName: pickupName,
        emails: newEmails
      });
    }


    // Update the document with the new location array
    await docRef.set({ location: locationArray });
    return pickupName

  } catch (error) {
    console.error('Error updating emails:', error);
  }
}

app.post('/add-emails', async (req, res) => {
  const { emails, date, location } = req.body
  const pickupName = await updateOrSetDoc(date, location, emails)
  res.json(pickupName)
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

app.post('/send-email', checkApiKey, async (req, res) => {
  const { passengerEmailAddresses, subject, body } = req.body;
  console.log(passengerEmailAddresses, ' ' + subject, ' ' + body)
  if (passengerEmailAddresses.length === 0 || !subject || !body) {
    return res.status(400).json({ errorMsg: 'Missing to, subject, or text' });
  }

  try {
    await Promise.all(passengerEmailAddresses.map(email => sendEmail(email, subject, body)))
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in /send-email:', error);
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT)
})

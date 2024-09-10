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
        // const messageResult = await client.messages.create({
        //   body: message,
        //   from: '+12567403186',
        //   to: number
        // });
        successNumbers.push(number)
        return number
        // return { sid: messageResult.sid, number }; // Return success with sid and number
      } catch (error) {
        failedNumbers.push({ number, error: error.message }); // Capture failed numbers and error
        return null; // Return null or some indication of failure
      }
    });

    // Wait for all messages to be processed
    const results = await Promise.all(messagePromises);

    // Filter out successful results
    const successfulResults = results.filter(result => result !== null);

    const locationRef = db.collection('Dates').doc(date).collection('sms').doc(location);
    await locationRef.set({
      sentTo: admin.firestore.FieldValue.arrayUnion(...successNumbers),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

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
        data: {sentTo: successNumbers, location},
        failed: failedNumbers,
      });
    } else {
      // Send a response if all messages were successful
      return res.status(200).json({
        message: 'All SMS sent successfully',
        successful: successfulResults,
        data: {sentTo: successNumbers, location}
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

app.post('/send-whatsapp', async (req, res) => {
  const { passengerPhoneNumbers, message, date, location } = req.body;

  // Validate input
  if (!passengerPhoneNumbers || passengerPhoneNumbers.length === 0 || !message) {
    return res.status(400).json({ error: 'Missing "passengerPhoneNumbers" or "message" field' });
  }

  const failedNumbers = [];
  const successNumbers = [];

  try {
    // Create an array of promises to send WhatsApp messages
    const messagePromises = passengerPhoneNumbers.map(async (number) => {
      try {
        // const messageResult = await client.messages.create({
        //   body: message,
        //   from: 'whatsapp:+14155238886', // Your WhatsApp Business Number
        //   to: `whatsapp:${number}`,
        // });

        successNumbers.push(number);
        return number;
        // return { sid: messageResult.sid, number }; // Success object
      } catch (error) {
        failedNumbers.push({ number, error: error.message }); // Capture failures
        return null; // Returning null for failure
      }
    });

    // Await all promises concurrently
    const results = await Promise.all(messagePromises);

    console.log(successNumbers)
    if (successNumbers.length > 0) {
      const locationRef = db.collection('Dates').doc(date).collection('whatsapp').doc(location);

      try {
        await locationRef.set(
          {
            sentTo: admin.firestore.FieldValue.arrayUnion(...successNumbers),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true } // Merge to prevent overwriting existing data
        );
      } catch (error) {
        // Log the Firestore error
        console.error('Error updating Firestore:', error);
        return res.status(500).json({ error: 'Failed to update Firestore', details: error.message });
      }
      console.log('Firestore update successful:', { date, location });
    }

    // Process and send appropriate response
    const successfulResults = results.filter(result => result !== null);

    if (successfulResults.length === 0) {
      return res.status(404).json({
        message: 'All phone numbers are invalid',
        failed: failedNumbers,
      });
    }
    // Handle partial successes
    if (failedNumbers.length > 0) {
      return res.status(207).json({
        message: 'Some WhatsApp messages were sent successfully, but some failed',
        successful: successfulResults,
        failed: failedNumbers,
        data: {sentTo: successNumbers, location}
      });
    }

    // All messages sent successfully
    return res.status(200).json({
      message: 'All WhatsApp messages sent successfully',
      successful: successfulResults,
      data: {sentTo: successNumbers, location}
    });

  } catch (error) {
    // Global error handler for unexpected issues
    console.error('Unexpected error during WhatsApp message sending:', error);
    return res.status(500).json({ error: 'Failed to send WhatsApp messages', details: error.message });
  }
});


app.get('/getMessagesByDate', async (req, res) => {
  const {date, collection} = req.query
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  try {
    const messageRef = db.collection('Dates').doc(date).collection(collection);
    const snapshot = await messageRef.get();

    let messageData = [];
    snapshot.forEach(doc => {
      messageData.push({
        location: doc.id, // The location name is the document ID
        sentTo: doc.data().sentTo, // The list of emails sent to this location
        timestamp: doc.data().timestamp
      });
    });

    return res.status(200).json(messageData);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return res.status(500).json({ message: 'Error fetching emails', details: error.message });
  }
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
  const { passengerEmailAddresses, subject, body, location, date } = req.body;
  if (passengerEmailAddresses.length === 0 || !subject || !body) {
    return res.status(400).json({ errorMsg: 'Missing to, subject, or text' });
  }

  try {

    await Promise.all(passengerEmailAddresses.map(email => sendEmail(email, subject, body)));

    const locationRef = db.collection('Dates').doc(date).collection('emails').doc(location);
    console.log(locationRef)
    await locationRef.set({
      sentTo: admin.firestore.FieldValue.arrayUnion(...passengerEmailAddresses),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); // Merge in case the document exists

    res.json({ message: 'Emails sent successfully', data: {sentTo: passengerEmailAddresses, location}});
  } catch (error) {
    console.error('Error in /send-email:', error);
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT)
})

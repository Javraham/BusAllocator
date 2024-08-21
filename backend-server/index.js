const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')
require('dotenv').config();

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

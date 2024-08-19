const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

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
  }
}

app.post('/send-email', async (req, res) => {
  const { passengerEmailAddresses, subject, text } = req.body;
  if (!passengerEmailAddresses || !subject || !text) {
    return res.status(400).json({ error: 'Missing to, subject, or text' });
  }

  try {
   for(let email of passengerEmailAddresses){
     await sendEmail(email, subject, text)
   }
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT)
})

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the email sender app!');
})

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing to, subject, or text' });
  }

  // Create a transporter object
  let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'smtp', 'hotmail', etc.
    auth: {
      user: 'book@urstoniagarafalls.com', // Replace with your email
      pass: 'helloworld',  // Replace with your email password
    },
  });

  // Set up email data
  let mailOptions = {
    from: 'avrahamjonathan@gmail.com', // Replace with your email
    to: to,
    subject: subject,
    text: text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent', info });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT)
})

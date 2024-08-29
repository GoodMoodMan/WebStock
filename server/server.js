const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const app = express();
const User = require('./models/User');
const cors = require('cors');


app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://test:ljR36wHjImUdTaad@cluster0.flnm2su.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  // THIS NEEDS TO BE IN ENV FILE 
  // FOR PROJECT PURPOSE ONLY
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',  
  auth: {
    user: 'webnodemail123@gmail.com',  
    pass: 'itso qroi fmtt gvgj'
  }
});

app.post('/send-email', async (req, res) => {
  if(req.method === 'OPTIONS') {
    return res.status(200).json({ body: "OK" });
  }

  const { name, email, message } = req.body;

  const mailOptions = {
    from: 'webstock123@project.com',
    to: email,  // Send to the user's email
    subject: 'Thank you for your message',
    text: `Dear ${name},

Thank you for contacting us. We have received your message and will get back to you as soon as possible.

Here's a copy of your message:

${message}

Best regards,
Your Support Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// login verification
app.post('/users/login', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ body: "OK" });
  }

  const { username, password } = req.body;
  console.log(username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Remove password from user object before sending
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// signup user post
app.post('/users/signup', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ body: "OK" });
  }

  const { username, email, password } = req.body;
  console.log(username);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(401).json({ error: 'Username Taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
      admin: false
    });

    await newUser.save();
    return res.status(200).send('Signup Successful');
  } catch (error) {
    console.error('Error signing up user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
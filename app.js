require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport');
const cookieSession = require('cookie-session')

const userRouter= require("./routes/routes")
require('./passport-setup');

app.use(cors())
app.use(express.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'quickwork-session',
    keys: ['key1', 'key2']
  }))

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());
app.use("/", userRouter )

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))
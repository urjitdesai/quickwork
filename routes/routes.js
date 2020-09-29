const router= require("express").Router()
const isLoggedIn= require("../auth/middleware")
const passport = require('passport');
const fs= require("fs")
require('../passport-setup');

// Home page
router.get("/", (req, res) => res.send('Example Home page!'))
// If not authenticated
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/good', isLoggedIn, (req, res) => {

    const fs = require('fs');

    fs.appendFile('userlist.txt', req.user._json.email+"\r\n", function (err) {
    if (err) throw err;
    console.log('Saved!');
    });
    res.send(`Welcome mr ${req.user.displayName}!`)
})

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

// logout and reset session
router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

// send email route to the logged in user
router.get("/good/sendmail", isLoggedIn, (req, res)=> {

    const nodemailer = require('nodemailer');
    const receiver_email= req.user._json.email;
    console.log(req.user._json.email);
    //create transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // your gmail account
            pass: process.env.PASSWORD  //  your gmail password
        }
    });

    // Step 2- mailing options
    let mailOptions = {
        from: process.env.EMAIL, //  email sender
        to: receiver_email, //  email receiver which we get from req.user
        subject: 'Nodemailer - Test',
        text: 'This is a system generated email body sent by nodemailer!!'
    };

    // Step 3- send the email
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log(err);
        }
        return log('Email sent!!!');
    });

    res.send("Email sent successfully")

})
module.exports= router
const express = require('express');

const app = express();
const {userAuth} = require('./middleware/userAuth')
// Order of routes is important in the routes


// /getUser with multiple handlers

app.use('/user', userAuth)

app.get(
    "/getUser",
    userAuth,                                      // inline middleware
    [(req, res, next) => {
      console.log("handling 1st handler");
      next()
    },
    (req, res) => {
      console.log("handling 2st handler");
      res.send("Send response back to server");
    }]
  );

app.get('/user', (req, res) => {
    res.send({
        "firstname": "Raj",
        "lastname": "Kumar"
    })
})

app.get('/user/:userId', (req, res) => {
	console.log(req.params) // {userId : 1002}
	console.log(req.query) // {userIcon : cat}

    res.send(`user data for ${req.params.userId} and icon is ${req.query.userIcon}`)
})

// /user OR /uer  (s is optional)
app.get(/^\/u(s)?er$/, (req, res) => {
    res.send('Matched /user or /uer');
});

// /user, /usser, /usssser ... (one or more s)
app.get(/^\/us+er$/, (req, res) => {
    res.send('Matched /user, /usser, /usssser, etc.');
});

app.post('/user', (req, res) => {
    // save data to DB
    res.send('Data saved successfully')
})

app.delete('/user', (req, res) => {
    // delete data from DB
    res.send('deleted the data successfully')
})

app.use('/' , (req, res) => {
    res.send('This is the base url');
})

app.listen(7777, () => {
    console.log('app is running on port 7777')
})
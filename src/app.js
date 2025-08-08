const express = require('express');

const app = express();

// Order of routes is important

app.get('/user', (req, res) => {
    res.send({
        "firstname": "Raj",
        "lastname": "Kumar"
    })
})

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
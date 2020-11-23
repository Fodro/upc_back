const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const nanoid = require('nanoid');
const app = express();

const port = 8000
app.listen(port, () => {
    console.log(`Listening to ${port}`)
})

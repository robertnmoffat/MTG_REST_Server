const express = require('express');
import * as mongoose from 'mongoose';
const bodyParser = require('body-parser');
const CardModel = require('./models/CardModel');
const cardRouter = require('./routes/cardRouter')(CardModel);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

/**
 * Connect to appropriate database depending on testing.
 * This project only implements get requests, so not really necessary but done anyway.
 */
async function connectToDB(): Promise<void> {
    if (process.env.ENV === 'Test') {
        await mongoose.connect('mongodb://localhost:27017/card_test')
            .then(() => { console.log('DB test connection successful.') })
            .catch((err) => { console.log(`DB connection error: ${err}`) });
    } else {
        await mongoose.connect('mongodb://localhost:27017/mtg')
            .then(() => { console.log('DB connection successful.') })
            .catch((err) => { console.log(`DB connection error: ${err}`) });
    }
}

connectToDB();


//Pass requests on to cardRouter
app.use('/api', cardRouter);



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});